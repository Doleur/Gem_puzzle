import {
  moves,
  time,
  resumeMenu,
  size

} from './../script'

function save () {
  localStorage.setItem('time', time)
  localStorage.setItem('moves', moves)
  localStorage.setItem('size', size)

  let k = 0
  document.querySelectorAll('.number').forEach(e => {
    localStorage.setItem(`${k}`, JSON.stringify({ class: e.className, style: e.style.cssText, id: e.id }))
    k++
  })
  const emp = document.querySelector('.empty')
  const numberOfItems = (size + 1) ** 2 - 1
  localStorage.setItem(`${numberOfItems}`, JSON.stringify({ class: emp.className, style: emp.style.cssText, id: emp.id }))

  resumeMenu()
};

export { save }
