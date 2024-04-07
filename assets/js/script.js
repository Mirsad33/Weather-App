$(document).ready(function () {
    // Function to fetch current weather data
    function fetchCurrentWeather(city) {
      const apiKey = "3ab95d3af40f4dbfb19f14cd9cacb9e7"; // Replace your API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  
      return $.get(apiUrl);
    }
  
    // Function to fetch forecast weather data
    function fetchForecast(city) {
      const apiKey = "3ab95d3af40f4dbfb19f14cd9cacb9e7";
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  
      return $.get(apiUrl);
    }
  
    // Function to display current weather data with icon
    function displayCurrentWeather(currentData) {
      $("#current-temp").html(`Temp: ${currentData.main.temp.toFixed(0)} &deg;F`);
      $("#wind-speed").html(`Wind Speed: ${currentData.wind.speed} mph`);
      $("#humidity").html(`Humidity: ${currentData.main.humidity}%`); // Add humidity information
  
      // Get weather condition code
      const weatherCode = currentData.weather[0].id;
      let iconClass = "";
  
      // Map weather condition code to Font Awesome icon class
      if (weatherCode >= 200 && weatherCode < 300) {
        iconClass = "fas fa-bolt"; // Thunderstorm
      } else if (weatherCode >= 300 && weatherCode < 400) {
        iconClass = "fas fa-cloud-showers-heavy"; // Drizzle
      } else if (weatherCode >= 500 && weatherCode < 600) {
        iconClass = "fas fa-cloud-rain"; // Rain
      } else if (weatherCode >= 600 && weatherCode < 700) {
        iconClass = "fas fa-snowflake"; // Snow
      } else if (weatherCode >= 700 && weatherCode < 800) {
        iconClass = "fas fa-smog"; // Atmosphere
      } else if (weatherCode === 800) {
        iconClass = "fas fa-sun"; // Clear
      } else if (weatherCode > 800 && weatherCode < 900) {
        iconClass = "fas fa-cloud"; // Clouds
      } else {
        iconClass = "fas fa-question"; // Default
      }
  
      // Update icon element
      $("#weather-icon").attr("class", iconClass);
    }
  
    // Function to display forecast weather data
    function displayForecastWeather(forecastData) {
      const forecastSection = $("#forecast-section");
      forecastSection.empty();
  
      // Keep track of dates to filter out duplicates
      const dates = {};
  
      forecastData.list.forEach(function (forecast) {
        // Extract date without time
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
  
        // Skip this entry if we've already added an entry for this date
        if (dates[dateString]) {
          return;
        }
  
        // Mark this date as added
        dates[dateString] = true;
  
        // Extract other necessary data
        const temp = forecast.main.temp.toFixed(0);
        const windSpeed = forecast.wind.speed;
        const humidity = forecast.main.humidity;
  
        // Create forecast item HTML
        const forecastItem = `
          <div class="forecast-item">
            <p>Date: ${dateString}</p>
            <p>Temp: ${temp} &deg;F</p>
            <p>Wind Speed: ${windSpeed} mph</p>
            <p>Humidity: ${humidity}%</p> <!-- Display humidity -->
          </div>`;
  
        // Append forecast item to forecast section
        forecastSection.append(forecastItem);
      });
    }
  
    // Function to save searched city to localStorage
    function saveSearchedCity(city) {
      let searchedCities = localStorage.getItem("searchedCities");
      if (!searchedCities) {
        searchedCities = [];
      } else {
        searchedCities = JSON.parse(searchedCities);
      }
  
      // Add the city to the array if it's not already there
      if (!searchedCities.includes(city)) {
        searchedCities.push(city);
      }
  
      // Store the updated array back in localStorage
      localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    }
  
    // Function to display search history
    function displaySearchHistory() {
      const searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
      if (searchedCities && searchedCities.length > 0) {
        const searchHistoryList = $("#search-history-list");
        searchHistoryList.empty();
  
        searchedCities.forEach(function (city) {
          const listItem = $("<li>").text(city);
          searchHistoryList.append(listItem);
        });
      }
    }
  
    // Event listener for form submission
    $("#city-form").submit(function (event) {
      event.preventDefault();
      const city = $("#city-input").val().trim();
  
      if (city !== "") {
        // Save searched city to localStorage
        saveSearchedCity(city);
  
        fetchCurrentWeather(city)
          .done(function (currentData) {
            displayCurrentWeather(currentData);
          })
          .fail(function (error) {
            console.log("Error fetching current weather:", error);
          });
  
        fetchForecast(city)
          .done(function (forecastData) {
            displayForecastWeather(forecastData);
          })
          .fail(function (error) {
            console.log("Error fetching forecast weather:", error);
          });
  
        // Display search history
        displaySearchHistory();
      }
    });
  
    // Event listener for modal search button
    $("#search-button-modal").click(function () {
      const city = $("#city-input-modal").val().trim();
  
      if (city !== "") {
        $("#searchModal").modal("hide"); // Hide modal
        $("#city-form")[0].reset(); // Reset form
  
        // Save searched city to localStorage
        saveSearchedCity(city);
  
        fetchCurrentWeather(city)
          .done(function (currentData) {
            displayCurrentWeather(currentData);
          })
          .fail(function (error) {
            console.log("Error fetching current weather:", error);
          });
  
        fetchForecast(city)
          .done(function (forecastData) {
            displayForecastWeather(forecastData);
          })
          .fail(function (error) {
            console.log("Error fetching forecast weather:", error);
          });
  
        // Display search history
        displaySearchHistory();
      }
    });
  
    // Event listener for 5-day forecast button
    $("#forecast-button").click(function () {
      const city = $("#city-input").val().trim();
  
      // Fetch forecast data
      fetchForecast(city)
        .done(function (forecastData) {
          // Clear previous forecast data
          $("#forecastModalBody").empty();
  
          // Populate modal with forecast data
          forecastData.list.forEach(function (forecast) {
            const date = new Date(forecast.dt * 1000);
            const dateString = date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });
            const temp = forecast.main.temp.toFixed(0);
            const windSpeed = forecast.wind.speed;
  
            const forecastItem = `
              <div class="forecast-item">
                <p>Date: ${dateString}</p>
                <p>Temp: ${temp} &deg;F</p>
                <p>Wind Speed: ${windSpeed} mph</p>
              </div>`;
            $("#forecastModalBody").append(forecastItem);
          });
  
          // Show the modal
          $("#forecastModal").modal("show");
        })
        .fail(function (error) {
          console.log("Error fetching forecast weather:", error);
        });
    });

    // Event listener for click on search history buttons
    $("#search-history-buttons").on("click", ".search-history-button", function() {
      const city = $(this).text().trim();
      fetchCurrentWeather(city)
        .done(function (currentData) {
          displayCurrentWeather(currentData);
        })
        .fail(function (error) {
          console.log("Error fetching current weather:", error);
        });

      fetchForecast(city)
        .done(function (forecastData) {
          displayForecastWeather(forecastData);
        })
        .fail(function (error) {
          console.log("Error fetching forecast weather:", error);
        });
    });

    // Event listener for clicking on a search history item
$("#search-history-list").on("click", "li", function() {
    const city = $(this).text().trim();
    
    fetchCurrentWeather(city)
      .done(function(currentData) {
        displayCurrentWeather(currentData);
      })
      .fail(function(error) {
        console.log("Error fetching current weather:", error);
      });
  
    fetchForecast(city)
      .done(function(forecastData) {
        displayForecastWeather(forecastData);
      })
      .fail(function(error) {
        console.log("Error fetching forecast weather:", error);
      });
  });
  

    // Display search history when the page loads
    displaySearchHistory();
});
