import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";
import { STATE } from "../../../../logic/state.js";
import { createHeader } from "../../../../identity/gameHeader.js";
import { localStorage } from "../../../../logic/helpers.js";
import { router } from "../../../../logic/router.js";

async function renderComponent() {

    createHeader('main');
    const component = {
        id: 'game-container',
        parentId: 'main',
        tag: 'div',
    }

    componentManger(component);

    const popupComponent = {
        id: 'clue-popup',
        parentId: 'main',
        tag: 'dialog',
    }
    componentManger(popupComponent);

    PubSub.publish({ event: 'renderClueComponents', detail: component.id });
}

async function fillState() {

    let key;
    const gameData = localStorage.get();
    if (gameData.completed.find(milstone => milstone === 'clue')) {
        const popupComponent = {
            id: 'clue-popup',
            parentId: 'main',
            tag: 'dialog',
        }
        const dialog = componentManger(popupComponent);

        dialog.innerHTML = `
            <div class="dialog-text">
                <p>Du har redan klarat detta steget, gå vidare till nästa</p>
            </div>
            <button id="next-page" class="btn">Gå vidare!</button>
        `;
        dialog.querySelector("#next-page").addEventListener('click', (e) => { router('map') });
        dialog.showModal();
        return;
    } else {
        const bodyData = {
            entity: 'CLUES',
            key: '',
            clueIds: gameData.beenTo
        }

        const dbAnswer = await STATE.Post({ entity: "CLUES", bodyData });
        if (dbAnswer['finished']) {
            renderLeaderboard();
            return;
        }
        gameData.beenTo.push(dbAnswer.id);
        // gameData.currentKey = dbAnswer.key;
        localStorage.set(gameData);
        console.log(dbAnswer);
        key = dbAnswer.key;
    }

    const prefix = `./api/GET.php?entity=CLUES&key=${key}`;
    STATE.Get({ entity: 'CLUES', prefix: prefix });
}

PubSub.subscribe({ event: 'renderclue', listener: fillState });
PubSub.subscribe({ event: 'stateUpdated', listener: renderComponent });

async function renderLeaderboard() {

    const gameData = localStorage.get();
    const bodyData = {
        entity: 'LEADERBOARD',
        key: '',
        user: {
            name: gameData.name,
            points: gameData.points,
        }
    }

    const dbAnswer = await STATE.Post({ entity: "LEADERBOARD", bodyData });
    router('leaderboard');
}