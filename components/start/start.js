import { componentManger } from "../componentManager.js"
import { PubSub } from "../../logic/pubsub.js";
import { closePopup } from "../../identity/closePopup.js";

function renderComponent() {
    const component = {
        id: 'start-container',
        parentId: 'main',
        tag: 'div',
        cssId: "start-css",
        href: "./components/start/start.css",
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

PubSub.subscribe({ event: 'startApp', listener: renderComponent });

function play(e) {
    console.log(e.currentTarget);
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <button class="close-dialog btn">Tillbaka</button>
        <h2 class="sub-title">Välj din vagn</h2>
        <div>
            <button class="btn">VAGN 1</button>
            <button class="btn">VAGN 2</button>
        </div>
    `;

    dialog.showModal();

    const dialogBtns = Array.from(document.querySelectorAll('.close-dialog'));
    closePopup(dialog, dialogBtns);
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
