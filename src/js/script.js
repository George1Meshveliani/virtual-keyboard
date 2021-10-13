import { get } from './storage.js';
import Keyboard from './Keyboard.js';

const rowsOrder = [
  ['Backquote', 'Digit1'],
];

const lang = get('kbLang', '"en"');

new Keyboard(rowsOrder).init(lang).generateLayout();
