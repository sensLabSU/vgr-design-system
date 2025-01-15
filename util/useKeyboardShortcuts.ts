import {onBeforeUnmount} from "vue";

class KeyboardShortcutManager {
    boundKeys = {};

    constructor() {
        window.addEventListener('keydown', (e) => {
            const focused = window.document.querySelector(':focus');
            if(focused) {
                if(focused.tagName === 'TEXTAREA') {
                    return;
                }
                if(focused.tagName === 'INPUT') {
                    if(['text','search','password','email','tel','date','datetime-local','month','number','time','url','week'].includes(focused.getAttribute('type')))
                        return;
                }
            }

            const key = e.key.toUpperCase();

            if(this.boundKeys[key]?.length) {
                this.boundKeys[key].forEach((shortcut: KeyboardShortcut) => {
                    if(shortcut._withCtrl !== undefined && shortcut._withCtrl !== e.ctrlKey) return;
                    if(shortcut._withShift !== undefined && shortcut._withShift !== e.shiftKey) return;

                    shortcut.callback();

                    e.preventDefault();
                });
            }
        });
    }

    add(shortcut: KeyboardShortcut) {
        this.boundKeys[shortcut._key] = this.boundKeys[shortcut._key] || [];
        if(this.boundKeys[shortcut._key].indexOf(shortcut) < 0) {
            this.boundKeys[shortcut._key].push(shortcut);
        }
    }

    remove(shortcut: KeyboardShortcut) {
        if(this.boundKeys[shortcut._key]?.length) {
            const index = this.boundKeys[shortcut._key].indexOf(shortcut);
            if(index >= 0) {
                this.boundKeys[shortcut._key].splice(index, 1);
            }
        }
    }
}

const keyboardShortcutManager = new KeyboardShortcutManager();

class KeyboardShortcut {
    callback: () => void;

    _key: string;
    _withCtrl?: boolean = false;
    _withShift?: boolean = false;

    constructor(key: string) {
        this._key = key.toUpperCase();
    }

    withCtrl() {
        this._withCtrl = true;
        return this;
    }

    withOrWithoutCtrl() {
        this._withCtrl = undefined;
        return this;
    }

    withShift() {
        this._withShift = true;
        return this;
    }

    withOrWithoutShift() {
        this._withShift = undefined;
        return this;
    }

    do(callback: () => void) {
        this.callback = callback;
        keyboardShortcutManager.add(this);
        return this;
    }

    cancel() {
        keyboardShortcutManager.remove(this);
    }
}

const onKeyboard = function(key: string) {
    const s = new KeyboardShortcut(key);

    onBeforeUnmount(() => {
        keyboardShortcutManager.remove(s);
    });

    return s;
}

function useKeyboardShortcuts() {
    return onKeyboard;
}

export default useKeyboardShortcuts;