import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";
import { STATE } from "../../../../logic/state.js";
function renderComponent(parentId) {
    const component = {
        id: 'clue-container',
        parentId: parentId,
        tag: 'div',
    }

    componentManger(component);

    STATE.Get({ entity: 'CLUES', key: 'hej' });

    // PubSub.publish({ event: 'renderClueInstance', detail: component.id });
}

PubSub.subscribe({ event: 'renderClueComponents', listener: renderComponent });