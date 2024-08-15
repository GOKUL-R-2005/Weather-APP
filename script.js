const form = document.querySelector('form');
const container = document.querySelector('.container');
const input = document.getElementById('input');
let iframe = document.querySelector('iframe');
const forecastContainer = document.querySelector('.forecast-container');

const kelvinToCelsius = (tempInKelvin) => tempInKelvin - 273.15;

// Debounce function to limit API calls
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    updateWeatherData(input.value);
});

input.addEventListener('input', debounce(() => {
    if (input.value.trim()) {
        updateWeatherData(input.value);
    }
}, 500));

function updateWeatherData(city) {
    iframe.src = `https://www.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    getData(city);
    getForecast(city);
}

let getData = async (city) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7f37666b148ef7b26142f7f143f232dc`;

    try {
        let res = await fetch(url);
        let data = await res.json();

        if (data.cod === 200) {
            container.innerHTML = `
                <p id="temp"><span>Temperature: </span>${kelvinToCelsius(data.main.temp).toFixed(1)}°C</p>
                <p id="minTemp"><span>Min-Temperature: </span> ${kelvinToCelsius(data.main.temp_min).toFixed(1)}°C</p>
                <p id="maxTemp"><span>Max-Temperature: </span>${kelvinToCelsius(data.main.temp_max).toFixed(1)}°C</p>
                <p id="wind"><span>Wind:</span> ${data.wind.speed} m/s</p>
                <p id="clouds"><span>Clouds:</span> ${data.clouds.all}%</p>
                <p id="sunrise"><span>Sunrise: </span>${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
                <p id="sunset"><span>Sunset:</span> ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
            `;
        } else {
            container.innerHTML = `<p>Error: ${data.message}</p>`;
        }
    } catch (error) {
        container.innerHTML = `<p>Error fetching data.</p>`;
    }
};

async function getForecast(city) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7f37666b148ef7b26142f7f143f232dc`;

    try {
        let res = await fetch(url);
        let data = await res.json();

        if (data.cod === "200") {
            let forecastHTML = '';
            const forecastData = data.list.filter((elem, index) => index % 8 === 0);

            forecastData.forEach(item => {
                const iconCode = item.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

                forecastHTML += `
                    <div>
                        <p>Date: ${new Date(item.dt * 1000).toLocaleDateString()}</p>
                        <img src="${iconUrl}" alt="Weather Icon">
                        <p>Temperature: ${kelvinToCelsius(item.main.temp).toFixed(1)}°C</p>
                        <p>Weather: ${item.weather[0].description}</p>
                    </div>
                `;
            });

            forecastContainer.innerHTML = forecastHTML;
        } else {
            forecastContainer.innerHTML = `<p>Error: ${data.message}</p>`;
        }
    } catch (error) {
        forecastContainer.innerHTML = `<p>Error fetching data.</p>`;
    }
}
