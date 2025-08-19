// Variaveis globais do sistema
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


let timer

// Dados do conteudo principal
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

const typeMap = {
    '0': 'pomodoro',
    '1': 'break',
    '2': 'longBreak'
}

const colorThemes = {
    '0': { cor01: '#c6c6f8', cor02: '#f0f0f8', cor03: '#161631', cor04: '#c2c2d8' },
    '1': { cor01: '#c6f8d9', cor02: '#f4f8f0', cor03: '#162b31', cor04: '#c2d8cf' },
    '2': { cor01: '#f5f8c6', cor02: '#f8f6f0', cor03: '#312416', cor04: '#d8d6c2' }
}

const buttonActions = [
    { btn: appData.focusBtn, type: '0' },
    { btn: appData.breakBtn, type: '1' },
    { btn: appData.longBreakBtn, type: '2' }
]

const titles = {
    '0': 'Focus',
    '1': 'Break',
    '2': 'LongBreak'
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

    const pomodoroTime = modal.pomodoroTimerSet().value
    const breakTime = modal.breakTimerSet().value
    const longBreakTime = modal.longBreakTimerSet().value

    if (pomodoroTime !== '') timerSettings.pomodoro = Number(pomodoroTime)
    if (breakTime !== '') timerSettings.break = Number(breakTime)
    if (longBreakTime !== '') timerSettings.longBreak = Number(longBreakTime)

    // parar qualquer timer ativo
    clearInterval(timer)
    pauseState = false
    resetState = false

    // volta o botão para "Start"
    hideButton(appData.pauseButton())
    showButton(appData.startBtn())

    // reseta o contador para o estado atual
    const type = typeOfTimer(headerButttons) // '0', '1' ou '2'
    changeTime(type)

    updatePageTitle(type)

    saveTimerState()
    alert('Dados atualizados com sucesso!')
    showHideModal()
})


function changeTime(type) {
    const key = typeMap[type]
    if (!key) return

    minutes = timerSettings[key]
    seconds = 0
    setTimer(minutes, seconds)
}

function showHideModal() {
    modal.settings().style.display = modal.settings().style.display === 'flex' ? 'none' : 'flex'
}

function updatePageTitle(message, min, sec) {
    if (message !== undefined) {
        const map = { '0': 'Time to Focus!', '1': 'Time to Break!', '2': 'Time to Relax!' }
        appData.titleField().innerHTML = map[message] || ''
        return
    }

    const type = typeOfTimer(headerButttons)
    appData.titleField().innerHTML = `${zeroLeft(min)}:${zeroLeft(sec)} | ${titles[type]}`
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

function switchMode(type, resetBreakCounter = false) {
    updatePageTitle(type)
    hideButton(appData.pauseButton())
    showButton(appData.startBtn())

    const btnMap = {
        '0': appData.focusBtn,
        '1': appData.breakBtn,
        '2': appData.longBreakBtn
    }

    toggleSelectedClassButtons(btnMap[type]())
    changeTime(type)
    tradeColors(type)

    if (resetBreakCounter) breakCounter = 0
}

// Liga o timer
function startTimer() {
    timer = setInterval(() => {

        // Verifica pause/reset
        if (pauseState || resetState) {
            clearInterval(timer)
            return
        }

        // Quando o tempo acaba
        if (minutes === 0 && seconds === 0) {
            playTimerSound()
            clearInterval(timer)

            const type = typeOfTimer(headerButttons)

            if (type === '0') { // focus
                breakCounter++
                if (breakCounter === 3) {
                    switchMode('2', true) // longbreak
                } else {
                    switchMode('1') // break
                }
                return
            }

            if (type === '1') { // break
                switchMode('0') // volta pro focus
                return
            }

            if (type === '2') { // longbreak
                switchMode('0') // volta pro focus
                return
            }

            return
        }

        // Contador do tempo
        if (--seconds < 0) {
            minutes--
            seconds = 59
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

buttonActions.forEach(({ btn, type }) => {
    btn().addEventListener('click', () => {
        playClickSound()
        toggleSelectedClassButtons(btn())
        changeTime(type)
        tradeColors(type)
    })
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
    const theme = colorThemes[type]

    if (!theme) return

    Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
    })
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
