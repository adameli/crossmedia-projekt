import { PubSub } from "../../logic/pubsub.js";
import { componentManger } from "../componentManager.js";
import { createHeader } from "../../identity/gameHeader.js";
import { STATE } from "../../logic/state.js";
import { localStorage } from "../../logic/helpers.js";
import { router } from "../../logic/router.js";


async function renderComponent() {
    const gameData = localStorage.get();

    createHeader('main', gameData.currentPlace.toUpperCase());
    const component = {
        id: 'quiz-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    dom.innerHTML = `
        <div id="second-quiz-header">
            <p id="current-question"></p>
        </div>

        <div id="question-container">
            <h4 id="question" class="text-style"></h4>
        </div>

        <div id="alternatives-container"></div>
    `;

    const popupComponent = {
        id: 'quiz-popup',
        parentId: 'main',
        tag: 'dialog',
    }
    componentManger(popupComponent);


    const quiz = STATE.getEntity('QUIZES');

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

    if (question.answers) {
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
                setTimeout(() => {
                    nextQuestion();
                    // displayQuestion(quiz, quizNum);
                }, 1000);
            })

            alternativesContainer.append(btn);
        });
    } else {
        alternativesContainer.innerHTML = `
        <input type="text" id="quiz-input-answer" placeholder="">
        <button id="submit-answer" class="btn">SVARA</button>
        `

        document.querySelector('#submit-answer').addEventListener('click', async (e) => {
            const input = document.querySelector('#quiz-input-answer');
            const cleandString = input.value
                .trim('')
                .replace(/[\s]/g, '')
                .toLowerCase();

            let isCorrect = false;
            if (Array.isArray(question.correctAnswer)) isCorrect = isCorrectAnswer(cleandString, question.correctAnswer, question.type)
            else isCorrect = question.correctAnswer === cleandString;

            if (isCorrect) {
                input.classList.add('right');
                document.getElementById('points').textContent = ++gameData.points;
            } else {
                input.classList.add('wrong');
            }

            gameData.currentQuiz++;
            setTimeout(() => {
                nextQuestion();
            }, 1000);
        });
    }

    function isCorrectAnswer(value, words, type) {

        let booleans = [];
        words.forEach(word => {
            booleans.push(value.includes(word));
        })

        //* xx bestämer att alla orden i arrayen måste vara inkluderad i spelarens svar ex "doris och nemo"
        if (type === 'xx') {
            return booleans[0] && booleans[1];
        }
        //* xy bestämer att ett av orden i arrayen måste vara inkluderad i spelarens svar ex "10", "tio"
        if (type === 'xy') {
            return booleans[0] || booleans[1];
        }
    }


    function nextQuestion() {
        if (gameData.currentQuiz === 5) {
            let text = '';
            switch (gameData.beenTo.length) {
                case 1:
                    text = 'Bra jobbat, du har klarat första omgången, gör dig redo för nästa omgång!'
                    break;
                case 2:
                    text = 'Detta går ju galant, andra omgången är nu avklarad, gör dig redo för nästa omgång!'
                    break;
                case 3:
                    text = 'Grattis! Du har nu klarat utmaningen, är du redo att se hur du ligger till i poängligan?'
                    break;
                default:
                    break;
            }
            const dialog = document.getElementById('quiz-popup');
            dialog.innerHTML = `
            <div class="next-step-container">
                <img class="popup-guide" src="./resources/images/${gameData.guide}.png">
                <h2 class="sub-title" >${text}</h2>
                <button id="next-page" class="btn">REDO</button>
            </div>
        `;

            dialog.showModal();
            dialog.querySelector("#next-page").addEventListener('click', (e) => { router('clue') });

            gameData.currentQuiz = 0;
            gameData.currentClue = 0;
            gameData.time = 60;
            gameData.currentKey = '';
            gameData.completed = ['quiz', 'map'];
            localStorage.set(gameData);
            return;
        }

        localStorage.set(gameData);
        displayQuestion(quiz, quizNum);
    }
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
            <div class="next-step-container">
                <h2 class="sub-title" >Du har redan klarat detta steget, gå vidare till nästa</h2>
                <button id="next-page" class="btn">Gå vidare!</button>
            </div>
        `;
        dialog.querySelector("#next-page").addEventListener('click', (e) => { router('clue') });
        dialog.showModal();
        return;
    } else {

        const prefix = `./api/GET.php?entity=QUIZES&key=${currentKey}`;
        // const prefix = `./api/GET.php?entity=QUIZES&key=lol`;
        STATE.Get({ entity: 'QUIZES', prefix });
    }
}

PubSub.subscribe({ event: 'renderquiz', listener: fillState });
PubSub.subscribe({ event: 'stateUpdated', listener: renderComponent });