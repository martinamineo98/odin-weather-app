
import {retrieveAPIfromLocalStorage} from './dom.js'

const API = retrieveAPIfromLocalStorage()

// Geocoding API

async function fetchGeocodingAPI (location) {
	const response = await fetch(getGeocodingURL(location), {mode: 'cors'})
	const data = await response.json()
	return data
}

function getGeocodingURL (location) {
	return `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${API}`
}

// Current Weather Data API

async function fetchCurrentWeatherAPI (location) {
	const geocoding = await fetchGeocodingAPI(location)
	const response = await fetch(getCurrentWeatherURL(geocoding[0].lat, geocoding[0].lon), {mode: 'cors'})
	const data = await response.json()
	return data
}

function getCurrentWeatherURL (lat, lon) {
	return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`
}

// fetchCurrentWeatherAPI('Palermo').then((data) => console.log(data))

// Get an object that **only** contains the needed informations.
// Name, Country, Weather and Temperature.

async function getLocationInfo (location) {
	const geocoding = await fetchGeocodingAPI(location)
	const currentWeather = await fetchCurrentWeatherAPI (location)
	const name = await geocoding[0].name
	const country = await currentWeather.sys.country
	const weather = await currentWeather.weather[0]
	const temperature = await currentWeather.main
	const obj = {
		name: name,
		country: country,
		weather: weather,
		temperature: temperature
	}
	return obj
} 

// Convert the temperature from Kelvin to Celsius or Fahrenheit.
// The default  temperature scale used by OpenWeather is Kelvin.

function kelvinToCelsius (temperature) {
	return parseInt(temperature) - 273
}

function kelvinToFahrenheit (temperature) {
	return 1.8 * kelvinToCelsius(temperature) + 32
}

export {getLocationInfo, kelvinToCelsius, kelvinToFahrenheit}
