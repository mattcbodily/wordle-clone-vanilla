let dictionary
let targetWordList
const guesses = {
  guess1: [],
  guess2: [],
  guess3: [],
  guess4: [],
  guess5: [],
  guess6: [],
}

let activeTile = 0
let currentGuess = 1
const difficulty = 'EASY'
let targetWord = ''
let splitTargetWord = []

const tileGrid = document.getElementById('tile-grid')

const generateDictionary = () => {
  fetch('./dictionary.json').then(response => response.json()).then(data => {
    dictionary = data
  })
  
  fetch('./targetWords.json').then(response => response.json()).then(data => {
    targetWordList = data
    targetWord = data[Math.floor(Math.random() * data.length)]
    splitTargetWord = targetWord.toUpperCase().split('')
  })
}

const generateTiles = () => {
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('div')

    row.setAttribute('class', 'tile-grid-row')

    for (let j = 0; j < 5; j++) {
      const tile = document.createElement('div')

      tile.setAttribute('class', 'tile')
      tile.setAttribute('id', `row-${i}-tile-${j}`)
      tile.addEventListener('click', e => {
        if (i === currentGuess - 1) {
          document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.remove('active-tile')
          activeTile = j
          tile.classList.add('active-tile')
        }
      })

      if (i === 0 && j === 0) {
        tile.classList.add('active-tile')
      }

      row.appendChild(tile)
    }

    tileGrid.appendChild(row)
  }
}

const onLoadFunctions = () => {
  generateTiles()
  generateDictionary()
}

const buttons = document.getElementsByClassName('keyboard-key')
const tiles = document.getElementsByClassName('tile')

const addLetter = val => {
  if (guesses[`guess${currentGuess}`].join('').length === 5) return

  document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).innerText = val
  guesses[`guess${currentGuess}`][activeTile] = val

  if (activeTile !== 4) {
    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.remove('active-tile')
    ++activeTile
    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.add('active-tile')
  }
}

const deleteLetter = () => {
  if (guesses[`guess${currentGuess}`].length === 0) return

  document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).innerText = ''
  guesses[`guess${currentGuess}`].splice(activeTile, 1)

  if (activeTile !== 0) {
    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.remove('active-tile')
    --activeTile
    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.add('active-tile')
  }
}

const submitGuess = () => {
  if (guesses[`guess${currentGuess}`].length !== 5) return

  for (let i = 0; i < 5; i++) {
    const keyboardKey = document.querySelector(`button[value=${guesses[`guess${currentGuess}`][i]}]`)
    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.remove('active-tile')

    if (guesses[`guess${currentGuess}`][i] === splitTargetWord[i]) {
      document.getElementById(`row-${currentGuess - 1}-tile-${i}`).classList.add('green-tile')
      keyboardKey.style = 'background: green;'
    } else if (splitTargetWord.includes(guesses[`guess${currentGuess}`][i]) && guesses[`guess${currentGuess}`][i] !== splitTargetWord[i]) {
      document.getElementById(`row-${currentGuess - 1}-tile-${i}`).classList.add('yellow-tile')
      keyboardKey.style = 'background: goldenrod;'
    } else {
      document.getElementById(`row-${currentGuess - 1}-tile-${i}`).classList.add('gray-tile')
      keyboardKey.style = 'background: darkslategray;'
    }
  }

  if (guesses[`guess${currentGuess}`].join('') === targetWord.toUpperCase()) {
    return window.alert('You win!')
  }

  if (currentGuess === 6) {
    return window.alert('You lose!')
  } else {
    ++currentGuess
    activeTile = 0
    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.add('active-tile')
  }
}

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', e => {
    if (e.target.value !== 'ENTER' && e.target.value !== 'DELETE') {
      addLetter(e.target.value)
    } else if (e.target.value === 'DELETE') {
      deleteLetter()
    } else if (e.target.value === 'ENTER') {
      submitGuess()
    }
  })
}

window.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== 'Backspace' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') {
    addLetter(e.key.toUpperCase())
  } else if (e.key === 'Backspace') {
    deleteLetter()
  } else if (e.key === 'Enter') {
    submitGuess()
  } else if (e.key === 'ArrowLeft') {
    if (activeTile === 0) return

    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.remove('active-tile')
    activeTile -= 1
    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.add('active-tile')
  } else if (e.key === 'ArrowRight') {
    if (activeTile === 4) return

    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.remove('active-tile')
    activeTile += 1
    document.getElementById(`row-${currentGuess - 1}-tile-${activeTile}`).classList.add('active-tile')
  }
})
