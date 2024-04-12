import { PubSub } from "./pubsub.js";

const _state = {}


export const STATE = {
    Post,
    Patch,
    Delete,
    Get,
    getEntity
}


function getEntity(entity) {
    return JSON.parse(JSON.stringify(_state[entity]));
}

function Post() {
    console.log('hej');
}
function Patch() {

}
function Delete() {

}

async function Get(data) {
    const { entity, key } = data;
    const prefix = `./api/GET.php?entity=${entity}&key=${key}`;
    const response = await fetcher(prefix);

    if (response.ok) {
        const resource = await response.json();
        console.log(resource);

        _state[entity] = (resource);

        PubSub.publish({ event: 'stateUpdated', detail: null });
        // return response.ok;
    } else {
        alert(response.statusText);
    }
}

async function fetcher(request) {
    try {
        let response = await fetch(request);
        console.log(response);
        return response;

    } catch (error) {
        console.log(error);
    }
}
