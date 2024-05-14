import { componentManger } from "../components/componentManager.js";

export function createHeader(parentId, title) {
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
        <h2 class="sub-title">${title}</h2>
        <p id="points">${gameData.points}</p>
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