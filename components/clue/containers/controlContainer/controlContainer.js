import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";
import { STATE } from "../../../../logic/state.js";
import { localStorage } from "../../../../logic/helpers.js";
import { router } from "../../../../logic/router.js";
import { closePopup } from "../../../../identity/closePopup.js";

function renderComponent(parentId) {
    const component = {
        id: 'control-container',
        parentId: parentId,
        tag: 'div',
        clas: 'btn-input-container'
    }

    const dom = componentManger(component);

    dom.innerHTML = `
        <input  maxlength="30" type="text" placeholder="Vart är vi påväg?" id="clue-answer"></input>
        <button id="submit-clue-answer" class="btn ">OK</button>
   `;

    const destination = STATE.getEntity('CLUES').destination;

    dom.querySelector('#submit-clue-answer').addEventListener('click', (e) => {
        const inputValue = dom.querySelector('#clue-answer').value;
        const cleandString = inputValue
            .trim('')
            .replace(/[\s]/g, '')
            .toLowerCase();

        if (cleandString == destination) {
            console.log('right answer');
            const gameData = JSON.parse(window.localStorage.getItem('game-data'));
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

                default:
                    points = 2;
            }

            const dialog = document.getElementById('clue-popup');
            dialog.innerHTML = `
                <div class="dialog-text">
                    <p>Du har redan klarat detta steget, gå vidare till nästa</p>
                </div>
                <button id="next-page" class="btn">Gå vidare!</button>
            `;

            dialog.querySelector("#next-page").addEventListener('click', (e) => { router('map') });

            setTimeout(() => {
                dialog.showModal();
            }, 100);

            e.currentTarget.setAttribute('disabled', true);
            document.querySelector("#points").textContent = gameData.points + points;
            gameData.points += points;
            gameData.currentPlace = cleandString;
            gameData.time = 30;
            gameData.completed.push('clue');
            localStorage.set(gameData);
            router('map');
        }
    });
}

PubSub.subscribe({ event: 'renderClueComponents', listener: renderComponent });