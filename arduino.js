// ─── Wait for page to fully load before running anything ───
window.addEventListener('load', () => {

    // ─── Connect to Arduino via USB ───
    async function connectSerial() {
        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });

            const reader = port.readable.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value);
                const lines = buffer.split('\n');
                buffer = lines.pop();

                lines.forEach(line => {
                    const sensorValue = parseInt(line.trim());
                    if (!isNaN(sensorValue)) {

                        // ─── Update the graph ───
                        photodiodeChart.data.datasets[0].data.push(sensorValue);
                        if (photodiodeChart.data.datasets[0].data.length > 20)
                            photodiodeChart.data.datasets[0].data.shift();
                        photodiodeChart.data.labels.push('');
                        if (photodiodeChart.data.labels.length > 20)
                            photodiodeChart.data.labels.shift();
                        photodiodeChart.update();

                        // ─── Update number + status badge ───
                        updateStatus(sensorValue);
                    }
                });
            }
        } catch (err) {
            console.error('Arduino connection error:', err);
            alert('Could not connect to Arduino. Make sure it is plugged in and try again.');
        }
    }

    // ─── Attach to the Connect Arduino button ───
    document.getElementById('connectBtn').addEventListener('click', connectSerial);

});