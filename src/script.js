import KEYS from './keys.js';
import Keyboard from './Modules/Keyboard.js';

window.onload = () => {
  const hint = document.createElement('p');
  hint.innerHTML = '<strong> Click left Ctrl + left Shift to change languages</strong>.';
  document.body.append(hint);

  const textarea = document.createElement('textarea');
  textarea.classList.add('text');
  document.body.append(textarea);

  const keyboardView = document.createElement('div');
  keyboardView.classList.add('keyboard');
  document.body.append(keyboardView);

  const keyboard = new Keyboard(KEYS, keyboardView);

  const pressMouseButton = (event) => {
    if (event.target.tagName === 'BUTTON') {
      keyboard.changeState(event.target.dataset.keyCode, event.type);
      keyboard.type(event.target, textarea.value);
    }
  };

  const releaseMouseButton = (event) => {
    const code = (event.target.dataset.keyCode) ? event.target.dataset.keyCode : '';
    keyboard.changeState(code, event.type);
  };

  keyboardView.addEventListener('mousedown', pressMouseButton);
  document.addEventListener('click', releaseMouseButton);

  const pressComputerKey = (event) => {
    event.preventDefault();
    const virtualKey = keyboard.view.querySelector(`[data-key-code="${event.code}"]`);

    if (virtualKey) {
      keyboard.changeState(event.code, event.type);
      if (event.type === 'keydown') {
        keyboard.type(virtualKey, textarea.value);
      }
    }
  };

  document.addEventListener('keydown', pressComputerKey);
  document.addEventListener('keyup', pressComputerKey);

  textarea.focus();
  textarea.addEventListener('blur', () => textarea.focus());

  window.addEventListener('blur', () => {
    if (keyboard.pressed.includes('CapsLock')) keyboard.pressed = ['CapsLock'];
    else keyboard.pressed = [];
    keyboard.activateKeys();
  });
};
