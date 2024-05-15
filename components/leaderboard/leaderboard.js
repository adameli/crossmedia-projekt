import { PubSub } from "../../logic/pubsub.js";
import { STATE } from "../../logic/state.js";
import { localStorage } from "../../logic/helpers.js";
import { componentManger } from "../componentManager.js";
import { createHeader } from "../../identity/gameHeader.js";
import { Fireworks } from 'https://esm.run/fireworks-js';

async function renderComponent() {


    createHeader('main', 'POÄNGLIGA');
    const component = {
        id: 'leaderboard-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    dom.innerHTML = `
    
    <ul id="list-container">
        <div id="firework"></div>
    </ul>
    <a href="https://forms.gle/1ySzzNQeXibLx3nP6" target="_blank" class="btn">TILL ENKÄT</a>
    `
    let container = document.querySelector('#firework');
    let options = {
        gravity: 2.4,
        opacity: 0.4,
        autoresize: true,
        acceleration: 1.00,
    };

    let fireworks = new Fireworks(container, options);

    fireworks.start();
    const leaderboard = STATE.getEntity('LEADERBOARD').sort((a, b) => b.points - a.points);

    const ulDom = document.querySelector('#list-container');
    leaderboard.forEach(user => {
        renderInstance(user, ulDom);
    })

}

function renderInstance(user, parent) {
    const instance = document.createElement('li');
    instance.id = 'player-' + user.id;
    instance.classList.add('player');

    instance.innerHTML = `
        <p>${user.name}</p>
        <p>${user.points}</p>
    `

    parent.append(instance);
}

async function fillState() {

    const gameData = localStorage.get();

    const prefix = `./api/GET.php?entity=LEADERBOARD&key=all`;
    STATE.Get({ entity: 'LEADERBOARD', prefix: prefix });
}

PubSub.subscribe({ event: 'renderleaderboard', listener: fillState });
PubSub.subscribe({ event: 'stateUpdated', listener: renderComponent });