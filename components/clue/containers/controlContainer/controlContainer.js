import { componentManger } from "../../../componentManager.js";
import { PubSub } from "../../../../logic/pubsub.js";

function renderComponent(parentId) {
    const component = {
        id: 'control-container',
        parentId: parentId,
        tag: 'div',
        clas: 'btn-input-container'
    }

    const dom = componentManger(component);

    dom.innerHTML = `
        <input  maxlength="30" type="text" placeholder="Vart är vi påväg?" id="clue-answer"></input>
        <button id="submit-clue-answer" class="btn ">OK</button>
   `;


}

PubSub.subscribe({ event: 'renderClueComponents', listener: renderComponent });