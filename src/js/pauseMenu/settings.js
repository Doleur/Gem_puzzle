import { start, pauseMenu, swapPauseToResume, playSound, stopSound } from './../script'

let onAudio = true

function settingsMenu () {
  const puzzle = document.querySelector('.puzzle')
  document.querySelector('.finish').remove()
  const fWindow = document.createElement('section')
  puzzle.appendChild(fWindow)
  fWindow.className = 'finish'

  const textHeadSettings = document.createElement('h2')
  fWindow.append(textHeadSettings)
  textHeadSettings.classList.add('headScore')
  textHeadSettings.innerHTML = 'SETTINGS'

  const menu = {
    0: '3 x 3',
    1: '4 x 4',
    2: '8 x 8'
  }
  const menuClass = {
    0: 'three',
    1: 'four',
    2: 'eight'
  }

  for (let i = 0; i < 3; i++) {
    const btnMenu = document.createElement('button')
    fWindow.appendChild(btnMenu)
    btnMenu.classList.add('btnMenu', `${menuClass[i]}`)
    btnMenu.innerHTML = menu[i]
  }

  const game3 = document.querySelector('.three')
  const game4 = document.querySelector('.four')
  const game8 = document.querySelector('.eight')

  function startNewGameWithSize (number) {
    swapPauseToResume()
    start(number)
  };

  game3.addEventListener('click', () => {
    startNewGameWithSize(3)
  })

  game4.addEventListener('click', () => {
    startNewGameWithSize(4)
  })
  game8.addEventListener('click', () => {
    startNewGameWithSize(8)
  })

  // sound

  const sound = document.createElement('button')
  fWindow.appendChild(sound)
  sound.classList.add('btnMenu', 'sound')
  if (onAudio) {
    sound.innerHTML = 'Sound ON'
    sound.addEventListener('click', () => {
      sound.innerHTML = 'Sound OFF'
      onAudio = !onAudio
      stopSound()
    })
  } else {
    sound.innerHTML = 'Sound OFF'
    sound.addEventListener('click', () => {
      sound.innerHTML = 'Sound ON'
      onAudio = !onAudio
      playSound()
    })
  }

  const btnBack = document.createElement('button')
  fWindow.appendChild(btnBack)
  btnBack.classList.add('btnMenu')
  btnBack.innerHTML = 'Back'
  btnBack.addEventListener('click', pauseMenu)
};

export { settingsMenu, onAudio }
