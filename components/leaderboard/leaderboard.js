import { PubSub } from "../../logic/pubsub.js";
import { STATE } from "../../logic/state.js";
import { localStorage } from "../../logic/helpers.js";

async function renderComponent() {

    createHeader('main');
    const component = {
        id: 'leaderboard-container',
        parentId: 'main',
        tag: 'ul',
    }

    const dom = componentManger(component);

    const leaderboard = STATE.getEntity('LEADERBOARD');

    leaderboard.forEach(user => {
        renderInstance(user, dom);
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