let minutes = 1
let seconds = 0

function zeroAEsquerda(valor) {
    return valor < 10 ? `0${valor}` : valor
}

function iniciar() {
    const timer = setInterval(() => {
        // exibe o tempo formatado
        console.log(`${zeroAEsquerda(minutes)}:${zeroAEsquerda(seconds)}`)

        // verifica se acabou
        if (minutes === 0 && seconds === 0) {
            clearInterval(timer)
            console.log("Tempo acabou!")
            return
        }

        // decrementa o tempo
        if (seconds === 0) {
            minutes--
            seconds = 59
        } else {
            seconds--
        }
    }, 1000)
}

iniciar()
