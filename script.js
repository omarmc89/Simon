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
let level = 1;
let board = [];
let cpuThrow = []
let playerThrow = []
let endGame = false;
let gameStarted = false;
let games = 1;
let playerName = ""
const firstBoard = 4
const startButton = document.querySelector('#startGame')
const stopButton = document.querySelector('#stopGame')
const boardElement = document.querySelector(".board");
const message = document.querySelector('.mainMessage')
const btn = document.querySelector('.mainBtn')
const score = document.querySelector('.currentScore')
const throwOk = document.querySelector('.throwOk')
const inputPlayerName = document.querySelector('#playerName')
const tbody = document.getElementById('tbody')
const sound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3")
const startSound = new Audio ("https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg")

//iniciar el json server en el puerto 3000 y con el archivo db.json.

// funcion para añadir el usuario y en caso de que ya exista añada la puntuación.
async function addPlayerScore (player, score) {
  const headers = {"Content-Type": "application/json"}
  const res = await fetch(`http://localhost:3000/players?name=${player}`)
  const playerData = await res.json()
  if (Object.keys(playerData).length === 0 ) {
    const dataToInsert = {"name":player, "scores":[score], "avatar": `https://api.multiavatar.com/${player}.png`
    }
    const response = await fetch(`http://localhost:3000/players`, {method:"POST", headers: headers, body: JSON.stringify(dataToInsert)})
    await console.log(response)
  } else {
    const id = playerData[0].id
    const playerScores = Array.from(playerData[0].scores)
    playerScores.push(score)
    const dataToUpdate = {"name": player, "scores":playerScores, "avatar":playerData[0].avatar}
    const options = {
      method: "PUT",
      headers : {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToUpdate)
    }
    const response = await fetch(`http://localhost:3000/players/${id}`, options)
    await console.log(response)
  }
}

//Fetch para crear la tabla del ranking con los datoa de la bd
fetch ("http://localhost:3000/players")
.then (res => res.json())
.then (json => {
  json.map(data => {
    tbody.append(table(data.name, data.avatar, data.scores)) 
  })
})
//Funcion para añadir cada linea de la tabla 
function table (name, avatar, scores) {
  let tr = document.createElement('tr')
  tr.innerHTML = `
  <td data-label="Job Title">
    <img alt="..." src="${avatar}"
    class="w-25 avatar avatar-sm rounded-circle me-2">
  </td>
  <td data-label="Email">
    <span>${name}</span>
  </td>
  <td data-label="Phone">
    <span>${Math.max(...scores)}</span>
  </td>`
  return tr
}
//Creamos el tablero con los 4 colores
createBoard(4);

//Definimos el boton para empezar la partida
startButton.addEventListener('click', async () => {
  playerName = inputPlayerName.value
  console.log(playerName)
  if (playerName === '') {
    document.querySelector('.nameWarning').classList.remove('no-visible')
  } else {
    if (!gameStarted){
    startSound.volume = 0.2
    startSound.play()
    document.querySelector('.nameWarning').classList.add('no-visible')
    await delay(4000)
    startGame(level)
    gameStarted = true
    } else {
      console.log("juego ya inciado")
    }
  }
})

//Boton stop para cancelar y recargar la pagina
stopButton.addEventListener('click', () => {
  console.log("Game stopped")
  window.location.reload()
})

const cellElements = document.querySelectorAll(".cell");

// inicio de la tirada de la cpu y correspondiente espera para la tirada del jugador
async function startGame(level) {
  console.log("Turno CPU....")
  await cpu2(level, playingCells, levelDelay)
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
    score.innerText = level;
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
    sound.play()
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

//Función que se encarga de que cada vez que se finalice el turno con éxito actualice
//variables y aplique un delay hasta el inico de la nueva ronda.
async function newThrow() {
  level ++
  console.log("bloqueando casillas")
  addNoClickClass()
  console.log('aplicando delay')
  await delay(3000)
  score.innerText = level
  throwOk.style.visibility = 'hidden'
  if (level >= 2) {
    decreaseDelay(level)
  }
  manageLevel(level)
  startGame(level)
}

//Añadimos casillas segun el nivel
function addCells(start, numberCells) {
  console.log('Añadiendo dos casillas más')
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
  } else if (level === 15) {
    playingCells = 6
    addCells(4,2)
    boardToModify.style.gridTemplateColumns = `repeat(3, 1fr)`
  } else if (level === 20) {
    playingCells = 8
    addCells(6,2)
    boardToModify.style.gridTemplateColumns = `repeat(4, 1fr)`
  }
}

// Reducimos el delay entre resalto de casilla en el turno de la cpu
function decreaseDelay(currentLevel) {
  if (currentLevel > 5) {
    levelDelay = 500
  } else if (currentLevel > 10) {
    levelDelay = 400
  } else if (currentLevel > 20){
    levelDelay = 300
  }
}

//Comprobamos que la tirada del jugador sea igual a la de la cpu, elmento a elemento
function checkThrow (cpu, player) {
  for (let element = 0; element < player.length; element++) {
    console.log(element)
    console.log(`CPU: ${cpu[element]} - PLAYER: ${player[element]}`)
    if (cpu[element] !== player[element]) {
      // console.log("fail")
      // showMainMessage()
      endGameFunction()
      endGame = true
      return false
    }
  }
  console.log("ok")
  return true
}

//Función encargada de parar la partida y mostrar mensaje de fallo al equivocarse de color
function endGameFunction () {
  startButton.style.visibility = 'hidden'
  stopButton.innerText = 'Reiniciar'
  cellElements.forEach((cell) => {
    cell.classList.add('no-click')
  })
  showMainMessage()
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

//Función para mostrar el letrero de fallo y actualizar la bd con el resultado de la partida.
function showMainMessage () {
  const message = document.querySelector('.mainMessage')
  const btn = document.querySelector('.mainBtn')
  const totalGamesPlayed = document.createElement('h2')
  totalGamesPlayed.innerText = `Has llegado al nivel ${level}. Vuelve a intentarlo!`
  message.append(totalGamesPlayed)
  message.style.visibility = 'visible'
  btn.addEventListener('click', () => {
    message.style.visibility = 'hidden'
    addPlayerScore(playerName, level)
  })
}

//Función para añadir la clase "no-click" a las celdas.
function addNoClickClass () {
  const cells = document.querySelectorAll('.cell')
  cells.forEach((cell) => {
    cell.classList.add('no-click')
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
    sound.play()
    setTimeout(() => {
      cell.style.backgroundColor = firstColor
      resolve();
    }, delayColor)
  })
}


// Funcion asincrona para añadir delay entre iteraciones.
//De esta manera podremos manipular el nivel de dificultad.
async function cpu2(level, playingCells, currentLevelDelay) {
    // cpuThrow = randomThrow(level, playingCells)
    cpuThrow.push(randomNumber(playingCells))
    console.log(`tirada cpu: ${cpuThrow}`)
    const cells = document.querySelectorAll('.cell')
    for (let i = 0; i < cpuThrow.length; i++) {
      console.log(`iteracion${i}`)
      await delay(levelDelay)
      if (cpuThrow[i] === 0) {
        console.log('verde')
        await highlightCell (cells[0], "#67f73b", currentLevelDelay)
        continue
      } else if (cpuThrow[i] === 1) {
        console.log('rojo')
        await highlightCell (cells[1], "#f75752", currentLevelDelay)
        continue
      } else if (cpuThrow[i] === 2) {
        console.log('amarillo')
        await highlightCell (cells[2], "#fae92f", currentLevelDelay)
        continue
      } else if (cpuThrow[i] === 3) {
        console.log('azul')
        await highlightCell (cells[3], "#3646f5", currentLevelDelay)
        continue
      }else if (cpuThrow[i] === 4) {
        console.log('rojo')
        await highlightCell (cells[4], "#946ff2", currentLevelDelay)
        continue
      } else if (cpuThrow[i] === 5) {
        console.log('amarillo')
        await highlightCell (cells[5], "#ffa808", currentLevelDelay)
        continue
      } else if (cpuThrow[i] === 6) {
        console.log('azul')
        await highlightCell (cells[6], "#ff08c0", currentLevelDelay)
        continue
      } else if (cpuThrow[i] === 7) {
        console.log('rojo')
        await highlightCell (cells[7], "#31feff", currentLevelDelay)
        continue
      }
    }
    console.log('termianda la funcion cpu2', cpuThrow)
}



