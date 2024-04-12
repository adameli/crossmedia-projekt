import { componentManger } from "../components/componentManager.js";

export function createHeader(parentId) {
    const component = {
        id: 'game-header',
        parentId: parentId,
        tag: 'header',
    }

    const dom = componentManger(component);
    const gameData = JSON.parse(window.localStorage.getItem('game-data'));

    dom.innerHTML = `
        <button id="leave-game" class="btn">Avsluta</button>
        <p id="points">${gameData.points}</p>
        <div id="logo-container">
            <img src="./resources/images/logga_rgb.svg" alt="Logo of the game">
        </div>
    `;

    dom.querySelector('#leave-game').addEventListener('click', (e) => {
        window.location = './';
    })

    return dom;
}