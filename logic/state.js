const _state = {}


export const STATE = {
    Post,
    Patch,
    Delete,
    Get,
}


function Post() {
    console.log('hej');
}
function Patch() {

}
function Delete() {

}
function Get(entity) {
    return JSON.parse(JSON.stringify(_state[entity]));
}

