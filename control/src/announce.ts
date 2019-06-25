export function initialize() {
    if (document.getElementById('s25-live')) {
        return;
    }

    const live = document.createElement('div');
    live.setAttribute('id', 's25-live');
    live.setAttribute('class', 's25-offscreen s25-live');
    document.body.appendChild(live);

    const assertive = document.createElement('div');
    assertive.setAttribute('id', 's25-live-assertive');
    assertive.setAttribute('role', 'log');
    assertive.setAttribute('aria-live', 'assertive');
    assertive.setAttribute('aria-relevant', 'additions');
    live.appendChild(assertive);

    const polite = document.createElement('div');
    polite.setAttribute('id', 's25-live-polite');
    polite.setAttribute('role', 'log');
    polite.setAttribute('aria-live', 'polite');
    polite.setAttribute('aria-relevant', 'additions');
    live.appendChild(polite);
}

export function assertively(message: string) {
    add(message, document.getElementById('s25-live-assertive')!);
}

export function politely(message: string) {
    add(message, document.getElementById('s25-live-polite')!);
}

function add(message: string, container: HTMLElement) {
    const node = document.createElement('div');
    node.appendChild(document.createTextNode(message));
    container.appendChild(node);

    // clean up old nodes

    let collection = document.getElementById('s25-live-assertive')!;
    while (collection.firstChild && collection.firstChild !== node) {
        collection.removeChild(collection.firstChild);
    }
    collection = document.getElementById('s25-live-polite')!;
    while (collection.firstChild && collection.firstChild !== node) {
        collection.removeChild(collection.firstChild);
    }
}
