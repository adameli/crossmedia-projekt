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

async function Get(data) {
    const { entity, key } = data;
    const prefix = `./api/GET.php?entity=${entity}&key=${key}`;
    const resource = await fetcher(prefix);
    console.log(resource);
    // _state[entity].push(resource);
    // return JSON.parse(JSON.stringify(_state[entity]));
}

async function fetcher(request) {
    try {
        let response = await fetch(request);
        console.log(response);

        if (response.ok) {
            return await response.json();
        }

    } catch (error) {
        console.log(error);
    }
}
