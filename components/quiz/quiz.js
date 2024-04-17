import { PubSub } from "../../logic/pubsub.js";
import { componentManger } from "../componentManager.js";
import { createHeader } from "../../identity/gameHeader.js";
import { STATE } from "../../logic/state.js";
import { localStorage } from "../../logic/helpers.js";


async function renderComponent() {
    // window.localStorage.removeItem('game-data');
    createHeader('main');
    const component = {
        id: 'quiz-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    dom.innerHTML = `
        <h1>QUIZ TIME</h1>
        <div id="question-container">
            <h3 id="question"></h3>
            <p id="current-question"></p>
        </div>

        <div id="alternatives-container"></div>
    `;

    const popupComponent = {
        id: 'start-popup',
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
                console.log('slut');
                gameData.currentQuiz = 0;
                gameData.currentKey = '';
                localStorage.set(gameData);
                window.location = './clue';
                return;
            }
            localStorage.set(gameData);
            setTimeout(() => {
                displayQuestion(quiz, quizNum);
            }, 2000);
        })

        alternativesContainer.append(btn);
    });
}

function disableButtons(buttons) {
    buttons.forEach(btn => btn.setAttribute('disabled', true))
}


async function fillState() {
    const gameData = JSON.parse(window.localStorage.getItem('game-data'));
    const currentKey = gameData.currentKey;

    const prefix = `./api/GET.php?entity=QUIZES&key=${currentKey}`;
    STATE.Get({ entity: 'QUIZES', prefix });
}

PubSub.subscribe({ event: 'renderquiz', listener: fillState });
PubSub.subscribe({ event: 'stateUpdated', listener: renderComponent });