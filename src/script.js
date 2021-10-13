import KEYS from './keys.js';
import Keyboard from './modules/Keyboard.js';

window.onload = () => {
  /* Add comment, how to use app and how it was made */
  const hint = document.createElement('p');
  hint.innerHTML = '<strong>Сменить раскладку: left Ctrl + left Shift</strong>. Сделано на&nbsp;Mac&nbsp;OS, расположение кнопок может отличаться от&nbsp;компьютера с&nbsp;Windows (например, Cmd заменяет Win, нет клавиши Del). Если на&nbsp;Windows что-то не&nbsp;работает, пожалуйста, напишите мне в&nbsp;телеграм <strong>hallovarvara</strong> или дискорд <strong>Varya Dev. (@hallovarvara)</strong>';
  document.body.append(hint);

  /* Add textarea for to output symbols */
  const textarea = document.createElement('textarea');
  textarea.classList.add('text');
  document.body.append(textarea);

  /* Add keyboard container */
  const keyboardView = document.createElement('div');
  keyboardView.classList.add('keyboard');
  document.body.append(keyboardView);

  /* Create keyboard */
  const keyboard = new Keyboard(KEYS, keyboardView);

  /* What's happening if mouse button'is pressed or released */
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

  /* Catch if mouse button's pressed or released */
  keyboardView.addEventListener('mousedown', pressMouseButton);
  document.addEventListener('click', releaseMouseButton);
  /* document's using because button can be released when cursor's outside the keyboard area */

  /* What's happening if computer buttons're pressed or released */
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

  /* Catch if computer buttons're pressed or released */
  document.addEventListener('keydown', pressComputerKey);
  document.addEventListener('keyup', pressComputerKey);

  /* Focus on textarea */
  textarea.focus();
  textarea.addEventListener('blur', () => textarea.focus());

  /* Inactivate all buttons (except CapsLock), when focus got out of page and returned back */
  window.addEventListener('blur', () => {
    if (keyboard.pressed.includes('CapsLock')) keyboard.pressed = ['CapsLock'];
    else keyboard.pressed = [];
    keyboard.activateKeys();
  });
};
