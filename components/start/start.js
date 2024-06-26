import { componentManger } from "../componentManager.js";
import { PubSub } from "../../logic/pubsub.js";
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

    // chooseTransport()
    dom.innerHTML = `
        <div id="start-header-container" class="controls-container-column">
                <h1 class="start-title">PÅ SPRÅNG<br>MALMÖ EDITION</h1>
                <button id="spela-btn" class="btn start-btn">SPELA</button>
        </div>

        <div id="start-img-container">
            <img src="./resources/images/start_loggo.png" id="start-img">
        </div>

        <img src="./resources/images/start_img_kf.png" id="start-img-kf">
        
    `;



    document.getElementById('spela-btn').addEventListener('click', howItWorksInfo);
}

PubSub.subscribe({ event: 'renderstart', listener: renderComponent });
// renderComponent()

function howItWorksInfo(e) {

    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <div class="start-popup-header">
            <button class="close-dialog btn">
                <img src="./resources/icons/arrow_back.png" alt="Back to previus">
            </button>
            <h2 class="sub-title">LÄS NOGA!</h2>
        </div>
        <ul id="how-it-works" class="dialog-text">
            <li class="list-element">Välj en guide.</li>
            <li class="list-element">Välj en slinga att utforska.</li>
            <li class="list-element">Välj ett färdmedel.</li>
            <li class="list-element">Gör dig redo för "Vart är vi på väg?” Första ledtråden är värd 10 poäng, ni har 20 sekunder per ledtråd att klura ut svaret, sen har ni 20 sekunder på er att svara. Om ni inte gissar rätt kommer nästa ledtråd (värd 8 poäng) osv.</li>
            <li class="list-element">Tryck på nödringklockan när ni tror er veta svaret. Fyll i svaret i fältet och tryck sedan på pilen eller enter.</li>
            <li class="list-element">Vid fel svar fortsätter ni att gissa. Vid rätt svar tar ni er till platsen.</li>
            <li class="list-element">När ni når platsen får ni en gåta uppläst av Andreas. Ert uppdrag är att ta reda på rätt lösenord.</li>
            <li class="list-element">Skriv in lösenordet för att påbörja ett quiz. Ju fler rätt svar, desto fler poäng.</li>
            <li class="list-element">Efter quizet ställer vi frågan “Vart är vi på väg?” igen.</li>
        </ul>
        <div id="lets-go-btn">
            <button id="continue"  class="btn">Nu kör vi!</button>
        </div>
    `;

    dialog.showModal();
    // dialog.classList.add('slide-down');

    dialog.querySelector('.close-dialog').addEventListener('click', (e) => {
        dialog.close();
    });

    dialog.querySelector('#continue').addEventListener('click', chooseGuide);
}


function chooseGuide(e) {
    const dialog = document.getElementById('start-popup');
    dialog.classList.add('lightblue');
    dialog.innerHTML = `
        <div class="start-popup-header">
            <button class="close-dialog btn">
                <img src="./resources/icons/arrow_back.png" alt="Back to previus">
            </button>
            <h2 class="sub-title">VÄLJ GUIDE</h2>
        </div>
        <div id="guides-container" class="flex-column">
            <div class="guide-wrapper">
                <img src="./resources/images/kristian.png" alt="Bild på Kristian">
                <button id="guide-1" class="btn guide-btn">KRISTIAN</button>
            </div>
            <div class="guide-wrapper">
                <img src="./resources/images/fredrik.png" alt="Bild på Fredrik">
                <button id="guide-2" class="btn guide-btn">FREDRIK</button>
            </div>
        </div>
    `;

    dialog.querySelector('.close-dialog').addEventListener('click', (e) => {
        dialog.classList.remove('lightblue');
        howItWorksInfo()
    });


    dialog.querySelectorAll('.guide-btn').forEach(btn => btn.addEventListener('click', (e) => {
        guide = e.currentTarget.textContent;
        choosePath();
    }));
}

function choosePath() {
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <div id="map-img"></div>
        <div class="start-popup-header">
            <button class="close-dialog btn">
            <img src="./resources/icons/arrow_back.png" alt="Back to previus">
            </button>
            <h2 class="sub-title">VÄLJ SLINGA</h2>
        </div>
        <div id="paths-container" class="flex-column">
            <button id="path-1" class="btn path-btn">SLINGA 1</button>
            <button id="path-2" class="btn path-btn">SLINGA 2</button>
            <button id="path-2" class="btn path-btn">SLINGA 3</button>
        </div>
    `;
    dialog.showModal();
    dialog.querySelector('.close-dialog').addEventListener('click', chooseGuide);

    dialog.querySelectorAll('.path-btn').forEach(btn => btn.addEventListener('click', (e) => {
        path = e.currentTarget.textContent;
        chooseTransport();
    }));
}
function chooseTransport(e) {
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <div class="start-popup-header">
            <button class="close-dialog btn">
                <img src="./resources/icons/arrow_back.png" alt="Back to previus">
            </button>
            <h2 class="sub-title">VÄLJ FÄRDMEDEL</h2>
        </div>
        <div id="transport-container" class="flex-column">
        <div class="transport-wrapper">
                <img class="responsive-img" src="./resources/images/elspark.png" alt="Bild på Elspark">
                <button id="transport-1" class="btn transport-btn">ELSPARK</button>
            </div>
            <div class="transport-wrapper">
                <img class="responsive-img" src="./resources/images/cykel.png" alt="Bild på Cykel">
                <button id="transport-2" class="btn transport-btn">CYKEL</button>
            </div>
        </div>
    `;

    dialog.showModal();
    dialog.querySelector('.close-dialog').addEventListener('click', choosePath);

    dialog.querySelectorAll('.transport-btn').forEach(btn => btn.addEventListener('click', (e) => {
        transport = e.currentTarget.textContent.toLowerCase();
        startGame();
    }));
}

function startGame(e) {
    const dialog = document.getElementById('start-popup');
    dialog.innerHTML = `
        <div class="start-popup-header">
            <button class="close-dialog btn">
                <img src="./resources/icons/arrow_back.png" alt="Back to previus">
            </button>
            <h2 class="sub-title">VÄLJ NAMN</h2>
        </div>
        <div id="start-game-container" class="btn-input-container">
            <p class="error-message text-style"></p>   
            <input  maxlength="15" type="text" placeholder="Lagnamn" id="team-name"></input>
            <button id="start-game" class="btn ">START</button>
        </div>
        <img  class="responsive-img absolute-bottom" src="./resources/images/${transport}.png" alt="Bild på ${transport}">
    `;

    dialog.querySelector('.close-dialog').addEventListener('click', chooseTransport);

    dialog.querySelector('#start-game').addEventListener('click', (e) => {

        const input = dialog.querySelector('#team-name');
        console.log(input.value);

        if (input.value.length <= 2 || input.value.length >= 11) {
            dialog.querySelector('.error-message').textContent = 'Ogiltigt namn, du måste ha minst 2 och högst 10 karaktärer';
            return;
        }

        dialog.innerHTML = `
        <div id="loader-container">
            <div class="loader"></div>
        </div>`

        const localData = {
            name: input.value,
            emergencyStop: false,
            time: 100,
            points: 0,
            currentClue: 0,
            currentQuiz: 0,
            currentPlace: '',
            currentKey: '',
            transport: transport,
            guide: guide.toLowerCase(),
            path: path.split(' ')[1],
            beenTo: [],
            completed: [],
        }

        localStorage.set(localData);
        setTimeout(() => {
            router('clue');
        }, 1500);
    });


}

