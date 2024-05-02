import { componentManger } from "../componentManager.js";
import { PubSub } from "../../logic/pubsub.js";
import { closePopup } from "../../identity/closePopup.js";
import { router } from "../../logic/router.js";
import { localStorage } from "../../logic/helpers.js";

let guide;
let path;
let transport;

function renderComponent() {
    window.localStorage.removeItem('game-data');
    const popupComponent = {
        id: 'start-popup',
        parentId: 'main',
        tag: 'dialog',
    }
    componentManger(popupComponent);

    const component = {
        id: 'start-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    dom.innerHTML = `
        <div id="start-header-container" class="controls-container-column">
                <h1 class="start-title">PÅ SPRÅNG<br>MALMÖ EDITION</h1>
                <button id="spela-btn" class="btn start-btn">SPELA</button>
        </div>
        <div id="start-img-container">
            <img src="./resources/images/start_loggo.png" id="start-img"></
        </div>
    `;



    document.getElementById('spela-btn').addEventListener('click', howItWorksInfo);
}

PubSub.subscribe({ event: 'renderstart', listener: renderComponent });
// renderComponent()

function howItWorksInfo(e) {

    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <button class="close-dialog btn">Tillbaka</button>
        <h2>LÄS NOGA</h2>
        <ul id="how-it-works" class="dialog-text">
            <li class="list-element">Välj vem vill du vill ska guida dig</li>
            <li class="list-element">Välj en slinga att utforska</li>
            <li class="list-element">Välj ditt färdmedel</li>
            <li class="list-element">Gör dig redo för "Vart är vi på väg?” Första ledtråden är värd 10 poäng, du har 30 sekunder på dig att gissa. Om du inte gissar rätt kommer ledtråd 2 (värd 8 poäng) osv</li>
            <li class="list-element">Skriv in ditt svar och tryck på nöd-ringklockan när du tror dig veta svaret</li>
            <li class="list-element">Vid rätt svar får du kartan till platsen</li>
            <li class="list-element">Vid fel svar fortsätter du att gissa</li>
            <li class="list-element">När du når platsen, får du en gåta, ditt uppdrag är att leta upp rätt lösenord på platsen</li>
            <li class="list-element">Skriv in lösenordet för att påbörja ett quiz</li>
            <li class="list-element"> Ju fler rätt svar, desto fler poäng</li>
            <li class="list-element">Efter quizet, nya ledtrådar till nästa plats</li>
        </ul>
        <div>
            <button id="continue"  class="btn">Nu kör vi!</button>
        </div>
    `;

    dialog.showModal();
    // dialog.classList.add('slide-down');

    dialog.querySelector('.close-dialog').addEventListener('click', (e) => {
        dialog.close();
        // dialog.classList.remove('slide-down');

    });

    dialog.querySelector('#continue').addEventListener('click', chooseGuide);
}


function chooseGuide(e) {
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <button class="close-dialog btn">Tillbaka</button>
        <h2 class="sub-title">VÄLJ GUIDE</h2>
        <div id="guides-container">
            <button id="guide-1" class="btn guide-btn">KRISTIAN</button>
            <button id="guide-2" class="btn guide-btn">FREDRIK</button>
        </div>
    `;

    dialog.querySelector('.close-dialog').addEventListener('click', howItWorksInfo);


    dialog.querySelectorAll('.guide-btn').forEach(btn => btn.addEventListener('click', (e) => {
        guide = e.currentTarget.textContent;
        choosePath();
    }));
}

function choosePath() {
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <button class="close-dialog btn">Tillbaka</button>
        <h2 class="sub-title">VÄLJ SLINGA</h2>
        <div id="paths-container">
            <button id="path-1" class="btn path-btn">SLINGA 1</button>
            <button id="path-2" class="btn path-btn">SLINGA 2</button>
            <button id="path-2" class="btn path-btn">SLINGA 3</button>
        </div>
    `;

    dialog.querySelector('.close-dialog').addEventListener('click', chooseGuide);

    dialog.querySelectorAll('.path-btn').forEach(btn => btn.addEventListener('click', (e) => {
        path = e.currentTarget.textContent;
        chooseTransport();
    }));
}
function chooseTransport(e) {
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <button class="close-dialog btn">Tillbaka</button>
        <h2 class="sub-title">VÄLJ FÄRDMEDEL</h2>
        <div id="paths-container">
            <button id="transport-1" class="btn transport-btn">ELSPARK</button>
            <button id="transport-2" class="btn transport-btn">CYKEL</button>
        </div>
    `;

    dialog.showModal();
    dialog.querySelector('.close-dialog').addEventListener('click', choosePath);

    dialog.querySelectorAll('.transport-btn').forEach(btn => btn.addEventListener('click', (e) => {
        transport = e.currentTarget.textContent;
        startGame();
    }));
}

function startGame(e) {
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <button class="close-dialog btn">Tillbaka</button>
        <h2 class="sub-title">VÄLJ NAMN</h2>
        <p class="error-message"></p>
        <div id="start-game-container" class="btn-input-container">
            <input  maxlength="15" type="text" placeholder="Lagnamn" id="team-name"></input>
            <button id="start-game" class="btn ">START</button>
        </div>
    `;

    dialog.querySelector('.close-dialog').addEventListener('click', chooseTransport);

    dialog.querySelector('#start-game').addEventListener('click', (e) => {

        const input = dialog.querySelector('#team-name');
        console.log(input.value);

        if (input.value.length < 3) {
            dialog.querySelector('.error-message').textContent = 'Invalid name must be more then 4 characters';
            return;
        }

        dialog.innerHTML = `
        <div id="loader-container">
            <div class="loader"></div>
        </div>`

        const localData = {
            name: input.value,
            guide: guide.toLowerCase(),
            path: path.split(' ')[1],
            transport: transport.toLowerCase(),
            points: 0,
            currentClue: 0,
            currentQuiz: 0,
            currentPlace: '',
            currentKey: '',
            time: 30,
            beenTo: [],
            completed: [],
        }

        localStorage.set(localData);
        router('clue');
    });


}

