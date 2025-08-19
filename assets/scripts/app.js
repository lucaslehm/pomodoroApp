const appData = {
    // Timer Fields
    minutesField: () => document.querySelector('#minutesTimer'),
    secondsField: () => document.querySelector('#secondsTimer'),

    // Buttons
    startBtn: () => document.querySelector('#startButton'),
    focusBtn: () => document.querySelector('#btnFocus'),
    breakBtn: () => document.querySelector('#btnBreak'),
    longBreakBtn: () => document.querySelector('#btnLongBreak'),

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

// Clicou no Focus
appData.focusBtn().addEventListener('click', e => {
    // arrumar o select
    toggleSelectedClassButtons(appData.focusBtn())
    changeTime('Focus')

    // colocar o tempo certo
})

// Clicou no break
appData.breakBtn().addEventListener('click', e => {
    // arrumar o select
    toggleSelectedClassButtons(appData.breakBtn())
    changeTime('Break')
})

// Clicou no LongBreak
appData.longBreakBtn().addEventListener('click', e => {
    // arrumar o select
    toggleSelectedClassButtons(appData.longBreakBtn())
    changeTime('LongBreak')
    
})


// Arruma o tempo quando clicar nos botoes
function changeTime(type) {
    if (type === 'Focus') {
        minutes = 25
        seconds = 0
        setTimer(minutes, seconds)
    }

    if (type === 'Break') {
        minutes = 5
        seconds = 0
        setTimer(minutes, seconds)
    }

    if (type === 'LongBreak') {
        minutes = 15
        seconds = 0
        setTimer(minutes, seconds)
    }
}


// Seta o tempo no html
function setTimer(min, sec) {
    appData.minutesField().innerText = zeroLeft(min)
    appData.secondsField().innerText = zeroLeft(sec)
}

// Arruma a classe select
function toggleSelectedClassButtons(botaoQuePermanece) {
    appData.focusBtn().classList.remove('selected')
    appData.breakBtn().classList.remove('selected')
    appData.longBreakBtn().classList.remove('selected')

    botaoQuePermanece.classList.add('selected')
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

// Proximas funcionaliades:

// mudar a cor quando trocar de tipo
// funcao pausar
// guardar informacoes de tempo no localstorage
// adcionar sons aos botoes
// funcionalidade do reset
// dialog do settings
// colocar como titulo da pagina
// refatorar e debugar