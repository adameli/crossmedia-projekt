import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";

async function renderComponent(parentId) {
    const component = {
        id: 'clue-container',
        parentId: parentId,
        tag: 'div',
    }

    const dom = componentManger(component);
    dom.innerHTML = `
        <div id="timer-container">
            <div id="countdown"></div>
        </div>
        <h2>VART ÄR VI PÅVÄG?</h2>
        <div id="clue-point"></div>
    `;


    PubSub.publish({ event: 'renderClueInstance', detail: component.id });

}

PubSub.subscribe({ event: 'renderClueComponents', listener: renderComponent });