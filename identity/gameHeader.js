import { componentManger } from "../components/componentManager.js";

export function createHeader(parentId) {
    const component = {
        id: 'game-header',
        parentId: parentId,
        tag: 'header',
    }

    const dom = componentManger(component);
    const dialogComponent = {
        id: 'leave-popup',
        parentId: parentId,
        tag: 'dialog',
    }
    const dialog = componentManger(dialogComponent);

    const gameData = JSON.parse(window.localStorage.getItem('game-data'));

    dom.innerHTML = `
        <button id="leave-game" class="btn-icon">
            <img src="./resources/icons/logout.png" alt="leave game button">
        </button>
        <p id="points">${gameData.points}</p>
        <div id="logo-container">
            <img src="./resources/images/logga_rgb.svg" alt="Logo of the game">
        </div>
    `;

    dom.querySelector('#leave-game').addEventListener('click', (e) => {
        dialog.innerHTML = `
        <div class="dialog-text">
            <p>Är du säker på att du vill lämna?</p>
        </div>
        <div id="leave-btn-container">
            <button id="leave" class="btn">Lämna</button>
            <button id="stay" class="btn">Stanna</button>
        </div>
        `

        dialog.showModal();

        dialog.querySelector('#leave').addEventListener('click', (e) => { window.location = './' });
        dialog.querySelector('#stay').addEventListener('click', (e) => { dialog.close() });

    })

    return dom;
}