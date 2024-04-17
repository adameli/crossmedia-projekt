export const localStorage = {
    get,
    set
}


function set(gameData) {
    window.localStorage.setItem('game-data', JSON.stringify(gameData));
}

function get() {
    return JSON.parse(window.localStorage.getItem('game-data'));
}

// import { Fireworks } from 'https://esm.run/fireworks-js';

// let container = document.querySelector('.container');

// let options = {
//     gravity: 1.4,
//     opacity: 0.4,
//     autoresize: true,
//     acceleration: 1.00,
// };

// let fireworks = new Fireworks(container, options);

// fireworks.start();