import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";
import { STATE } from "../../../../logic/state.js";
import { localStorage } from "../../../../logic/helpers.js";
import { router } from "../../../../logic/router.js";

const shortTime = 15;

function renderComponent(parentId) {
    const component = {
        id: 'control-container',
        parentId: parentId,
        tag: 'div',
    }

    const component2 = {
        id: 'stopwatch-container',
        parentId: parentId,
        tag: 'div',
        clas: 'absolute-bottom'
    }

    componentManger(component);
    const stopwatchDom = componentManger(component2);
    const gameData = localStorage.get();

    stopwatchDom.innerHTML = `
        <img id="clue-transport" class="" src="./resources/images/${gameData.transport}.png" alt="Bild på ${gameData.transport}">
        <button id="stopwatch-btn" class="${gameData.emergencyStop ? 'hide' : ''}">
            <img id="stopwatch" src="./resources/images/stop_klocka.png" alt="Bild på stopklocka">
        </button>
   `;

    document.querySelector('#stopwatch-btn').addEventListener('click', (e) => {
        PubSub.publish({ event: 'emergencyStop', detail: shortTime });
    })


}

PubSub.subscribe({ event: 'renderClueComponents', listener: renderComponent });
PubSub.subscribe({ event: 'emergencyStop', listener: submitClueAnwser });
PubSub.subscribe({ event: 'endOfClues', listener: submitClueAnwser });

function submitClueAnwser(detail = shortTime) {
    document.querySelector('#stopwatch-btn').classList.add('hide');
    document.getElementById('control-container').innerHTML = `
    <div id="popup-answer" class="btn-input-container">
        <p id="short-timer">${detail}</p>
        <div class="input-btn-align">
            <input  maxlength="30" type="text" placeholder="Vart är vi påväg?" id="clue-answer"></input>
            <div id="submit-clue-answer">
                <img src="./resources/icons/arrow_back.png" alt="Submit password">
            </div>
        </div>
    </div>
    `
    document.querySelector('#clue-answer').focus();
    document.querySelector('#clue-answer').addEventListener('keyup', (e) => { if (e.key === 'Enter') checkAnwser() })
    document.querySelector('#submit-clue-answer').addEventListener('click', checkAnwser);

    function checkAnwser() {
        const destination = STATE.getEntity('CLUES').destination
        const cleanDestination = destination
            .replace(/[\s]/g, '')
            .toLowerCase();;

        const inputValue = document.querySelector('#clue-answer').value;
        const cleandString = inputValue
            .trim('')
            .replace(/[\s]/g, '')
            .toLowerCase();

        if (cleandString == cleanDestination) {
            const gameData = localStorage.get();
            let points;
            switch (gameData.currentClue) {
                case 0:
                    points = 10;
                    break;
                case 1:
                    points = 8;
                    break;
                case 2:
                    points = 6;
                    break;
                case 3:
                    points = 4;
                    break;
                case 4:
                    points = 2;
                    break;
            }

            if (detail !== shortTime) points = 0;

            document.querySelector("#points").textContent = gameData.points + points;
            gameData.points += points;
            gameData.currentPlace = destination;
            gameData.time = 60;
            gameData.currentClue = 0;
            gameData.emergencyStop = false;
            gameData.completed = ['quiz', 'clue'];
            localStorage.set(gameData);

            const dialog = document.getElementById('clue-popup');
            dialog.innerHTML = `
                <div class="clue-correct">
                    <h2 class="sub-title">BRA JOBBAT</h2>
                    <img class="popup-guide" src="./resources/images/${gameData.guide}.png">
                    <p>Ni ska nu ta er till ${gameData.currentPlace} för att leta upp lösenordet till quizet.</p>
                    <button id="next-page" class="btn">Gå vidare!</button>
                </div>
            `;
            dialog.showModal()
            dialog.querySelector("#next-page").addEventListener('click', (e) => router('map'));

        } else {
            document.querySelector('#clue-answer').classList.add("wrong-input");
            const animated = document.querySelector(".wrong-input");
            animated.addEventListener("animationend", (event2) => {
                event2.currentTarget.classList.remove("wrong-input");
            });
        }
    }
}