import axios from "axios";


const renderTrip = (trip) => {

    const tripContentAreaContent = document.querySelector('.trip-content-area-content')
    const fragment = document.createDocumentFragment()

    // --
    // div: trip-image
    //   > div: image
    // --

    // create div image
    const divImage = document.createElement('img')
    divImage.setAttribute('src', trip.imageUrl)
    divImage.setAttribute('alt', trip.destination)
    divImage.classList.add('image')

    // create div trip-image
    const divTripImage = document.createElement('div')
    divTripImage.classList.add('trip-image')

    // append div image to div trip-image
    divTripImage.appendChild(divImage)

    // --
    // div: trip-detail
    //   > h2: &__destination
    //   > h3: &__departing-date
    //   > h4: &__countdown
    //   > h4: &__weather-info
    //   > p: &__weather-info
    //   > div: &__remove-button
    // --

    // create h2
    const h2Destination = document.createElement('h2')
    h2Destination.classList.add('trip-detail__destination')
    h2Destination.innerHTML = `My trip to: ${trip.destination}`

    // create h3
    const h3DepartingDate = document.createElement('h3')
    h3DepartingDate.classList.add('trip-detail__departing-date')
    h3DepartingDate.innerHTML = `Departing: ${trip.departingDate}`

    // create h4 - countdown
    const h4Countdown = document.createElement('h4')
    h4Countdown.classList.add('trip-detail__countdown')
    h4Countdown.innerHTML = `${trip.destination} is ${trip.countdown} days away`

    // create h4, p, p - weather info
    const h4WeatherInfo = document.createElement('h4')
    h4WeatherInfo.classList.add('trip-detail__weather-info')
    h4WeatherInfo.innerHTML = trip.forecast ? 'Forecast Weather:' : 'Current Weather:'

    const pTemperature = document.createElement('p')
    pTemperature.classList.add('trip-detail__weather-info')
    pTemperature.innerHTML = `${trip.temperature}ºC, ${trip.weatherDescription}`

    // create remove button and add event listener
    const divRemoveButton = document.createElement('div')
    divRemoveButton.classList.add('button')
    divRemoveButton.classList.add('trip-detail__remove-button')
    divRemoveButton.setAttribute('data-trip-id', trip.tripId)
    divRemoveButton.innerHTML = 'remove trip'
    divRemoveButton.addEventListener('click', removeTrip)

    // create div trip-detail
    const divTripDetail = document.createElement('div')
    divTripDetail.classList.add('trip-detail')

    // append children to div trip-detail
    divTripDetail.appendChild(h2Destination)
    divTripDetail.appendChild(h3DepartingDate)
    divTripDetail.appendChild(h4Countdown)
    divTripDetail.appendChild(h4WeatherInfo)
    divTripDetail.appendChild(pTemperature)
    divTripDetail.appendChild(divRemoveButton)

    // --
    // div: trip
    //   > div: trip-image
    //   > div: trip-detail
    // --

    // create div trip
    const divTrip = document.createElement('div')
    divTrip.classList.add('trip')
    divTrip.setAttribute('id', trip.tripId)

    // attach trip image and trip-detail to div trip
    divTrip.appendChild(divTripImage)
    divTrip.appendChild(divTripDetail)

    // append div trip to the fragment
    fragment.appendChild(divTrip)

    // append fragment to the existing div trip content area content
    tripContentAreaContent.appendChild(fragment)
}

// redraw trips
const renderAllTrips = () => {
    axios.get('/trips')
        .then(res => {
            const myTrips = res.data
            const tripContentAreaContent = document.querySelector('.trip-content-area-content')
            tripContentAreaContent.innerHTML = ''

            myTrips.forEach((trip) => {
                renderTrip(trip)
            })
        })
}

// add new trip. weather data will be added in the server
const addTrip = () => {
    axios.post('/trip', {
        destination: document.querySelector('#destination-input').value,
        departingDate: new Date(document.querySelector('#departing-date-input').value)
    }).then(res => renderTrip(res.data))
}

// remove existing trip
const removeTrip = (evt) => {
    // remove trip element with tripId from DOM
    const elementToRemove = document.querySelector(`#${evt.target.dataset.tripId}`)
    elementToRemove.remove()

    // remove trip from the trip list
    axios.delete(`/trip/${evt.target.dataset.tripId}`).then(res => res.data)
}

// event listener for add trip button
const addEventListenerForAddTrip = () => {
    const buttonAddTrip = document.querySelector('#add-trip-button')
    buttonAddTrip.addEventListener('click', addTrip)
}

export {
    addEventListenerForAddTrip,
    renderAllTrips
}