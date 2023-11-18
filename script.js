/*
- Títol del joc i una xicoteta explicació que consisteix.
- Indiquem el nivell en el qual ens trobem.
- Boton start.
- Primer juga la màquina (espera un temps).
- Després juga l'usuari (espera un temps).
- Iniciar el joc amb 4 colors (roig, groc, verd i blau).
- Nivell 1 – Un color.
- Anem incrementant la dificultat conforme pugem de nivell.
- Els jugadors no podran fer clic mentre la màquina reprodueix el patró.
- Quan marquem el color el ressaltem.
- Mostrar errors en roig.
- Incrementem la dificultat del joc:
Si arriba a la ronda 10 augmentem la velocitat del patró.
Si arriba a la ronda 15 afegim dos colors nous.
Si arriba a la ronda 20 afegim altres dues.
Guardar informació en localstorage i json-server, per mostrar informes i rànkings.
*/

const level = 4;
let board = [];
const startButton = document.querySelector('#startGame')
const stopButton = document.querySelector('#stopGame')
const boardElement = document.querySelector(".board");

let cpuThrow = []
let playerThrow = []
let endGame = false;


createBoard(level);

startButton.addEventListener('click', e => {
  startGame(level)
})
stopButton.addEventListener('click', e => {
  console.log("Game stopped")
  window.location.reload()
})

const cellElements = document.querySelectorAll(".cell");

async function startGame(level) {
  console.log("ejecutando el turno la cpu.....")
  await cpu2(level)
  player(level)
  console.log("la cpu ha termiando, turno del jugador...")
}

function createBoard(cells) {
  board = Array(cells).fill(4);

  board.forEach((_, index) => {
    board[index] = index + 1;
    const div = document.createElement("div");
    div.className = "cell";
    div.classList.add('no-click')
    div.id = index;
    const span = document.createElement("span");
    span.className = "cell_content";
    span.textContent = index;
    boardElement.appendChild(div);
    div.appendChild(span);
    div.addEventListener("click", () => {
      console.log(span.textContent);
    });
  });
}

// Función obtenemos un numero random según el nivel del juego
function randomNumber(level) {
  return Math.floor(Math.random() * level);
}

// Obtenemos un array de tirada de la cpu segun el nivel del juego
function randomThrow(level) {
  // const cpuThrow = Array(level).fill("")
  // cpuThrow.forEach((_,index) => {
  //   cpuThrow[index] = randomNumber(level)
  // })
  cpuThrow = Array.from({ length: level }, () => randomNumber(level)); 
  return cpuThrow;
}

// Representar secuencia en el tablero de juego

function cpu(level) {
  cpuThrow = randomThrow(level);
  console.log(cpuThrow);
  const celdas = document.querySelectorAll(".cell");
  const array = Array.from(celdas).map((celda) => parseInt(celda.id, 10));
  for (let i = 0; i < array.length; i++) {
    setTimeout(() => {
      if (cpuThrow[i] === 0) {
        celdas[0].style.backgroundColor = "green";
        setTimeout(() => {
          celdas[0].style.backgroundColor = "white";
        }, 500);    
      } else if (cpuThrow[i] === 1) {
        celdas[1].style.backgroundColor = "red";
        setTimeout(() => {
          celdas[1].style.backgroundColor = "white";
        }, 500);
      } else if (cpuThrow[i] === 2) {
        celdas[2].style.backgroundColor = "yellow";
        setTimeout(() => {
          celdas[2].style.backgroundColor = "white";
        }, 500);
      } else if (cpuThrow[i] === 3) {
        celdas[3].style.backgroundColor = "blue";
        setTimeout(() => {
          celdas[3].style.backgroundColor = "white";
        }, 500);
      }
    }, i * 1500);
  }
}

function player(level) {
  const cellElements = document.querySelectorAll('.cell')
  if(playerThrow.length !== level && !endGame) {
    cellElements.forEach((cell) => {
      cell.classList.remove('no-click')
      cell.addEventListener('click', () => {
        playerThrow.push(parseInt(cell.id,10));
      
        check(cpuThrow, playerThrow)
        console.log(cpuThrow, playerThrow)

        if (playerThrow.length === level) {
          console.log('array lleno')
          cellElements.forEach(cell => {
          cell.classList.add('no-click')
          })
        }
      })
    })
  }
}

function check (cpu, player) {
  for (index = 0; index < playerThrow.length; index++) {
    if (player[index] !== cpu[index]) {
      endGame = true
      return false
    } else {
      console.log(`Index jugador: ${player[index]} - Index CPU ${cpu[index]}`)
    }
  }
  return true
}


// proves amb funcions asincrones................................................................

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function highlightCell (cell, color, delayColor){
  return new Promise(resolve => {
    cell.style.backgroundColor = color
    setTimeout(() => {
      cell.style.backgroundColor = 'white'
      resolve();
    }, delayColor)
  })
}

async function cpu2(level) {
  const cpuThrow = randomThrow(level)
  const cells = document.querySelectorAll('.cell')
  for (let i = 0; i < cells.length; i++) {
    console.log(`iteracion${i}`)
    await delay(1000)
    if (cpuThrow[i] === 0) {
      console.log('verde')
      await highlightCell (cells[0], "green", 500)
    } else if (cpuThrow[i] === 1) {
      console.log('rojo')
      await highlightCell (cells[1], "red", 400)
    } else if (cpuThrow[i] === 2) {
      console.log('amarillo')
      await highlightCell (cells[2], "yellow", 400)
    } else if (cpuThrow[i] === 3) {
      console.log('azul')
      await highlightCell (cells[3], "blue", 400)
    }
  }
  console.log('termianda la funcion cpu2', cpuThrow)
}

