import './../style.scss'

import { finishWindow } from './finishWindow'
import { save } from './pauseMenu/save'
import { score, saveScore } from './pauseMenu/score'
import { settingsMenu, onAudio } from './pauseMenu/settings'
import { arrAutoFinish, autoFinishGame } from './pauseMenu/finishGame'

const header = document.createElement('header')
const gameName = document.createElement('h1')
const stat = document.createElement('div')
const textTime = document.createElement('p')
const textMove = document.createElement('p')
const textPause = document.createElement('button')
const textResume = document.createElement('button')
const puzzle = document.createElement('div')
const warning = document.createElement('section')
const warningHead = document.createElement('h2')
const warningContent = document.createElement('p')
let audio

document.body.append(header)
header.append(gameName)
header.append(stat)
stat.appendChild(textTime)
stat.appendChild(textMove)
stat.appendChild(textPause)
stat.appendChild(textResume)
document.body.append(puzzle)
document.body.append(warning)
warning.append(warningHead)
warning.append(warningContent)

puzzle.className = 'puzzle'
warning.className = 'warning'
warningHead.innerHTML = 'WARNING!'
warningContent.innerHTML = 'Загрузку сохраненной игры проводить <b>только</b> на поле такого же размера. <br> Например: если вы сохранили игру 8x8, то и load нужно делать когда стоит 8x8'
gameName.innerHTML = 'GEM PUZZLE'
stat.className = 'stat'
textPause.className = 'pause'
textPause.innerHTML = 'Pause'
textResume.className = 'resume'
textResume.innerHTML = 'Resume'
textResume.style.display = 'none'

let state = 1
let moves = 0
let movesScore

// header ----------------
// displays the number of moves
function countMoves () {
  textMove.innerHTML = `Moves: ${moves}`
};

let size
let setTimer
let time = 0
let sec
let min

// time counter
function timer () {
  sec = time % 60
  min = Math.trunc(time / 60)
  // hour = Math.trunc(min / 60);
  textTime.innerHTML = `${addZero(min)}<span>:</span>${addZero(sec)}`
  time++
  setTimer = setTimeout(timer, 1000)
}
// adds a zero in the timer
function addZero (n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n
}

// --------------------------------------------------------
// Start game
function start (fieldSize) {
  size = fieldSize - 1
  let sizeElem

  if (fieldSize === 3) sizeElem = 105
  if (fieldSize === 4) sizeElem = 79
  if (fieldSize === 8) sizeElem = 39

  time = 0
  moves = 0
  countMoves()

  if (!state) return

  puzzle.innerHTML = ''

  let n = 1
  for (let i = 0; i <= fieldSize - 1; i++) {
    for (let j = 0; j <= fieldSize - 1; j++) {
      const elem = document.createElement('div')
      elem.id = i + '-' + j
      elem.style.left = (j * sizeElem + 1 * j + 1) + 'px'
      elem.style.top = (i * sizeElem + 1 * i + 1) + 'px'

      const numberOfItems = fieldSize ** 2 - 1
      if (n <= numberOfItems) {
        elem.classList.add('number', 'el', `el${fieldSize}`)
        elem.setAttribute('draggable', true)
        elem.innerHTML = (n++).toString()
      } else {
        elem.classList.add('empty', `el${fieldSize}`)
      }

      puzzle.appendChild(elem)
    }
  }

  sort()
  dragAndDrop()
  timer()
}
// get element
function getElem (row, col) {
  return document.getElementById(row + '-' + col)
}
// get Empty element
function getEmptyElem () {
  return puzzle.querySelector('.empty')
}

// get Adjacent elements
function getAdjacentElem (elem) {
  const id = elem.id.split('-')

  const row = parseInt(id[0])
  const col = parseInt(id[1])

  const arrElem = []
  if (row < size) arrElem.push(getElem(row + 1, col))
  if (row > 0) arrElem.push(getElem(row - 1, col))
  if (col < size) arrElem.push(getElem(row, col + 1))
  if (col > 0) arrElem.push(getElem(row, col - 1))

  return arrElem
}

// checking an empty element
function getAdjacentElemEmpty (elem) {
  const arrAdjElem = getAdjacentElem(elem)
  for (let i = 0; i < arrAdjElem.length; i++) {
    const isEmptyElement = /^empty/.test(arrAdjElem[i].className)
    if (isEmptyElement) return arrAdjElem[i]
  }
  return false
}
// move element
function move (elem) {
  if (elem.className !== 'empty') {
    const emptyElem = getAdjacentElemEmpty(elem)

    if (emptyElem) {
      if (onAudio && audio) audio.play()

      const info = { style: elem.style.cssText, id: elem.id }

      elem.style.cssText = emptyElem.style.cssText
      elem.id = emptyElem.id
      emptyElem.style.cssText = info.style
      emptyElem.id = info.id

      countMoves()
      if (state === 1) finish()
    }
  }
}
puzzle.addEventListener('click', (e) => {
  const emptyElem = getAdjacentElemEmpty(e.target)
  if (emptyElem) {
    playSound()

    if (state === 1) {
      moves++
      move(e.target)
    }
  }
})

// sorting elements
function sort () {
  if (!state) return
  state = 0
  let previous
  let i = 1
  const swap = setInterval(function () {
    const numberOfMovesToSort = (size + 1) ** 2 * 10 * Math.ceil((size + 1) / 4)
    if (i <= numberOfMovesToSort) {
      const arrAdjElem = getAdjacentElem(getEmptyElem())
      if (previous) {
        for (let j = arrAdjElem.length - 1; j >= 0; j--) {
          if (arrAdjElem[j].innerHTML === previous.innerHTML) arrAdjElem.splice(j, 1)
        }
      }
      previous = arrAdjElem[Math.floor(Math.random() * arrAdjElem.length)]
      move(previous)
      i++
    } else {
      clearInterval(swap)
      state = 1
    }
  }, 0)
}

// checking the end of the game
function finish () {
  const isEmptyElement = /^empty/.test(getElem(size, size).className)
  if (!isEmptyElement) return

  let n = 1
  const numberOfItems = (size + 1) ** 2 - 1

  for (let i = 0; i <= size; i++) {
    for (let j = 0; j <= size; j++) {
      if (n <= numberOfItems &&
                getElem(i, j).innerHTML !== n.toString()
      ) return
      n++
    }
  }

  clearTimeout(setTimer)
  saveScore(moves)
  finishWindow()
}

// pause menu button
textPause.addEventListener('click', () => {
  clearTimeout(setTimer)
  pauseMenu()
})
textResume.addEventListener('click', resumeMenu)
// change the button
function swapPauseToResume () {
  textPause.style.display = ''
  textResume.style.display = 'none'
};

// pause menu
function pauseMenu () {
  if (!document.querySelector('.finish')) {
    textPause.style.display = 'none'
    textResume.style.display = ''
  } else {
    document.querySelector('.finish').remove()
  }

  const fWindow = document.createElement('section')
  puzzle.appendChild(fWindow)
  fWindow.className = 'finish'

  const menu = {
    0: 'New game',
    1: 'Save game',
    2: 'Load game',
    3: 'Best score',
    4: 'Finish game',
    5: 'Settings'
  }
  const menuClass = {
    0: 'newGame',
    1: 'saveGame',
    2: 'loadGame',
    3: 'bestScore',
    4: 'finishGame',
    5: 'settings'
  }

  for (let i = 0; i < 6; i++) {
    const btnMenu = document.createElement('button')
    fWindow.appendChild(btnMenu)
    btnMenu.classList.add('btnMenu', `${menuClass[i]}`)
    btnMenu.innerHTML = menu[i]
  }

  const newGame = document.querySelector('.newGame')
  const saveGame = document.querySelector('.saveGame')
  const loadGame = document.querySelector('.loadGame')
  const bestScore = document.querySelector('.bestScore')
  const finishGame = document.querySelector('.finishGame')
  const settings = document.querySelector('.settings')

  // new game
  newGame.addEventListener('click', () => {
    swapPauseToResume()
    start(size + 1)
  })

  // save game
  saveGame.addEventListener('click', save)

  // load game
  loadGame.addEventListener('click', load)

  function load () {
    const s = localStorage.getItem('size')
    if (size !== Number(s)) return
    time = localStorage.getItem('time')
    moves = localStorage.getItem('moves')
    countMoves()
    resumeMenu()

    let k = 0
    const emp = document.querySelector('.empty')
    emp.classList.add('el')

    document.querySelectorAll('.el').forEach(e => {
      const inf = JSON.parse(localStorage.getItem(`${k}`))

      e.className = inf.class
      e.id = inf.id
      e.style.cssText = inf.style
      k++
    })
  };

  // best score
  bestScore.addEventListener('click', score)

  // settings
  settings.addEventListener('click', settingsMenu)

  // finish game
  let autoMove

  function autoComplete () {
    let i = 0
    let row, col
    autoMove = setInterval(() => {
      if (i < arrAutoFinish.length) {
        row = arrAutoFinish[i].piece.y
        col = arrAutoFinish[i].piece.x
        const e = document.getElementById(row + '-' + col)
        move(e)
        moves++
        i++
      } else {
        clearInterval(autoMove)
      }
    }, 300)
  }
  finishGame.addEventListener('click', () => {
    resumeMenu()
    autoFinishGame()
    autoComplete()
  })
};

// resume game
function resumeMenu () {
  swapPauseToResume()

  document.querySelector('.finish').remove()
  timer()
};

function playSound () {
  audio = document.createElement('audio')
  document.body.append(audio)
  audio.setAttribute('src', '../src/s.mp3')
  audio.setAttribute('muted', 'muted')
}

function stopSound () {
  document.querySelector('audio').remove()
}

// drag and drop
function dragAndDrop () {
  const empty = document.querySelector('.empty')
  let dragElem

  function dragStart (elem) {
    const emptyElem = getAdjacentElemEmpty(elem)
    if (emptyElem) {
      setTimeout(() => {
        elem.classList.add('hide')
      }, 0)
    };
  };

  function dragEnd (elem) {
    elem.classList.remove('hide')
  };

  document.querySelectorAll('.number').forEach(e => {
    e.addEventListener('dragstart', (el) => {
      dragStart(el.target)
      dragElem = el.target
    })
    e.addEventListener('dragend', (el) => {
      dragEnd(el.target)
    })
  })

  function dragOver (evt) {
    evt.preventDefault()
  };

  empty.addEventListener('dragover', dragOver)
  empty.addEventListener('drop', () => {
    if (state === 1) {
      moves++
      move(dragElem)
    }
  })
};

export {
  puzzle,
  moves,
  time,
  min,
  sec,
  addZero,
  start,
  textPause,
  textResume,
  timer,
  countMoves,
  resumeMenu,
  movesScore,
  pauseMenu,
  swapPauseToResume,
  size,
  move,
  playSound,
  stopSound
}

size = Number(localStorage.getItem('size'))
if (!localStorage.getItem('size')) start(4)
start(size + 1)
