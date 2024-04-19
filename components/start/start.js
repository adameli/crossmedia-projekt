import { componentManger } from "../componentManager.js";
import { PubSub } from "../../logic/pubsub.js";
import { closePopup } from "../../identity/closePopup.js";
import { router } from "../../logic/router.js";

function renderComponent() {
    window.localStorage.removeItem('game-data');

    const component = {
        id: 'start-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    dom.innerHTML = `
        <h1 class="start-title">Vart är vi påväg?</h1>
        <div class="controls-container-column">
            <button id="spela-btn" class="btn start-btn">SPELA</button>
            <button id="info-btn" class="btn start-btn">HUR FUNKAR DET?</button>
        </div>
    `;

    const popupComponent = {
        id: 'start-popup',
        parentId: 'main',
        tag: 'dialog',
    }
    componentManger(popupComponent);

    document.getElementById('spela-btn').addEventListener('click', play);
    document.getElementById('info-btn').addEventListener('click', displayInfo);

}

PubSub.subscribe({ event: 'renderstart', listener: renderComponent });
// renderComponent()

function play(e) {
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <button class="close-dialog btn">Tillbaka</button>
        <h2 class="sub-title">Välj din vagn</h2>
        <div>
            <button id="team-1" class="btn team-btn">VAGN 1</button>
            <button id="team-2" class="btn team-btn">VAGN 2</button>
        </div>
    `;

    dialog.showModal();
    const dialogBtns = Array.from(document.querySelectorAll('.close-dialog'));
    closePopup(dialog, dialogBtns);

    dialog.querySelectorAll('.team-btn').forEach(btn => btn.addEventListener('click', startGame));
}

function startGame(e) {
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <button class="close-dialog btn">Tillbaka</button>
        <h2 class="sub-title">Välj ett lag namn sen börjar vi spela</h2>
        <p class="error-message"></p>
        <div id="start-game-container" class="btn-input-container">
            <input  maxlength="15" type="text" placeholder="Lagnamn" id="team-name"></input>
            <button id="start-game" class="btn ">START</button>
        </div>
    `;

    dialog.querySelector('.close-dialog').addEventListener('click', play);

    dialog.querySelector('#start-game').addEventListener('click', (e) => {
        const input = dialog.querySelector('#team-name');
        console.log(input.value);

        if (input.value.length < 3) {
            dialog.querySelector('.error-message').textContent = 'Invalid name must be more then 4 characters';
            return;
        }

        const localData = {
            name: input.value,
            points: 0,
            currentClue: 0,
            currentQuiz: 0,
            currentPlace: '',
            currentKey: '',
            time: 30,
            beenTo: [],
            completed: [],
        }

        window.localStorage.setItem('game-data', JSON.stringify(localData));
        // window.location = '/clue';
        router('clue');
    });


}

function displayInfo(e) {

    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <button class="close-dialog btn">Stäng</button>
        <div class="dialog-text">
            <p>Så här funkar vårat spel. Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Sed eligendi, aperiam et fuga facilis aut asperiores quasi esse ipsum odio! Ullam porro minus blanditiis vel, 
            at deserunt veritatis culpa fugiat.</p>
        </div>
        <button class="close-dialog btn">Nu kör vi!</button>
    `;

    dialog.showModal();

    const dialogBtns = Array.from(document.querySelectorAll('.close-dialog'));
    closePopup(dialog, dialogBtns);
}
