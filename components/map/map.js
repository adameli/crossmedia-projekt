import { PubSub } from "../../logic/pubsub.js";
import { componentManger } from "../componentManager.js";
import { createHeader } from "../../identity/gameHeader.js";
import { STATE } from "../../logic/state.js";


function renderComponent() {
    // window.localStorage.removeItem('game-data');
    createHeader('main');
    const component = {
        id: 'map-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    dom.innerHTML = `
        <div id="map-img-container">
            <img src="./resources/images/turningtorso.png" alt="A map with a pin point on where to go next">
        </div>
        <p id="map-description-text" class="regular-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Tenetur, libero inventore ea accusamus itaque</p>
        <div class="btn-input-container">
            <input type="text" id="place-password" placeholder="Plats lösenord">
            <button id="submit-place-password" class="btn">OK</button>
        </div>
    `;

    const popupComponent = {
        id: 'start-popup',
        parentId: 'main',
        tag: 'dialog',
    }
    componentManger(popupComponent);

    dom.querySelector('#submit-place-password').addEventListener('click', (e) => {
        const inputValue = dom.querySelector('#place-password').value;
        const cleandString = inputValue
            .trim('')
            .replace(/[\s]/g, '')
            .toLowerCase();

        console.log(cleandString);
        const prefix = `./api/GET.php?entity=QUIZES&key=${cleandString}&place=turningtorso`;

        STATE.Get({ entity: "QUIZES", prefix });
    })

}

async function fillState() {

    STATE.Get({ entity: 'QUIZES', key: 'lol' });
}

PubSub.subscribe({ event: 'rendermap', listener: fillState });
PubSub.subscribe({ event: 'stateUpdated', listener: renderComponent });