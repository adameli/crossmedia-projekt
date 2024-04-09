export function componentManger(component) {

    let dom = document.createElement(component.tag);
    dom.id = component.id;
    if (Object.hasOwn(component, "clas")) dom.classList.add(component.clas);
    document.getElementById(component.parentId).append(dom);


    return dom;
}
