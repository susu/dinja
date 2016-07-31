
global.__dinjaDebug__ = false;

export function enableDebug() {
    global.__dinjaDebug__ = true;
}

export function disableDebug() {
    global.__dinjaDebug__ = false;
}

export function log(...args) {
    if (global.__dinjaDebug__) {
        args[0] = `dinja: ${args[0]}`;
        console.log(...args);
    }
}
