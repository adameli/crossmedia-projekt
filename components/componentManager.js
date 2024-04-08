export function componentManger(component) {

    let dom = document.createElement(component.tag);
    dom.id = component.id;
    if (Object.hasOwn(component, "clas")) dom.classList.add(component.clas);
    document.getElementById(component.parentId).append(dom);

    if (Object.hasOwn(component, "cssId")) {
        const link = document.getElementById(component.cssId);

        if (!link) {
            const element = document.createElement("link");
            element.setAttribute("rel", "stylesheet");
            element.setAttribute("id", component.cssId);
            element.setAttribute("type", "text/css");
            element.setAttribute("href", component.href);
            document.getElementsByTagName("head")[0].appendChild(element);
        }
    }

    return dom;
}
