export function router(path) {
    const urlPath = window.location.pathname;
    window.location = `${urlPath}?view=${path}`;
}