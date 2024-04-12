import { componentManger } from "../../componentManager.js";
import { PubSub } from "../../../logic/pubsub.js";
import { STATE } from "../../../logic/state.js";

function renderInstance(parentId) {
    const component = {
        id: 'clue',
        parentId: parentId,
        tag: 'h4',
    }

    const dom = componentManger(component);
    const clues = STATE.getEntity('CLUES').clues;


    dom.textContent = clues[0].text;
    const gameData = JSON.parse(window.localStorage.getItem('game-data'));
    startTimer(gameData.time);


    function startTimer(seconds = 30) {
        let timerSeconds = document.getElementById('timer');
        // Update timers and divs every second
        const timerIntervalId = setInterval(() => {
            const gameData = JSON.parse(window.localStorage.getItem('game-data'));
            console.log(gameData.time);
            gameData.time = seconds;

            let sec = `${seconds.toString().padStart(2, '0')}`;
            timerSeconds.textContent = sec;

            // Check if timer has reached zero
            if (seconds === 25) changeClueText(1);
            if (seconds === 20) changeClueText(2);
            if (seconds === 15) changeClueText(3);
            if (seconds === 10) changeClueText(4);


            if (seconds === 0) {
                gameData.time = 30;
                gameData.currentClue = 0;
                clearInterval(timerIntervalId); // Stop the interval
            }

            window.localStorage.setItem('game-data', JSON.stringify(gameData))

            seconds--;

            function changeClueText(index) {
                dom.textContent = clues[index].text;
                gameData.currentClue = index;
            }

        }, 1000); // Interval set to 1000 milliseconds (1 second)


    }
}

PubSub.subscribe({ event: 'renderClueInstance', listener: renderInstance });
