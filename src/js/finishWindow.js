import {
  puzzle,
  moves,
  min,
  sec,
  addZero,
  start,
  size
} from './script'

function finishWindow () {
  const fWindow = document.createElement('section')
  puzzle.appendChild(fWindow)
  fWindow.className = 'finish'

  const headFinishWindow = document.createElement('h2')
  fWindow.appendChild(headFinishWindow)
  headFinishWindow.innerHTML = 'Ура!'

  const text1FinishWindow = document.createElement('p')
  fWindow.appendChild(text1FinishWindow)
  text1FinishWindow.innerHTML = 'Вы решили головоломку'

  const text2FinishWindow = document.createElement('p')
  fWindow.appendChild(text2FinishWindow)
  if (moves > 4) {
    text2FinishWindow.innerHTML = `за ${addZero(min)}:${addZero(sec)} и ${moves} ходов`
  } else {
    text2FinishWindow.innerHTML = `за ${addZero(min)}:${addZero(sec)} и ${moves} хода`
  }

  const restart = document.createElement('button')
  restart.className = 'restart'
  fWindow.appendChild(restart)
  restart.innerHTML = 'Начать заново'

  restart.addEventListener('click', () => {
    start(size + 1)
  })
};

export { finishWindow }
