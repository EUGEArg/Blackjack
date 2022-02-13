const miModulo = (() => {
  "use strict";

  let deck     = [];
  const tipos  = ["C", "D", "H", "S"],
    especiales = ["A", "J", "Q", "K"];

  let puntosJugadores = [];

  // Referencias del HTML
  const bntPedir = document.querySelector("#btn-Pedir"),
    bntDetener = document.querySelector("#btn-Detener"),
    bntNuevo = document.querySelector("#btn-Nuevo");

  const divCartasJugadores = document.querySelectorAll(".div-cartas");

  const puntosHTML = document.querySelectorAll("small");

  const mjeUsuario = document.getElementById("mjeUsuario");

  //Esta función inicia el juego
  const iniciarJuego = (numJugadores = 2) => {
    deck = crearDeck();

    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++) {
      puntosJugadores.push(0);
    }

    puntosHTML.forEach((elem) => (elem.innerText = 0));
    divCartasJugadores.forEach((elem) => (elem.innerHTML = ""));

    bntPedir.disabled = false; // Botones habilitados
    bntDetener.disabled = false;
  };

  // Esta función crea un nuevo deck
  const crearDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }

    for (let tipo of tipos) {
      for (let esp of especiales) {
        deck.push(esp + tipo);
      }
    }

    return _.shuffle(deck);
  };

  //Esta función me permite tomar una carta
  const pedirCarta = () => {
    if (deck.length === 0) {
      throw "No hay cartas en el deck";
    }

    return deck.pop();
  };

  //Esta función sirve para obtener el valor de la carta
    const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
  };

  //  Turno: 0 es el primer jugador;Último jugador es la computadora
    const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    puntosHTML[turno].innerHTML = puntosJugadores[turno];
    return puntosJugadores[turno];
  };

  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement("img");
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.classList.add("carta");
    divCartasJugadores[turno].append(imgCarta);
  };


  //Función para determinar quien gana
  const ganadorJuego = () => {
    const [puntosMinimos, puntosComputadora] = puntosJugadores;

    setTimeout(() => {
      if (puntosComputadora === puntosMinimos) {
        mjeUsuario.innerHTML = `<p> ${"EMPATE"}</p>`;
      } else if (puntosMinimos > 21) {
        mjeUsuario.innerHTML = `<p> ${"CRUPIER GANA"}</p>`;
      } else if (puntosComputadora > 21) {
        mjeUsuario.innerHTML = `<p> ${"FELICIDADES, GANASTE!!!"}</p>`;
      } else {
        mjeUsuario.innerHTML = `<p> ${"CRUPIER GANA"}</p>`;
      }
    }, 100);
  };

  // turno de la computadora
  const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;

    do {
      const carta = pedirCarta();
      puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
      crearCarta(carta, puntosJugadores.length - 1);
    } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

    ganadorJuego();
  };

  //Eventos
  bntPedir.addEventListener("click", () => {
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta, 0);
    crearCarta(carta, 0);

    if (puntosJugador > 21) {
      bntPedir.disabled = true; //deshabilito botones, ya no se puede jugar
      bntDetener.disabled = true;
      turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
      bntPedir.disabled = true;
      bntDetener.disabled = true;
      turnoComputadora(puntosJugador);
    }
  });

  bntDetener.addEventListener("click", () => {
    bntPedir.disabled = true;
    bntDetener.disabled = true;

    turnoComputadora(puntosJugadores[0]);
  });

  //Iniciar Juego
  bntNuevo.addEventListener("click", () => {
    mjeUsuario.innerHTML = "";

    iniciarJuego();
  });

  return {
    nuevoJuego: iniciarJuego,
  };
})();
