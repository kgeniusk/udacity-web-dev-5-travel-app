const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const cors = require('cors')

dotenv.config()

// to add trips in memory
let myTrips = []

// calculate difference of 2 days
const getDiffDays = (day1, day2) => Math.ceil((day1 - day2) / (1000 * 60 * 60 * 24))

// get string form of a date object
const getStringFormOfDate = (dateObj) => `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`

// index page
const index = (req, res) => res.sendFile(path.resolve(__dirname, '../../dist/index.html'))

// get all trips saved in memory
const getAllTrips = (req, res) => res.json(myTrips)

// add trip with weather information
async function addTrip(req, res) {

    const destination = req.body.destination
    const departingDate = new Date(req.body.departingDate)

    const today = new Date()
    const diffDays = getDiffDays(departingDate, today)

    // boolean value indicating if the weather data is a forecast.
    // Current weather: departing data is no more than 7 days
    // forecast weather: otherwise
    const forecast = diffDays > 7

    const trip = {
        tripId: `trip-${myTrips.length + 1}`,
        destination: destination,
        departingDate: getStringFormOfDate(departingDate),
        countdown: diffDays,
        forecast: forecast
    }

    // decide which url to use for weather information: forecast or current weather
    let weatherBitUrl = 'https://api.weatherbit.io/v2.0/'
    weatherBitUrl += forecast ? 'forecast/daily' : 'current'

    // get weather data
    // 1. get geocode
    // 2. get current weather or forecast
    await axios.get('http://api.geonames.org/postalCodeLookupJSON', {
        params: {
            placename: destination,
            country: 'DE',
            username: process.env.GEONAMES_USERNAME
        }
    })
        .then(res => res.data['postalcodes'][0])
        .then(geoData => axios.get(weatherBitUrl, {
            params: {
                lat: geoData.lat,
                lon: geoData.lng,
                key: process.env.WEATHERBIT_API_KEY
            }
        }))
        .then(res => res.data['data'][0])
        .then(weatherData => {
            trip.temperature = weatherData.temp
            trip.weatherDescription = weatherData.weather.description
        })

    // get image:
    // asynchronously to the call for getting weather data
    await axios.get('https://pixabay.com/api/', {
        params: {
            q: destination,
            per_page: 3,
            key: process.env.PIXABAY_API_KEY
        }
    })
        .then(res => res.data['hits'][0])
        .then(imageData => {
            // do something with image Data
            trip.imageUrl = imageData.webformatURL
        })

    myTrips.push(trip)
    res.json(trip)
}

const removeTrip = (req, res) => {
    myTrips = myTrips.filter(item => item.tripId !== req.params.tripId)
    res.send(`tripId ${req.params.tripId} deleted`)
}


const app = express()

app.use(express.static(path.resolve(__dirname, '../../dist')))
app.use(cors({
    origin: ['http://localhost:8080']
}))
app.use(express.json())

// router
app.get('/', index)
app.get('/trips', getAllTrips)
app.post('/trip', addTrip)
app.delete('/trip/:tripId', removeTrip)

app.listen(8081)

module.exports = getStringFormOfDate