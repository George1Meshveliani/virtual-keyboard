import create from './util/create.js';

export default class Key {
    constructor({ small, shift, code }) {
        this.code = code;
        this.small = small;
        this.shift = shift;
        this.isFnKey = Boolean(small.match(/Ctrl|arr|Alt|Shift|Tab|Back|Del|Enter|Caps|Win/));
    }
}