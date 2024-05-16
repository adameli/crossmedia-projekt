import { PubSub } from "../../logic/pubsub.js";
import { componentManger } from "../componentManager.js";
import { createHeader } from "../../identity/gameHeader.js";
import { STATE } from "../../logic/state.js";
import { router } from "../../logic/router.js";
import { localStorage } from "../../logic/helpers.js";


async function renderComponent() {
    // window.localStorage.removeItem('game-data');
    const gameData = localStorage.get();
    createHeader('main', gameData.currentPlace.toUpperCase());
    const component = {
        id: 'map-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    // poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
    // <p id="map-description-text" class="regular-text">${cluesInfo.text}</p>
    // <video controls autoplay src="./resources/videos/${cluesInfo.img}">
    // </video>
    // <source src="./resources/videos/${cluesInfo.img}.webm">
    const cluesInfo = STATE.getEntity('CLUES');
    dom.innerHTML = `
        <div id="map-img-container">
            <video controls autoplay>
                <source src="./resources/videos/${cluesInfo.img}.mp4" type="video/mp4">
            </video>
        </div>
        <div class="btn-input-container">
            <input type="text" id="place-password" placeholder="Plats lösenord">
            <button id="submit-place-password" class="btn">OK</button>
        </div>
    `;
    const popupComponent = {
        id: 'map-popup',
        parentId: 'main',
        tag: 'dialog',
    }
    componentManger(popupComponent);

    console.log(gameData.completed);
    const currentPlace = gameData.currentPlace;

    document.querySelector('#place-password').addEventListener('keyup', (e) => { if (e.key === 'Enter') checkAnwser() });
    dom.querySelector('#submit-place-password').addEventListener('click', checkAnwser)

    async function checkAnwser() {
        const inputValue = dom.querySelector('#place-password').value;
        const cleandString = inputValue
            .trim('')
            .replace(/[\s]/g, '')
            .toLowerCase();

        const bodyData = {
            entity: 'QUIZES',
            key: cleandString,
            place: currentPlace,
        }

        //* Skickar med platsen t.ex 'malmöc' för att hitta rätt quiz objekt för att sen
        //* kolla i databasen om nycklen stämmer med det clienten har gett för lösenord
        //* skickar tillbaka antingen sant eller falkt.
        const dbAnswer = await STATE.Post({ entity: "QUIZES", bodyData });
        console.log(dbAnswer.isCorrect);
        if (dbAnswer.isCorrect) {

            //*Om clienten går tillbaka till map siden får de upp en popup att de har klarat steget
            //*Sen hänvisar vi de till quiz sidan igen
            const dialog = document.getElementById('map-popup');
            dialog.innerHTML = `
                <div class="next-step-container">
                    <h2 class="sub-title" >Du har redan klarat detta steget, gå vidare till nästa</h2>
                    <button id="next-page" class="btn">Gå vidare!</button>
                </div>
            `;

            dialog.querySelector("#next-page").addEventListener('click', (e) => { router('quiz') });
            setTimeout(() => {
                dialog.showModal();
            }, 200);

            gameData.currentKey = cleandString;
            gameData.completed = ['clue', 'map'];
            localStorage.set(gameData);
            router('quiz');
        } else {
            dom.querySelector('#place-password').classList.add("wrong-input");
            const animated = document.querySelector(".wrong-input");
            animated.addEventListener("animationend", (event2) => {
                event2.currentTarget.classList.remove("wrong-input");
            });
        }
    }
}

async function fillState() {

    const gameData = localStorage.get();
    if (gameData.completed.find(milstone => milstone === 'map')) {
        const popupComponent = {
            id: 'map-popup',
            parentId: 'main',
            tag: 'dialog',
        }
        const dialog = componentManger(popupComponent);

        dialog.innerHTML = `
            <div class="next-step-container">
                <h2 class="sub-title" >Du har redan klarat detta steget, gå vidare till nästa</h2>
                <button id="next-page" class="btn">Gå vidare!</button>
            </div>
        `;
        dialog.querySelector("#next-page").addEventListener('click', (e) => { router('quiz') });
        dialog.showModal();
        return;
    } else {
        //* Skickar till databasen för att få tillbaka en bild och text som tillhör det CLUE objekt som stämmer överens med currentPlace
        const prefix = `./api/GET.php?entity=CLUES&key&place=${gameData.currentPlace}&path=${gameData.path}`;
        STATE.Get({ entity: 'CLUES', prefix: prefix });
    }
}


PubSub.subscribe({ event: 'stateUpdated', listener: renderComponent });
PubSub.subscribe({ event: 'rendermap', listener: fillState });