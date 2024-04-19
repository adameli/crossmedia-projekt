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

async function Post(data) {
    const { entity, bodyData } = data;
    const request = new Request('./api/POST.php', {
        method: 'POST',
        headers: { "Content-type": 'application/json' },
        body: JSON.stringify(bodyData)
    })

    const response = await fetcher(request);

    if (response.ok) {
        const resource = await response.json();
        console.log(resource);

        return resource;
    } else {
        alert(response.statusText);
    }
}
function Patch() {

}
function Delete() {

}

async function Get(data) {
    const { entity, prefix } = data;
    const response = await fetcher(prefix);

    if (response.ok) {
        const resource = await response.json();
        console.log(resource);

        _state[entity] = (resource);
        console.log(_state);
        PubSub.publish({ event: 'stateUpdated', detail: null });
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
