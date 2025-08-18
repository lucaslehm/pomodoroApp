const appData = {
    // Timer Fields
    minutesField: () => document.querySelector('#minutesTimer'),
    secondsField: () => document.querySelector('#secondsTimer'),

    // Buttons
    startBtn: () => document.querySelector('#startButton'),

    // Timer
    timerText: () => document.querySelector('.app-timer-text')
}


let minutes = 25
let seconds = 0

function startTimer() {

    const timer = setInterval(function () {
        appData.minutesField().innerText = zeroLeft(minutes)
        appData.secondsField().innerText = zeroLeft(seconds)

        // Verificar se o tempo acabou
        if (minutes === 0 && seconds === 0) {
            clearInterval(timer)
            resetTimerFields()
            return
        }

        // Contador de tempo
        if (seconds === 0) {
            minutes--
            seconds = 59
        } else {
            seconds--
        }

    }, 1000)
}


function zeroLeft(value) {
    return value < 10 ? `0${value}` : value
}

function resetTimerFields() {
    appData.minutesField().innerText = '25'
    appData.secondsField().innerText = '00'
}

appData.startBtn().addEventListener('click', function(e) {
    startTimer()
})