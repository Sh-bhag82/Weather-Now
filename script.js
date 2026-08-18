async function getWeather() {

    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();

    const errorMessage =
        document.getElementById("errorMessage");

    if (city === "") {
        errorMessage.textContent =
            "Please enter a city name.";
        return;
    }

    errorMessage.textContent = "Loading weather...";


    try {

        // =========================================
        // API 1: GEOCODING API
        // City → Latitude + Longitude
        // =========================================

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;


        const geoResponse =
            await fetch(geoURL);


        if (!geoResponse.ok) {
            throw new Error(
                "Location service is not responding."
            );
        }


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {
            throw new Error(
                "City not found. Please enter a valid city."
            );
        }


        // Prefer Indian location
        let location =
            geoData.results.find(
                result => result.country_code === "IN"
            );


        // If Indian result is not available,
        // use the first result
        if (!location) {
            location = geoData.results[0];
        }


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;

        const cityName =
            location.name;

        const country =
            location.country;


        // =========================================
        // API 2: WEATHER API
        // Coordinates → Weather
        // =========================================

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility,surface_pressure&daily=sunrise,sunset&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;


        const weatherResponse =
            await fetch(weatherURL);


        if (!weatherResponse.ok) {
            throw new Error(
                "Weather service is not responding."
            );
        }


        const weatherData =
            await weatherResponse.json();


        const current =
            weatherData.current;


        // =========================================
        // LOCATION
        // =========================================

        document.getElementById("cityName")
            .textContent = cityName;


        document.getElementById("country")
            .textContent = country;


        // =========================================
        // DATE
        // =========================================

        const localTime =
            new Date(current.time);


        const dateText =
            localTime.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                }
            );


        document.getElementById("dateTime")
            .textContent = dateText;


        // =========================================
        // TEMPERATURE
        // =========================================

        document.getElementById("temperature")
            .textContent =
            `${Math.round(current.temperature_2m)}°C`;


        // =========================================
        // WEATHER
        // =========================================

        const weatherInfo =
            getWeatherInfo(
                current.weather_code
            );


        document.getElementById("description")
            .textContent =
            weatherInfo.description;


        document.getElementById("weatherIcon")
            .textContent =
            weatherInfo.icon;


        document.body.className =
            weatherInfo.background;


        // =========================================
        // FEELS LIKE
        // =========================================

        document.getElementById("feelsLike")
            .textContent =
            `${Math.round(current.apparent_temperature)}°C`;


        // =========================================
        // HUMIDITY
        // =========================================

        document.getElementById("humidity")
            .textContent =
            `${current.relative_humidity_2m}%`;


        // =========================================
        // WIND
        // =========================================

        document.getElementById("windSpeed")
            .textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;


        // =========================================
        // VISIBILITY
        // =========================================

        const visibilityKm =
            current.visibility / 1000;


        document.getElementById("visibility")
            .textContent =
            `${visibilityKm.toFixed(1)} km`;


        // =========================================
        // PRESSURE
        // =========================================

        document.getElementById("pressure")
            .textContent =
            `${Math.round(current.surface_pressure)} hPa`;


        // =========================================
        // SUNRISE
        // =========================================

        const sunrise =
            new Date(
                weatherData.daily.sunrise[0]
            );


        document.getElementById("sunrise")
            .textContent =
            sunrise.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        // =========================================
        // SUNSET
        // =========================================

        const sunset =
            new Date(
                weatherData.daily.sunset[0]
            );


        document.getElementById("sunset")
            .textContent =
            sunset.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        // Remove error
        errorMessage.textContent = "";


    } catch (error) {

        console.error(error);

        // Clear old weather information
        clearWeather();

        errorMessage.textContent =
            error.message;

    }
}


// =========================================
// CLEAR WEATHER
// =========================================

function clearWeather() {

    document.getElementById("cityName")
        .textContent = "--";

    document.getElementById("country")
        .textContent = "--";

    document.getElementById("dateTime")
        .textContent = "--";

    document.getElementById("temperature")
        .textContent = "--°C";

    document.getElementById("description")
        .textContent = "--";

    document.getElementById("weatherIcon")
        .textContent = "🌤️";

    document.getElementById("feelsLike")
        .textContent = "--°C";

    document.getElementById("humidity")
        .textContent = "--%";

    document.getElementById("windSpeed")
        .textContent = "-- km/h";

    document.getElementById("visibility")
        .textContent = "-- km";

    document.getElementById("pressure")
        .textContent = "-- hPa";

    document.getElementById("sunrise")
        .textContent = "--";

    document.getElementById("sunset")
        .textContent = "--";
}


// =========================================
// WEATHER INFORMATION
// =========================================

function getWeatherInfo(code) {

    if (code === 0) {

        return {
            description: "Clear Sky",
            icon: "☀️",
            background: "clear"
        };

    }


    if (
        code === 1 ||
        code === 2 ||
        code === 3
    ) {

        return {
            description: "Partly Cloudy",
            icon: "⛅",
            background: "cloudy"
        };

    }


    if (
        code === 45 ||
        code === 48
    ) {

        return {
            description: "Foggy",
            icon: "🌫️",
            background: "cloudy"
        };

    }


    if (
        code >= 51 &&
        code <= 57
    ) {

        return {
            description: "Drizzle",
            icon: "🌦️",
            background: "rain"
        };

    }


    if (
        code >= 61 &&
        code <= 67
    ) {

        return {
            description: "Rainy",
            icon: "🌧️",
            background: "rain"
        };

    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            description: "Snowy",
            icon: "❄️",
            background: "snow"
        };

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            description: "Rain Showers",
            icon: "🌦️",
            background: "rain"
        };

    }


    if (
        code >= 95 &&
        code <= 99
    ) {

        return {
            description: "Thunderstorm",
            icon: "⛈️",
            background: "storm"
        };

    }


    return {
        description: "Unknown Weather",
        icon: "🌤️",
        background: "cloudy"
    };
}


// =========================================
// ENTER KEY SEARCH
// =========================================

document
    .getElementById("cityInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                getWeather();
            }

        }
    );