
import {getLocationInfo, kelvinToCelsius, kelvinToFahrenheit} from './app.js'

// Create a form that asks for the user's OpenWeather API and adds it
// to localStorage. When the API is present in the browser's localStorage
// hide the form, because it is now unneeded.

const formAPI = (function () {
	const form = createForm('form-api')
	
	const createInput = (function () {
		const label = document.createElement('label')
		const input = document.createElement('input')
		const button = document.createElement('button')
		const elements = [label, input, button]
		label.setAttribute('for', 'user-api')
		label.innerHTML = 'Input here your <a href="https://openweathermap.org/">Openweather API</a>'
		input.setAttribute('id', 'user-api')
		input.setAttribute('name', 'user-api')
		input.setAttribute('type', 'text')
		button.setAttribute('type', 'submit')
		button.textContent = 'Submit'
		elements.forEach((el) => form.appendChild(el))
		return {
			input
		}
	})()
	
	const submitForm = (function () {
		form.addEventListener('submit', function (f) {
			f.preventDefault()
			addAPItoLocalStorage()
			form.classList.add('isInvisible')
			location.reload()
		})
	})()
	
	// If the API is already present in the browser's localStorage,
	// hide the form.
	
	const hideForm = (function () {
		verifyIfAPIExists(() => {
			form.classList.add('isInvisible')
		})
	})()
	
	return {
		form,
		retrieveAPIfromLocalStorage
	}
})()

// Create a form that asks for the user's chosen location and then
// fetch its weather info.

const formLocation = (function () {
	const form = createForm('form-location')
	form.classList.add('isInvisible')
	
	const createInput = (function () {
		const input = document.createElement('input')
		const label = document.createElement('label')
		const button = document.createElement('button')
		const elements = [input, label, button]
		label.setAttribute('for', 'user-location')
		label.innerHTML = 'Input here your chosen location.'
		input.setAttribute('id', 'user-location')
		input.setAttribute('name', 'user-location')
		input.setAttribute('type', 'text')
		button.setAttribute('type', 'submit')
		button.textContent = 'Submit'
		elements.forEach((el) => form.appendChild(el))
		return {
			input
		}
	})()
	
	const submitForm = (function () {		
		form.addEventListener('submit', function (f) {
			const container = document.querySelector('.weather')
			const value = createInput.input.value
			f.preventDefault()
			
			const getInfo = (async function () {
				const info = await getLocationInfo(value)
				const name = await info.name
				const country = await info.country
				const icon = await info.weather.icon
				const description = await info.weather.description
				const temperature = await info.temperature.temp
				const temperatureCelsius = await kelvinToCelsius(temperature)
				const temperatureFahrenheit = await kelvinToFahrenheit(temperature)
				getCorrectIconURL(icon, description)
				getLocationName(name, country)
				getWeatherDescription(description)
				getCorrectTemperature(temperatureCelsius, temperatureFahrenheit)
				container.classList.add('isVisible')
			})()
		})
	})()
	
	const showForm = (function () {
		verifyIfAPIExists(() => {
			form.classList.remove('isInvisible')	
		})
	})()
	
})()

// Change Temperature Scale.

const changeCheckbox = (function () {
	const checkbox = getCheckbox()
	const containers = getTemperatureSpans()
	const c = containers[0]
	const f = containers[1]
	checkbox.addEventListener('change', () => {
		changeVisibleClass(c, f)
	})
})()

// Helper Functions.

function createForm (id) {
	const form = document.createElement('form')
	form.setAttribute('id', 'form-api')
	form.setAttribute('method', 'POST')
	form.setAttribute('action', '/')
	document.body.appendChild(form)
	return form
}

function addAPItoLocalStorage () {
	const form = formAPI.form
	const input = form.querySelector('input')
	const value = input.value
	localStorage['API_OpenWeather'] = value
}

function retrieveAPIfromLocalStorage () {
	return localStorage['API_OpenWeather']
}

function verifyIfAPIExists(callback) {
	if (localStorage.getItem('API_OpenWeather') !== null) {
		callback()
	}
}

function getCheckbox () {
	return document.querySelector('#weather-temperature-scale')
}

function getCheckboxState () {
	const checkbox = getCheckbox()
	return checkbox.checked
}

function getCorrectIconURL (icon, description) {
	const image = document.querySelector('.weather-icon')
	const src = `http://openweathermap.org/img/wn/${icon}@2x.png`
	image.src = src
	image.setAttribute('alt', description)
}

function getLocationName (name, country) {
	const container = document.querySelector('.weather-location')
	container.textContent = `${name}, ${country}`
}

function getWeatherDescription (description) {
	const container = document.querySelector('.weather-description')
	container.textContent = description
}

function getCorrectTemperature (celsius, fahrenheit) {
	const containers = getTemperatureSpans()
	const c = containers[0]
	const f = containers[1]
	c.textContent = `${celsius}°C`
	f.textContent = `${fahrenheit}°F`
	changeVisibleClass(c, f)
}

function getTemperatureSpans () {
	const containerCelsius = document.querySelector('.weather-temperature-celsius')
	const containerFahrenheit = document.querySelector('.weather-temperature-fahrenheit')	
	const containers = [containerCelsius, containerFahrenheit]
	return containers
}

function changeVisibleClass (celsius, fahrenheit) {
	const checkboxState = getCheckboxState()
	if (checkboxState === false) {
		celsius.classList.add('isVisible')
		fahrenheit.classList.remove('isVisible')
	} else {
		celsius.classList.remove('isVisible')
		fahrenheit.classList.add('isVisible')
	}	
}

// Example

export {retrieveAPIfromLocalStorage}
