import { pauseMenu } from './../script'

let arrScore
const numberOfBestScore = 10

function saveScore (movesScore) {
  if (!localStorage.getItem('arrScore')) {
    arrScore = []
  } else {
    arrScore = localStorage.getItem('arrScore').split(',')
  };

  if (arrScore.length > numberOfBestScore) {
    if (arrScore[9] < movesScore) return
    arrScore.pop()
  }

  arrScore.push(movesScore)
  arrScore.sort((a, b) => { return a - b })
  if (arrScore === []) {
    return
  }
  localStorage.setItem('arrScore', arrScore.join(','))
}

function score () {
  const puzzle = document.querySelector('.puzzle')
  document.querySelector('.finish').remove()
  const fWindow = document.createElement('section')
  puzzle.appendChild(fWindow)
  fWindow.className = 'finish'

  const textHeadScore = document.createElement('h2')
  fWindow.append(textHeadScore)
  textHeadScore.classList.add('headScore')
  textHeadScore.innerHTML = 'BEST SCORE'

  const textList = document.createElement('ul')
  fWindow.append(textList)
  for (let i = 0; i < 10; i++) {
    const textListElem = document.createElement('li')
    textList.appendChild(textListElem)

    const scoreValue = localStorage.getItem('arrScore').split(',')[i]
    if (!localStorage.getItem('arrScore') ||
            !scoreValue
    ) {
      continue
    } else {
      textListElem.innerHTML = `${i + 1}. ${scoreValue} moves`
    };
  }

  const btnBack = document.createElement('button')
  fWindow.appendChild(btnBack)
  btnBack.classList.add('btnMenu')
  btnBack.innerHTML = 'Back'
  btnBack.addEventListener('click', pauseMenu)
};

export { score, saveScore }
