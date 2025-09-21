const apiKey = "66590c29db878821f84e5141bbe61f55";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const weatherInfo = document.querySelector(".weather-info");
const cityNameEl = document.getElementById("city-name");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const dateEl = document.getElementById("date");
const forecastContainer = document.getElementById("forecast-container");

// Fetch weather by city name
async function fetchWeather(city) {
  try {
    loading.classList.remove("hidden");
    weatherInfo.classList.add("hidden");

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await res.json();

    if (data.cod !== 200) {
      alert(`Error: ${data.message}`);
      loading.classList.add("hidden");
      return;
    }

    displayCurrentWeather(data);

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const forecastData = await forecastRes.json();
    displayForecast(forecastData);

    loading.classList.add("hidden");
    weatherInfo.classList.remove("hidden");
  } catch (error) {
    alert("Error fetching data.");
    console.error(error);
    loading.classList.add("hidden");
  }
}

// Display current weather
function displayCurrentWeather(data) {
  cityNameEl.textContent = data.name;

  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString(undefined, options);

  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  descriptionEl.textContent = data.weather[0].description;
  // شلنا الصورة تمام
}

// Display 3-day forecast بدون صور
function displayForecast(data) {
  forecastContainer.innerHTML = "";
  const dailyData = data.list.filter((item, index) => index % 8 === 0).slice(0, 3);

  dailyData.forEach(day => {
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
      <p>${Math.round(day.main.temp)}°C</p>
      <p>${day.weather[0].description}</p>
    `;
    forecastContainer.appendChild(card);
  });
}

// Event listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    }, error => {
      console.warn("Geolocation denied or unavailable, you can still search manually.");
    });
  }
});

// جلب الطقس حسب الإحداثيات
async function fetchWeatherByCoords(lat, lon) {
  try {
    loading.classList.remove("hidden");
    weatherInfo.classList.add("hidden");

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const data = await res.json();
    displayCurrentWeather(data);

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const forecastData = await forecastRes.json();
    displayForecast(forecastData);

    loading.classList.add("hidden");
    weatherInfo.classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching location weather:", error);
  }
}
