export default class {
  constructor(keys, view) {
    this.language = this.getLanguage();
    this.keys = keys;
    this.view = view;

    this.capslockPressed = false;

    this.pressed = [];
    this.createKeyboard();
  }

  createKeyboard() {
    let currentRow;
    this.keys.forEach((key) => {
      if (currentRow !== key.row) {
        const row = document.createElement('div');
        row.classList.add('keyboard_row');
        this.view.append(row);
        currentRow = key.row;
      }
      const button = document.createElement('button');
      button.dataset.keyCode = key.code;
      if (key.classes) button.classList = key.classes;
      button.innerHTML = key.isSpecial ? key.name : key[this.language];

      this.view.querySelectorAll('.keyboard_row')[currentRow].append(button);
    });
  }

  changeState(code, type) {
    this.press(code, type);
    this.activateKeys();
    this.switchLanguage();
    this.updateKeys();
  }

  isPressed(keyName) {
    return (keyName === 'CapsLock') ? this.capslockPressed : this.pressed.some((key) => key.includes(keyName));
  }

  updateKeys() {
    this.view.querySelectorAll('button')
      .forEach((button) => {
        const data = this.getButtonInfo(button);
        if (!data.isSpecial) {
          let updated = data[this.language];

          if (this.isPressed('Shift')
          || (this.isPressed('Shift') && this.isPressed('CapsLock'))) {
            updated = data[`${this.language}Shift`];
          } else if (this.isPressed('CapsLock')) {
            updated = data[this.language].toUpperCase();
          }

          document.querySelector(`[data-key-code="${data.code}"]`).innerHTML = updated;
        }
      });
  }

  setLanguage(language = this.language) {
    localStorage.setItem('language', language);
    return this;
  }

  getLanguage() {
    let currentLanguage = 'en';
    if (!localStorage.getItem('language')) {
      this.setLanguage(currentLanguage);
    } else {
      currentLanguage = localStorage.getItem('language');
    }
    return currentLanguage;
  }

  switchLanguage() {
    if (this.isPressed('ShiftLeft') && this.isPressed('ControlLeft')) {
      this.language = (this.language === 'en') ? 'ru' : 'en';
      this.setLanguage(this.language);
    }
  }

  getButtonInfo(button) {
    return this.keys.filter((key) => key.code === button.dataset.keyCode)[0];
  }

  press(code, happening) {
    if (code === 'CapsLock') {
      switch (happening) {
        case 'mousedown':
        case 'keydown':
        case 'keyup':
          this.capslockPressed = !this.capslockPressed;
          break;
        default:
      }
    } else if (code !== 'CapsLock') {
      switch (happening) {
        case 'keydown':
        case 'mousedown':
          if (!this.isPressed(code)) this.pressed.push(code); break;
        case 'keyup':
          if (this.isPressed(code)) this.pressed.splice(this.pressed.indexOf(code), 1); break;
        case 'click':
          if (this.isPressed(code)) {
            this.pressed.splice(this.pressed.indexOf(code), 1);
          }
          break;
        default:
      }
    }
  }

  type(button, text) {
    const data = this.getButtonInfo(button);

    const textarea = document.querySelector('.text');
    let carriagePosition = textarea.selectionStart;

    let textBeginning = text.slice(0, carriagePosition);
    const textEnding = text.slice(carriagePosition);

    let typed = '';
    if (data.isSpecial) {
      switch (data.code) {
        case 'Backspace':
          textBeginning = textBeginning.slice(0, -1);
          carriagePosition -= 1;
          break;
        case 'Tab':
          typed = '\t';
          carriagePosition += 1;
          break;
        case 'Enter':
          typed = '\n';
          carriagePosition += 1;
          break;
        case 'Space':
          typed = ' ';
          carriagePosition += 1;
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          this.moveCarriage(data.code);
          carriagePosition = textarea.selectionStart;
          break;
        default:
          typed = '';
      }
    } else if (this.isPressed('Shift')) {
      typed += data[`${this.language}Shift`];
      carriagePosition += 1;
    } else if (this.isPressed('CapsLock')) {
      typed += data[this.language].toUpperCase();
      carriagePosition += 1;
    } else {
      typed += data[this.language];
      carriagePosition += 1;
    }

    textarea.value = textBeginning + typed + textEnding;

    textarea.setSelectionRange(carriagePosition, carriagePosition);
  }

  moveCarriage(keyCode) {
    const textarea = document.querySelector('.text');

    const goHorizontally = () => {
      let shifting = textarea.selectionStart;
      shifting += (keyCode === 'ArrowLeft') ? -1 : 1;

      if (shifting !== -1) {
        textarea.setSelectionRange(shifting, shifting);
      }
    };

    const goVertically = () => {
      let carriagePosition = textarea.selectionEnd;

      const prevLine = textarea.value.lastIndexOf('\n', carriagePosition);
      const nextLine = textarea.value.lastIndexOf('\n', carriagePosition + 1);
      const prevPrevLine = textarea.value.lastIndexOf('\n', prevLine - 1);

      if (nextLine !== -1) {
        carriagePosition -= (keyCode === 'ArrowUp') ? prevLine : -prevLine;
        carriagePosition += (keyCode === 'ArrowUp') ? prevPrevLine : nextLine;
        textarea.setSelectionRange(carriagePosition, carriagePosition);
      }
    };

    switch (keyCode) {
      case 'ArrowLeft':
      case 'ArrowRight':
        goHorizontally(); break;
      case 'ArrowUp':
      case 'ArrowDown':
        goVertically(); break;
      default:
        throw new Error('something went wrong with arrows\' buttons');
    }

    return this;
  }

  activateKeys() {
    this.view.querySelectorAll('button').forEach((button) => {
      if (!this.isPressed(button.dataset.keyCode)) button.classList.remove('active');
    });
    this.pressed.forEach((key) => this.view.querySelector(`[data-key-code="${key}"]`).classList.add('active'));
    if (this.capslockPressed) this.view.querySelector('[data-key-code="CapsLock"]').classList.add('active');
  }
}
