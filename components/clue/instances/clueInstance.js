import { componentManger } from "../../componentManager.js";
import { PubSub } from "../../../logic/pubsub.js";

function renderInstance(parentId) {
    const component = {
        id: 'clue',
        parentId: parentId,
        tag: 'h4',
    }

    const dom = componentManger(component);

    dom.textContent = 'Kungens dotter firade sin 60 års dag på denna plats. Kvällen slutade med en riktig skandal.'

}

PubSub.subscribe({ event: 'renderClueInstance', listener: renderInstance });