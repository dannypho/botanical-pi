function fetchData() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            if(data.environment){
                document.getElementById('temp').innerText = 
                    `Temp: ${data.environment.temperature_c} °C / ${data.environment.temperature_f} °F`;
                document.getElementById('humidity').innerText =
                    `Humidity: ${data.environment.humidity} %`;
            }
            if(data.moisture){
                document.getElementById('moisture').innerText = 
                    `ADC: ${data.moisture.adc} / Voltage: ${data.moisture.voltage} V`;
            }
            if(data.light){
                document.getElementById('light').innerText = `Lux: ${data.light.lux}`;
            }
            if(data.water_detected){
                document.getElementById('water').innerText = 
                    `Detected: ${data.water_detected.water_detected}`;
            }
        });
}

function togglePump(on){
    fetch(on ? '/pump/on' : '/pump/off', {method: 'POST'});
}

function toggleLight(on){
    fetch(on ? '/light/on' : '/light/off', {method: 'POST'});
}

setInterval(fetchData, 2000);
fetchData();
