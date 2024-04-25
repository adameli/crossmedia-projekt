import { PubSub } from "../../logic/pubsub.js";
import { componentManger } from "../componentManager.js";
import { createHeader } from "../../identity/gameHeader.js";
import { STATE } from "../../logic/state.js";
import { localStorage } from "../../logic/helpers.js";
import { router } from "../../logic/router.js";


async function renderComponent() {
    createHeader('main');
    const component = {
        id: 'quiz-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    dom.innerHTML = `
        <div id="question-container">
            <h2 id="question"></h2>
            <p id="current-question"></p>
        </div>

        <div id="alternatives-container"></div>
    `;

    const popupComponent = {
        id: 'quiz-popup',
        parentId: 'main',
        tag: 'dialog',
    }
    componentManger(popupComponent);

    const gameData = localStorage.get();

    const quiz = STATE.getEntity('QUIZES');
    console.log(quiz);

    displayQuestion(quiz, gameData.currentQuiz);
    // displayQuestion(quiz,);

}

function displayQuestion(quiz, quizNum) {
    const gameData = localStorage.get();
    const question = quiz[quizNum];
    const questionText = document.getElementById('question');
    const currentQuestion = document.getElementById('current-question');
    const alternativesContainer = document.getElementById('alternatives-container');
    alternativesContainer.innerHTML = null;

    questionText.textContent = question.question;
    currentQuestion.textContent = ++quizNum + '/5';

    question.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'answer');
        btn.textContent = answer;

        btn.addEventListener('click', (e) => {
            const target = e.currentTarget;

            if (question.correctAnswer === target.textContent) {
                target.classList.add('right');
                document.getElementById('points').textContent = ++gameData.points;
            } else {
                target.classList.add('wrong');
            }

            disableButtons(document.querySelectorAll('.answer'));
            gameData.currentQuiz++;

            if (gameData.currentQuiz === 5) {
                const dialog = document.getElementById('quiz-popup');
                dialog.innerHTML = `
                <div class="dialog-text">
                    <p>Du har redan klarat detta steget, gå vidare till nästa</p>
                </div>
                <button id="next-page" class="btn">Gå vidare!</button>
            `;

                dialog.querySelector("#next-page").addEventListener('click', (e) => { router('clue') });
                setTimeout(() => {
                    dialog.showModal();
                }, 100);
                gameData.currentQuiz = 0;
                gameData.currentClue = 0;
                gameData.time = 30;
                gameData.currentKey = '';
                gameData.completed = ['quiz', 'map'];
                localStorage.set(gameData);
                router('clue');
                return;
            }
            localStorage.set(gameData);
            setTimeout(() => {
                displayQuestion(quiz, quizNum);
            }, 1000);
        })

        alternativesContainer.append(btn);
    });
}

function disableButtons(buttons) {
    buttons.forEach(btn => btn.setAttribute('disabled', true))
}


async function fillState() {
    const gameData = localStorage.get();
    const currentKey = gameData.currentKey;
    if (gameData.completed.find(milstone => milstone === 'quiz')) {
        const popupComponent = {
            id: 'quiz-popup',
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
        dialog.querySelector("#next-page").addEventListener('click', (e) => { router('clue') });
        dialog.showModal();
        return;
    } else {

        const prefix = `./api/GET.php?entity=QUIZES&key=${currentKey}`;
        STATE.Get({ entity: 'QUIZES', prefix });
    }
}

PubSub.subscribe({ event: 'renderquiz', listener: fillState });
PubSub.subscribe({ event: 'stateUpdated', listener: renderComponent });