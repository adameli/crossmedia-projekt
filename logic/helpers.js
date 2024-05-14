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

