import { componentManger } from "../../componentManager.js";
import { PubSub } from "../../../logic/pubsub.js";
import { STATE } from "../../../logic/state.js";
import { localStorage } from "../../../logic/helpers.js";

let timerIntervalId;
function renderInstance() {
    const component = {
        id: 'clue',
        parentId: 'game-container',
        tag: 'h4',
    }

    componentManger(component);

    const gameData = localStorage.get();
    // changeClueContent(gameData.currentClue)
    // speachToText(clues[gameData.currentClue].text);

    startTimer(gameData.time);

    function speachToText(text) {
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(text);
        synth.speak(utterThis);
    }

}

function startTimer(seconds) {
    if (document.getElementById('popup-anwser')) document.getElementById('popup-anwser').remove();
    const clues = STATE.getEntity('CLUES').clues;
    const gameData = localStorage.get();
    let countdownBar = document.getElementById('countdown');
    // Update timers and divs every second
    changeClueContent(gameData.currentClue, gameData.emergencyStop, gameData)
    timerIntervalId = setInterval(() => {
        const gameData = localStorage.get();
        gameData.time = seconds;

        const totalTime = 60;
        const timeRemaining = totalTime - seconds
        const precentageElapsed = (timeRemaining / totalTime) * 100;

        countdownBar.style.width = precentageElapsed + '%';

        if (seconds === 40) { changeClueContent(1, false, gameData); }
        if (seconds === 20) { changeClueContent(2, false, gameData); }
        if (seconds === 10) { changeClueContent(3, false, gameData); }
        if (seconds === 5) { changeClueContent(4, false, gameData); }


        // Check if timer has reached zero
        if (seconds === 0) {
            clearInterval(timerIntervalId); // Stop the interval
            changeClueContent(5, gameData.emergencyStop, gameData);
            PubSub.publish({ event: 'endOfClues', detail: 'Du är sämst' })
        }


        localStorage.set(gameData);

        seconds--;


    }, 1000); // Interval set to 1000 milliseconds (1 second)

    function changeClueContent(index, isButtonActive, gameData) {
        if (!isButtonActive) {
            gameData.emergencyStop = false;
            document.querySelector('#stopwatch-btn')?.classList.remove('hide');
        }
        let cluePoint;
        switch (index) {
            case 0:
                cluePoint = 10;
                break;
            case 1:
                cluePoint = 8;
                break;
            case 2:
                cluePoint = 6;
                break;
            case 3:
                cluePoint = 4;
                break;
            case 4:
                cluePoint = 2;
                break;
            case 5:
                cluePoint = 0;
                break;
        }
        document.getElementById('clue-point').textContent = cluePoint;
        if (index !== 5) {
            document.getElementById('clue').textContent = clues[index].text;
            gameData.currentClue = index;
        }
        localStorage.set(gameData);
        // speachToText(clues[index].text);
    }
}

PubSub.subscribe({ event: 'renderClueInstance', listener: renderInstance });
PubSub.subscribe({ event: 'emergencyStop', listener: stopTime });

function stopTime() {
    clearInterval(timerIntervalId);
    const gameData = localStorage.get();
    gameData.emergencyStop = true;
    localStorage.set(gameData);
    let seconds = 10;

    const timerIntervalId2 = setInterval(() => {
        document.getElementById('short-timer').textContent = seconds;
        if (seconds == 0) {
            clearInterval(timerIntervalId2);
            startTimer(gameData.time);
        }
        seconds--
    }, 1000);
}
