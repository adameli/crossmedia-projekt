import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";

function renderComponent() {
    const component = {
        id: 'clue-container',
        parentId: 'main',
        tag: 'div',
    }

    const dom = componentManger(component);

    dom.innerHTML = `
        <h1 class="clue-title">Detta är ledtråden</h1>
    `;
}

PubSub.subscribe({ event: 'renderclue', listener: renderComponent });