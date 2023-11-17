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

const boardElement = document.querySelector(".board");
const cellElements = document.querySelectorAll(".cell");

createBoard(level);

cpu();

function createBoard(cells) {
  board = Array(cells).fill(4);

  board.forEach((_, index) => {
    board[index] = index + 1;
    const div = document.createElement("div");
    div.className = "cell";
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

  const cpuThrow = Array.from({ length: level }, () => randomNumber(level));
  return cpuThrow;
}

// Representar secuencia en el tablero de juego

function cpu() {
  const cpuThrow = randomThrow(level);
  console.log(cpuThrow);
  const celdas = document.querySelectorAll(".cell");
  const array = Array.from(celdas).map((celda) => parseInt(celda.id, 10));
  console.log(array);

  for (let i = 0; i < array.length; i++) {
    setTimeout(() => {
      if (cpuThrow[i] === 0) {
        console.log(cpuThrow[i], 0);
        celdas[0].style.backgroundColor = "green";
        setTimeout(() => {
          celdas[0].style.backgroundColor = "white";
        }, 1000);    
      } else if (cpuThrow[i] === 1) {
        console.log(cpuThrow[i], 1);
        celdas[1].style.backgroundColor = "red";
        setTimeout(() => {
          celdas[1].style.backgroundColor = "white";
        }, 1000);
      } else if (cpuThrow[i] === 2) {
        console.log(cpuThrow[i], 2);
        celdas[2].style.backgroundColor = "yellow";
        setTimeout(() => {
          celdas[2].style.backgroundColor = "white";
        }, 1000);
      } else if (cpuThrow[i] === 3) {
        console.log(cpuThrow[i], 3);
        celdas[3].style.backgroundColor = "blue";
        setTimeout(() => {
          celdas[3].style.backgroundColor = "white";
        }, 1000);
      }
    }, i * 1000);
  }

  // array.forEach((_, i) => {
  //   setTimeout(() => {
  //     if (cpuThrow[i] === 0) {
  //       console.log(cpuThrow[i],0)
  //         celdas[0].style.backgroundColor = 'green'
  //         setTimeout(() => {
  //           celdas[0].style.backgroundColor = 'trasparent'
  //         }, 500);
  //     } else if (cpuThrow[i] === 1) {
  //       console.log(cpuThrow[i],1)
  //         celdas[1].style.backgroundColor = 'red'
  //         setTimeout(() => {
  //           celdas[1].style.backgroundColor = 'trasparent'
  //         }, 500);
  //     } else if (cpuThrow[i] === 2) {
  //       console.log(cpuThrow[i],2)
  //         celdas[2].style.backgroundColor = 'yellow'
  //         setTimeout(() => {
  //           celdas[2].style.backgroundColor = 'trasparent'
  //         }, 500);
  //     } else if (cpuThrow[i] === 3) {
  //       console.log(cpuThrow[i],3)
  //         celdas[3].style.backgroundColor = 'blue'
  //         setTimeout(() => {
  //           celdas[3].style.backgroundColor = 'trasparent'
  //         }, 500);
  //     }
  //   }, i * 500); // 1 segundo entre iteraciones del forEach
  // });
}
