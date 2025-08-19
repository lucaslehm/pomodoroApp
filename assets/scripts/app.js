// Variaveis globais
// Estado global dos timers
let timerSettings = {
    pomodoro: 25,
    break: 5,
    longBreak: 15
}

let minutes = timerSettings.pomodoro
let seconds = 0

let pauseState = false
let resetState = false

let breakCounter = 0


const appData = {
    // Page Title Field
    titleField: () => document.querySelector('title'),

    // Timer Fields
    timerText: () => document.querySelector('.app-timer-text'),
    minutesField: () => document.querySelector('#minutesTimer'),
    secondsField: () => document.querySelector('#secondsTimer'),

    // Buttons
    startBtn: () => document.querySelector('#startButton'),
    pauseButton: () => document.querySelector('#pauseButton'),
    resetButton: () => document.querySelector('#resetButton'),
    settingsBtn: () => document.querySelector('#settingsButton'),

    // HeaderButtons
    headerBtnsBox: () => document.querySelector('.pomodoro-app-header-buttons-content'),
    focusBtn: () => document.querySelector('#btnFocus'),
    breakBtn: () => document.querySelector('#btnBreak'),
    longBreakBtn: () => document.querySelector('#btnLongBreak'),
}

const headerButttons = appData.headerBtnsBox().querySelectorAll('button')

// Modal Fields
const modal = {
    settings: () => document.querySelector('.settings-dialog'),
    backButton: () => document.querySelector('#backButton'),
    updateSettings: () => document.querySelector('#updateSettingsButton'),

    // inputs
    pomodoroTimerSet: () => document.querySelector('#pomodoroTimerSet'),
    breakTimerSet: () => document.querySelector('#breakTimerSet'),
    longBreakTimerSet: () => document.querySelector('#longBreakTimerSet')
}

// Settings Dialog
appData.settingsBtn().addEventListener('click', function () {
    playClickSound()
    showHideModal()
})

modal.backButton().addEventListener('click', function () {
    playClickSound()
    showHideModal()
})

recoverTimerState()

// Atualizar dados do timer conforme os inputs do settings
modal.updateSettings().addEventListener('click', function (e) {
    playClickSound()
    e.preventDefault()

    let pomodoroTime = modal.pomodoroTimerSet().value
    let breakTime = modal.breakTimerSet().value
    let longBreakTime = modal.longBreakTimerSet().value

    if (pomodoroTime !== '') {
        timerSettings.pomodoro = Number(pomodoroTime)
        setTimer(timerSettings.pomodoro, seconds)
    }

    if (breakTime !== '') {
        timerSettings.break = Number(breakTime)
    }

    if (longBreakTime !== '') {
        timerSettings.longBreak = Number(longBreakTime)
    }

    saveTimerState()
    alert('Dados atualizados com sucesso!')
    showHideModal()
})


function changeTime(type) {
    if (type === '0') { // focus
        minutes = timerSettings.pomodoro
        seconds = 0
        setTimer(minutes, seconds)
    }

    if (type === '1') { // break
        minutes = timerSettings.break
        seconds = 0
        setTimer(minutes, seconds)
    }

    if (type === '2') { // long break
        minutes = timerSettings.longBreak
        seconds = 0
        setTimer(minutes, seconds)
    }
}

function showHideModal() {
    modal.settings().style.display = modal.settings().style.display === 'flex' ? 'none' : 'flex'
}

function updatePageTitle(message, min, sec) {
    // se eu receber algum codigo de mensagem, execute, se nao, 
    if (message == '0') {
        appData.titleField().innerHTML = 'Time to Focus!'
        return
    }

    if (message == '1') {
        appData.titleField().innerHTML = 'Time to Break!'
        return
    }

    if (message == '2') {
        appData.titleField().innerHTML = 'Time to Relax!'
        return
    }

    if (typeOfTimer(headerButttons) === '0') {
        appData.titleField().innerHTML = `${zeroLeft(min)}:${zeroLeft(sec)} | Focus`
    }

    if (typeOfTimer(headerButttons) === '1') {
        appData.titleField().innerHTML = `${zeroLeft(min)}:${zeroLeft(sec)} | Break`
    }

    if (typeOfTimer(headerButttons) === '2') {
        appData.titleField().innerHTML = `${zeroLeft(min)}:${zeroLeft(sec)} | LongBreak`
    }

}

// Chama a funcao principal
appData.startBtn().addEventListener('click', function (e) {
    playClickSound()
    pauseState = false
    resetState = false
    startTimer()
    hideButton(appData.startBtn())
    showButton(appData.pauseButton())
})

// Chama a funcao pause
appData.pauseButton().addEventListener('click', function (e) {
    playClickSound()
    pauseTimer()
    hideButton(appData.pauseButton())
    showButton(appData.startBtn())
})

// Reset
appData.resetButton().addEventListener('click', function (e) {
    playClickSound()
    resetState = true
    clearInterval(timer)
    timer = null
    resetTimerFields()
    hideButton(appData.pauseButton())
    showButton(appData.startBtn())
})

function pauseTimer() {
    pauseState = true
}

// Liga o timer
function startTimer() {

    timer = setInterval(function () {

        if (pauseState) {
            clearInterval(timer)
            return
        }

        if (resetState) {
            clearInterval(timer)
            return
        }


        // Tempo acaba
        if (minutes === 0 && seconds === 0) {

            playTimerSound()
            clearInterval(timer)

            if (typeOfTimer(headerButttons) == '0') { // focus
                breakCounter++
                if (breakCounter === 3) {
                    // ir para o longbreak
                    updatePageTitle('2')
                    hideButton(appData.pauseButton())
                    showButton(appData.startBtn())
                    toggleSelectedClassButtons(appData.longBreakBtn())
                    changeTime('2')
                    tradeColors('2')
                    breakCounter = 0
                    return
                } else {
                    // ir para o break
                    updatePageTitle('1')
                    hideButton(appData.pauseButton())
                    showButton(appData.startBtn())
                    toggleSelectedClassButtons(appData.breakBtn())
                    changeTime('1')
                    tradeColors('1')
                    return
                }


            }

            if (typeOfTimer(headerButttons) == '1') { // break
                updatePageTitle('0')
                hideButton(appData.pauseButton())
                showButton(appData.startBtn())
                toggleSelectedClassButtons(appData.focusBtn())
                changeTime('0')
                tradeColors('0')
                return
            }

            if (typeOfTimer(headerButttons) == '2') { // longbreak
                updatePageTitle('0')
                hideButton(appData.pauseButton())
                showButton(appData.startBtn())
                toggleSelectedClassButtons(appData.focusBtn())
                changeTime('0')
                tradeColors('0')
                return
            }

            return

        }

        // Contador de tempo
        if (seconds === 0) {
            minutes--
            seconds = 59
        } else {
            seconds--
        }


        updatePageTitle(undefined, minutes, seconds)
        appData.minutesField().innerText = zeroLeft(minutes)
        appData.secondsField().innerText = zeroLeft(seconds)

    }, 1000)

}

function showButton(btn) {
    btn.style.display = 'block'
}

function hideButton(btn) {
    btn.style.display = 'none'
}

function typeOfTimer(types) {
    for (let type of types) {
        if (type.classList.contains('selected')) {
            return type.value
        }
    }
}

// Clicou no Focus
appData.focusBtn().addEventListener('click', e => {
    playClickSound()
    toggleSelectedClassButtons(appData.focusBtn())
    changeTime(typeOfTimer(headerButttons),)
    tradeColors(typeOfTimer(headerButttons))
})

// Clicou no break
appData.breakBtn().addEventListener('click', e => {
    playClickSound()
    toggleSelectedClassButtons(appData.breakBtn())
    changeTime(typeOfTimer(headerButttons))
    tradeColors(typeOfTimer(headerButttons))
})

// Clicou no LongBreak
appData.longBreakBtn().addEventListener('click', e => {
    playClickSound()
    toggleSelectedClassButtons(appData.longBreakBtn())
    changeTime(typeOfTimer(headerButttons))
    tradeColors(typeOfTimer(headerButttons))
})

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
    const tipoAtual = typeOfTimer(headerButttons)
    changeTime(tipoAtual)
}



function tradeColors(type) {
    const root = document.documentElement

    if (type === '0') {
        root.style.setProperty('--cor01', '#c6c6f8');
        root.style.setProperty('--cor02', '#f0f0f8');
        root.style.setProperty('--cor03', '#161631');
        root.style.setProperty('--cor04', '#c2c2d8');
    }

    if (type === '1') {
        root.style.setProperty('--cor01', '#c6f8d9');
        root.style.setProperty('--cor02', '#f4f8f0');
        root.style.setProperty('--cor03', '#162b31');
        root.style.setProperty('--cor04', '#c2d8cf');

    }

    if (type === '2') {
        root.style.setProperty('--cor01', '#f5f8c6');
        root.style.setProperty('--cor02', '#f8f6f0');
        root.style.setProperty('--cor03', '#312416');
        root.style.setProperty('--cor04', '#d8d6c2');
    }

}

const clickSound = new Audio()
clickSound.src = '../assets/sounds/click.mp3'
clickSound.type = 'audio/mpeg'

function playClickSound() {
    // Evita sobreposição de sons se clicar rápido
    if (!clickSound.paused) {
        clickSound.pause()
        clickSound.currentTime = 0
    }
    clickSound.play().catch(err => {
        // Alguns navegadores bloqueiam autoplay sem interação
        console.warn('Erro ao reproduzir som:', err)
    })
}

const timerSound = new Audio()
timerSound.src = '../assets/sounds/timerEnd.mp3'
timerSound.type = 'audio/mpeg'

function playTimerSound() {
    // Evita sobreposição de sons se clicar rápido
    if (!timerSound.paused) {
        timerSound.pause()
        timerSound.currentTime = 0
    }
    timerSound.play().catch(err => {
        // Alguns navegadores bloqueiam autoplay sem interação
        console.warn('Erro ao reproduzir som:', err)
    })
}

// Salvar dados no localStorage do navegador
function saveTimerState() {
    localStorage.setItem('times', JSON.stringify(timerSettings))
}

function recoverTimerState() {
    const times = localStorage.getItem('times')

    if (times) { // se existir no localStorage
        timerSettings = JSON.parse(times)
    } else {
        // primeira vez -> valores padrão
        timerSettings = {
            pomodoro: 25,
            break: 5,
            longBreak: 15
        }
    }

    minutes = timerSettings.pomodoro
    seconds = 0
    setTimer(minutes, seconds)
}

// Proximas funcionaliades:
// refatorar e debugar