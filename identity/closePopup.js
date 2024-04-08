export function closePopup(dialog, dialogBtns) {

    dialogBtns.forEach(btn => btn.addEventListener('click', (e) => dialog.close()))

    return dialog;

}