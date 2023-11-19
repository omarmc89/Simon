/*
- Títol del joc i una xicoteta explicació que consisteix. ✅
- Indiquem el nivell en el qual ens trobem. ✅
- Boton start. ✅
- Primer juga la màquina (espera un temps). ✅
- Després juga l'usuari (espera un temps). ✅
- Iniciar el joc amb 4 colors (roig, groc, verd i blau). ✅
- Nivell 1 – Un color.
- Anem incrementant la dificultat conforme pugem de nivell.
- Els jugadors no podran fer clic mentre la màquina reprodueix el patró. ✅
- Quan marquem el color el ressaltem. ✅
- Mostrar errors en roig.
- Incrementem la dificultat del joc:
Si arriba a la ronda 10 augmentem la velocitat del patró.
Si arriba a la ronda 15 afegim dos colors nous.
Si arriba a la ronda 20 afegim altres dues.
Guardar informació en localstorage i json-server, per mostrar informes i rànkings.
*/

let levelDelay = 1000
let playingCells = 4
let level = 14;
let board = [];
let cpuThrow = []
let playerThrow = []
let endGame = false;
let gameStarted = false;
let games = 1;
const firstBoard = 4
const startButton = document.querySelector('#startGame')
const stopButton = document.querySelector('#stopGame')
const boardElement = document.querySelector(".board");
const message = document.querySelector('.mainMessage')
const btn = document.querySelector('.mainBtn')
const score = document.querySelector('.currentScore')
const throwOk = document.querySelector('.throwOk')

createBoard(4);

startButton.addEventListener('click', e => {
  if (!gameStarted){
  startGame(level)
  gameStarted = true
  } else {
    console.log("juego ya inciado")
  }
})
stopButton.addEventListener('click', e => {
  console.log("Game stopped")
  window.location.reload()
})

const cellElements = document.querySelectorAll(".cell");

// inicio de la tirada de la cpu y correspondiente espera para la tirada del jugador
async function startGame(level) {
  console.log("Turno CPU....")
  await cpu2(level, playingCells)
  playerThrow = []
  console.log("la cpu ha termiando. Turno del jugador...")
  await player(cpuThrow)
}

//funcion para crear el trablero por primera vez
function createBoard(cells) {
  board = Array(cells).fill("");
  board.forEach((_, index) => {
    board[index] = index + 1;
    const div = document.createElement("div");
    div.className = "cell";
    div.classList.add('no-click')
    div.id = `cell-${index}`;
    div.dataset.id = index
    boardElement.appendChild(div);
    score.innerText = games;
  });
}

// Función obtenemos un numero random según el nivel del juego
function randomNumber(playingCells) {
  return Math.floor(Math.random() * playingCells);
}

// Obtenemos un array de tirada de la cpu segun el nivel del juego
function randomThrow(level, playingCells) {
  // const cpuThrow = Array(level).fill("")
  // cpuThrow.forEach((_,index) => {
  //   cpuThrow[index] = randomNumber(level)
  // })
  if (level <= 4) {
    cpuThrow = Array.from({length: level}, () => randomNumber(playingCells));
  } else if (level > 4 ) {
    cpuThrow = Array.from({length: playingCells}, () => randomNumber(playingCells));
  }
  console.log(cpuThrow);
  return cpuThrow;
}

// Representar secuencia en el tablero de juego
// function cpu(level) {
//   cpuThrow = randomThrow(level);
//   console.log(cpuThrow);
//   const celdas = document.querySelectorAll(".cell");
//   const array = Array.from(celdas).map((celda) => parseInt(celda.id, 10));
//   for (let i = 0; i < array.length; i++) {
//     setTimeout(() => {
//       if (cpuThrow[i] === 0) {
//         celdas[0].style.backgroundColor = "green";
//         setTimeout(() => {
//           celdas[0].style.backgroundColor = "white";
//         }, 500);    
//       } else if (cpuThrow[i] === 1) {
//         celdas[1].style.backgroundColor = "red";
//         setTimeout(() => {
//           celdas[1].style.backgroundColor = "white";
//         }, 500);
//       } else if (cpuThrow[i] === 2) {
//         celdas[2].style.backgroundColor = "yellow";
//         setTimeout(() => {
//           celdas[2].style.backgroundColor = "white";
//         }, 500);
//       } else if (cpuThrow[i] === 3) {
//         celdas[3].style.backgroundColor = "blue";
//         setTimeout(() => {
//           celdas[3].style.backgroundColor = "white";
//         }, 500);
//       }
//     }, i * 1500);
//   }
// }

// Gestionamos los clicks en las casillas correspondientes a la tirada del jugador
function player(cpuThrow) {
  const cellElements = document.querySelectorAll('.cell')
  const click = async (event) => {
    console.log(cpuThrow)
    playerThrow.push(parseInt(event.target.dataset.id,10))
    console.log(playerThrow)
    if (!checkThrow(cpuThrow, playerThrow)) {
      console.log("Seleccion incorrecta")
      return
    }
    if (checkLenghtArray(cpuThrow, playerThrow)) {
      cellElements.forEach(cell => {
        cell.removeEventListener('click', click)
      })
      throwOk.style.visibility = 'visible'
      newThrow()
      // btn.addEventListener('click', () => {
      //   message.style.visibility = 'hidden'
      //   startGame(level)
      // })
      // startGame(level)
    }
  }
  cellElements.forEach((cell) => {
    console.log('quitando class no click')
    cell.classList.remove('no-click')
    cell.addEventListener('click', click)
      // console.log(cpuThrow)
      // playerThrow.push(parseInt(cell.id,10))
      // console.log(playerThrow)
      // if (!checkThrow(cpuThrow, playerThrow)) {
      //   console.log("Seleccion incorrecta")
      //   return
      // }
      // if (checkLenghtArray(level, playerThrow)) {
      //   cellElements.forEach(cell => {
      //     cell.removeEventListener('click', () => {})
      //   })
      //   console.log('array completado con éxito')
      //   startGame(level)
      // }
    // })
  })
}

async function newThrow() {
  level ++
  score.innerText = level
  console.log('aplicando delay')
  await delay(3000)
  throwOk.style.visibility = 'hidden'
  if (level >= 10) {
    decreaseDelay(levelDelay)
  }
  manageLevel(level)
  startGame(level)
}

//Añadimos casillas segun el nivel
function addCells(start, numberCells) {
  for (let i = 0; i < numberCells; i++) {
    if (i === 0) {
      const div = document.createElement("div");
      div.className = "cell";
      div.classList.add('no-click')
      div.id = `cell-${start}`
      div.dataset.id = start
      boardElement.appendChild(div)
    } else if (i === 1) {
      const div = document.createElement("div");
      div.className = "cell";
      div.classList.add('no-click')
      div.id = `cell-${start + 1}`
      div.dataset.id = (start + 1)
      boardElement.appendChild(div);
    }
    
  }
}

// Gestionamos las casillas activas segun el nivel
function manageLevel(level) {
  const boardToModify = document.querySelector(".board");
  if (level > 4 && level < 15) {
    playingCells = 4
  } else if (level >= 15 && level < 20) {
    playingCells = 6
    addCells(4,2)
    boardToModify.style.gridTemplateColumns = `repeat(3, 1fr)`
  } else if (level >= 20) {
    playingCells = 8
    addCells(6,2)
    boardToModify.style.gridTemplateColumns = `repeat(4, 1fr)`
  }
}
// Reducimos el delay entre resalto de casilla en el turno de la cpu
function decreaseDelay(levelDelay) {
  if (levelDelay > 600 && levelDelay <= 1000) {
    levelDelay -= 50
  } else if (levelDelay > 400 && levelDelay <= 600) {
    levelDelay -= 25
  } else {
    levelDelay = 300
  }
}

//Comprobamos que la tirada del jugador sea igual a la de la cpu, elmento a elemento
function checkThrow (cpu, player) {
  for (let index = 0; index < player.length; index++) {
    console.log(`CPU: ${cpu[index]} - PLAYER: ${player[index]}`)
    if (cpu[index] == player[index]) {
      console.log("ok")
      return true
    } else {
      console.log("fail")
      showMainMessage()
      endGame = true
      return false
    }
  }
}

// Comprobamos que el array tiene el mismo tamaño al de la cpu
function checkLenghtArray (cpuThrow, player) {
  const elements = player.reduce((count) => count + 1, 0)
  if (elements == cpuThrow.length){
    endGame = true
    return true
  }
  return false
}

function showMainMessage () {
  const message = document.querySelector('.mainMessage')
  const btn = document.querySelector('.mainBtn')
  message.style.visibility = 'visible'
  btn.addEventListener('click', () => {
    message.style.visibility = 'hidden'
  })

}


// proves amb funcions asincrones................................................................

// Delay para manipular el nivel del juego
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

//funcion para resaltar las casillas activadas por la cpu
function highlightCell (cell, color, delayColor){
  const firstColor = cell.style.backgroundColor
  return new Promise(resolve => {
    cell.style.backgroundColor = color
    setTimeout(() => {
      cell.style.backgroundColor = firstColor
      resolve();
    }, delayColor)
  })
}


// Funcion asincrona para añadir delay entre iteraciones.
//De esta manera podremos manipular el nivel de dificultad.
async function cpu2(level, playingCells) {
    cpuThrow = randomThrow(level, playingCells)
    console.log(`tirada cpu: ${cpuThrow}`)
    const cells = document.querySelectorAll('.cell')
    for (let i = 0; i < cpuThrow.length; i++) {
      console.log(`iteracion${i}`)
      await delay(levelDelay)
      if (cpuThrow[i] === 0) {
        console.log('verde')
        await highlightCell (cells[0], "#67f73b", 1000)
        continue
      } else if (cpuThrow[i] === 1) {
        console.log('rojo')
        await highlightCell (cells[1], "#f75752", 1000)
        continue
      } else if (cpuThrow[i] === 2) {
        console.log('amarillo')
        await highlightCell (cells[2], "#fae92f", 1000)
        continue
      } else if (cpuThrow[i] === 3) {
        console.log('azul')
        await highlightCell (cells[3], "#3646f5", 1000)
        continue
      }else if (cpuThrow[i] === 4) {
        console.log('rojo')
        await highlightCell (cells[4], "#946ff2", 1000)
        continue
      } else if (cpuThrow[i] === 5) {
        console.log('amarillo')
        await highlightCell (cells[5], "#ffa808", 1000)
        continue
      } else if (cpuThrow[i] === 6) {
        console.log('azul')
        await highlightCell (cells[6], "#ff08c0", 1000)
        continue
      } else if (cpuThrow[i] === 7) {
        console.log('rojo')
        await highlightCell (cells[7], "#31feff", 1000)
        continue
      }
    }
    console.log('termianda la funcion cpu2', cpuThrow)
}

