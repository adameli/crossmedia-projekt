import { componentManger } from "../../componentManager.js";
import { PubSub } from "../../../logic/pubsub.js";
import { STATE } from "../../../logic/state.js";
import { localStorage } from "../../../logic/helpers.js";

function renderInstance(parentId) {
    const component = {
        id: 'clue',
        parentId: 'game-container',
        tag: 'h4',
    }

    const dom = componentManger(component);
    const clues = STATE.getEntity('CLUES').clues;


    const gameData = localStorage.get();
    // changeClueContent(gameData.currentClue)
    speachToText(clues[gameData.currentClue].text);

    startTimer(gameData.time);

    function speachToText(text) {
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(text);
        synth.speak(utterThis);
    }


    function startTimer(seconds) {
        let countdownBar = document.getElementById('countdown');
        // Update timers and divs every second
        const timerIntervalId = setInterval(() => {
            const gameData = localStorage.get();
            changeClueContent(gameData.currentClue)
            gameData.time = seconds;

            const totalTime = 30;
            const timeRemaining = totalTime - seconds
            const precentageElapsed = (timeRemaining / totalTime) * 100;

            countdownBar.style.width = precentageElapsed + '%';

            // Check if timer has reached zero
            if (seconds === 20) changeClueContent(1);
            if (seconds === 15) changeClueContent(2);
            if (seconds === 10) changeClueContent(3);
            if (seconds === 5) changeClueContent(4);


            if (seconds === 0) {
                clearInterval(timerIntervalId); // Stop the interval
                changeClueContent(5);
            }

            function changeClueContent(index) {
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
                    dom.textContent = clues[index].text;
                    gameData.currentClue = index;
                }
                // speachToText(clues[index].text);
            }

            localStorage.set(gameData);

            seconds--;


        }, 1000); // Interval set to 1000 milliseconds (1 second)

    }

}

PubSub.subscribe({ event: 'renderClueInstance', listener: renderInstance });
