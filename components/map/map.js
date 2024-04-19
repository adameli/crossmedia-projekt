import { PubSub } from "../../logic/pubsub.js";
import { componentManger } from "../componentManager.js";
import { createHeader } from "../../identity/gameHeader.js";
import { STATE } from "../../logic/state.js";
import { router } from "../../logic/router.js";
import { localStorage } from "../../logic/helpers.js";


async function renderComponent() {
    // window.localStorage.removeItem('game-data');
    createHeader('main');
    const component = {
        id: 'map-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    const cluesInfo = STATE.getEntity('CLUES');
    dom.innerHTML = `
        <div id="map-img-container">
            <img src="${cluesInfo.img}" alt="A map with a pin point on where to go next">
        </div>
        <p id="map-description-text" class="regular-text">${cluesInfo.text}</p>
        <div class="btn-input-container">
            <input type="text" id="place-password" placeholder="Plats lösenord">
            <button id="submit-place-password" class="btn">OK</button>
        </div>
    `;

    const popupComponent = {
        id: 'map-popup',
        parentId: 'main',
        tag: 'dialog',
    }
    componentManger(popupComponent);

    const gameData = localStorage.get();
    console.log(gameData.completed);
    const currentPlace = gameData.currentPlace;

    dom.querySelector('#submit-place-password').addEventListener('click', async (e) => {
        const inputValue = dom.querySelector('#place-password').value;
        const cleandString = inputValue
            .trim('')
            .replace(/[\s]/g, '')
            .toLowerCase();

        console.log(cleandString);
        const bodyData = {
            entity: 'QUIZES',
            key: cleandString,
            place: currentPlace,
        }

        const dbAnswer = await STATE.Post({ entity: "QUIZES", bodyData });
        console.log(dbAnswer.isCorrect);
        if (dbAnswer.isCorrect) {
            gameData.currentKey = cleandString;
            gameData.completed.push('map');
            localStorage.set(gameData);
            router('quiz');
        } else {
            alert('Fel lösenord');
        }
    })

}

async function fillState() {

    const gameData = localStorage.get();

    const prefix = `./api/GET.php?entity=CLUES&key&place=${gameData.currentPlace}`;
    STATE.Get({ entity: 'CLUES', prefix: prefix });
}


PubSub.subscribe({ event: 'stateUpdated', listener: renderComponent });
PubSub.subscribe({ event: 'rendermap', listener: fillState });