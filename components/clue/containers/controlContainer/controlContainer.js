import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";
import { STATE } from "../../../../logic/state.js";
import { localStorage } from "../../../../logic/helpers.js";
import { router } from "../../../../logic/router.js";

function renderComponent(parentId) {
    const component = {
        id: 'control-container',
        parentId: parentId,
        tag: 'div',
        clas: 'btn-input-container'
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
    console.log(gameData.emergencyStop);
    stopwatchDom.innerHTML = `
        <img class="responsive-img" src="./resources/images/${gameData.transport}.png" alt="Bild på ${gameData.transport}">
        <button id="stopwatch-btn" class="${gameData.emergencyStop ? 'hide' : ''}">
            <img id="stopwatch" src="./resources/images/stop_klocka.png" alt="Bild på stopklocka">
        </button>
   `;

    document.querySelector('#stopwatch-btn').addEventListener('click', (e) => {
        PubSub.publish({ event: 'emergencyStop', detail: 10 });
    })


}

PubSub.subscribe({ event: 'renderClueComponents', listener: renderComponent });
PubSub.subscribe({ event: 'emergencyStop', listener: submitClueAnwser });
PubSub.subscribe({ event: 'endOfClues', listener: submitClueAnwser });

function submitClueAnwser(detail = 10) {
    document.querySelector('#stopwatch-btn').classList.add('hide');
    document.getElementById('control-container').innerHTML = `
        <div id="popup-anwser" class="btn-input-container">
            <p id="short-timer">${detail}</p>
            <input  maxlength="30" type="text" placeholder="Vart är vi påväg?" id="clue-answer"></input>
            <button id="submit-clue-answer" class="btn">OK</button>
        </div>
    `
    document.querySelector('#clue-answer').focus();
    document.querySelector('#submit-clue-answer').addEventListener('click', (e) => {
        const destination = STATE.getEntity('CLUES').destination;
        const inputValue = document.querySelector('#clue-answer').value;
        const cleandString = inputValue
            .trim('')
            .replace(/[\s]/g, '')
            .toLowerCase();

        if (cleandString == destination) {
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

            if (detail !== 10) points = 0;
            e.currentTarget.setAttribute('disabled', true);
            document.querySelector("#points").textContent = gameData.points + points;
            gameData.points += points;
            gameData.currentPlace = cleandString;
            gameData.time = 30;
            gameData.currentClue = 0;
            gameData.emergencyStop = false;
            gameData.completed = ['quiz', 'clue'];
            localStorage.set(gameData);

            const dialog = document.getElementById('clue-popup');
            dialog.innerHTML = `
                <div class="clue-correct">
                    <h2>BRA JOBBAT</h2>
                    <img src="./resources/images/${gameData.guide}.png">
                    <p>Du ska nu ta dig till ${gameData.currentPlace} för att leta upp lösenordet för att leta upp quizet</p>
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
    });
}