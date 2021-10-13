import * as storage from './storage.js';
import create from './utils/create';
import language from './layouts/index';
import Key from './Key';

const main = create('main', '',
  [create('h1', 'title', 'RSS Virtual Keyboard'),
    create('h3', 'subtitle', 'blabla bla'),
    create('p', 'hint', 'Use left <kbd>Ctrl</kb> + <kbd>Alt</kbd> to switch language. Last language saves in localstorage.')]);

export default class Keyboard {
  constructor(rowsOrder) {
    this.rowsOrder = rowsOrder;
    this.keysPressed = {};
    this.isCaos = false;
  }

  init(langCode) {
    this.keyBase = language[langCode];
    this.output = create('textarea', 'output', null, main,
      ['placeholder', 'Start typing something ...'],
      ['rows', 5],
      ['cols', 50],
      ['spellcheck', false],
      ['autocorrect', 'off']);
    this.container = create('div', 'keyboard', null, main, ['language', langCode]);
    document.body.prepend(main);
    return this;
  }

  generateLayout() {
    this.keyButtons = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElement = create('div', 'keyboard_row', null, this.containter, ['row', i + 1]);
      rowElement.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;
      row.forEach((code) => {
        const keyObj = this.keyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.div);
        }
      });
    });
  }
}
