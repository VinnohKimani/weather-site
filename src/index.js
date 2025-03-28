document.addEventListener("DOMContentLoaded", () => {
  // Here I'm retrieving elements from the DOM
  const cityInput = document.getElementById("city");
  const weatherResults = document.getElementById("weather-results");
  const searchButton = document.querySelector("button");

  searchButton.addEventListener("click", getWeather);
  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getWeather(); // calling the get weather function
  });

  async function fetchWeatherByCity(cityName) {
    const response = await fetch(
      `http://localhost:3000/weather?city_like=${encodeURIComponent(cityName)}`
    ); //here I'm fetching the values of the city that match the cityName given
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    const exactMatch = data.find(
      (city) => city.city.toLowerCase() === cityName.toLowerCase()
    );

    return exactMatch || null;
  }

  // this function takes city data and displays it
  function displayWeather(cityData) {
    const weatherResults = document.getElementById("weather-results");

    if (!cityData) {
      showError("City not found. Please try another city.");
      return;
    }
    console.log("City Data:", cityData);
    console.log("Condition:", cityData.condition);
    // Here I'm updating weather details for chosen city
    const weatherIcon = getWeatherIcon(cityData.condition);
    // here I'm adding details to the ht,l about the weather
    weatherResults.innerHTML = `
    <div class="weather-card">
      <div class="weather-header">
        <h2 class="city-name">${cityData.city}</h2>
        <div class="weather-icon">${weatherIcon}</div>
      </div>
      <div class="temperature">${cityData.temperature}</div>
      <span class="condition ${getConditionClass(cityData.condition)}">
        ${cityData.condition}
      </span>
      <div class="details">
        <div class="detail-item">
          <span class="detail-icon">💧</span>
          <span class="detail-text">Humidity: ${cityData.humidity}</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🌬️</span>
          <span class="detail-text">Wind: ${cityData.wind_speed}</span>
        </div>
        ${
          cityData.pressure
            ? `
        <div class="detail-item">
          <span class="detail-icon"></span>
          <span class="detail-text">Pressure: ${cityData.pressure}</span>
        </div>`
            : ""
        }
      </div>
    </div>
  `;
  }

  function showError(message) {
    const weatherResults = document.getElementById("weather-results");
    weatherResults.innerHTML = `
    <div class="error">
      <span>⚠️</span>
      <p>${message}</p>
    </div>
  `;
  }

  function getWeatherIcon(condition) {
    const icons = {
      Sunny: "☀️",
      Humid: "💦",
      Cloudy: "☁️",
      Windy: "🌪️",
      Hot: "🔥",
      Foggy: "🌫️",
      Rainy: "🌧️",
      "Extremely Hot": "🥵",
    };
    return icons[condition] || "🌡️";
  }
  // here i'm taking weather conditions
  function getConditionClass(condition) {
    return condition.toLowerCase();
  }

    async function getWeather(event) {
        event?.preventDefault();
    const cityInput = document.getElementById("city");
    const cityName = cityInput.value.trim();

    if (!cityName) {
      showError("Please enter a city name");
      return;
    }

    // Here  Fetching  weather data for the entered city
    const cityData = await fetchWeatherByCity(cityName);
    if (!cityData) {
      showError("City not found. Please try another city.");
      return;
    }

    displayWeather(cityData);
  }
});