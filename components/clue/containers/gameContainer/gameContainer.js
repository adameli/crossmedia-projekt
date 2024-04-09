import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";

function renderComponent() {
    const component = {
        id: 'game-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    PubSub.publish({ event: 'renderClueComponents', detail: component.id });
}

PubSub.subscribe({ event: 'renderclue', listener: renderComponent });