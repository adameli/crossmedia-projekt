import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";
import { STATE } from "../../../../logic/state.js";
import { createHeader } from "../../../../identity/gameHeader.js";

async function renderComponent() {

    createHeader('main');
    const component = {
        id: 'game-container',
        parentId: 'main',
        tag: 'div',
    }

    componentManger(component);

    PubSub.publish({ event: 'renderClueComponents', detail: component.id });
}

async function fillState() {

    STATE.Get({ entity: 'CLUES', key: 'hej' });
}

PubSub.subscribe({ event: 'renderclue', listener: fillState });
PubSub.subscribe({ event: 'stateUpdated', listener: renderComponent });