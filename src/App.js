import React, { Component } from 'react';
import './App.css';

// este es un componente definido como una función
// que recibe un objeto de props
function Square(props) {
	return (
		// la función onClick sigue el patrón DDAU
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends Component {
	// la función renderSquare recibe un valor y lo pasa al componente Square
	renderSquare(i) {
		return (
			<Square
				// le pasa un valor que guarda en la propiedad value
				value={this.props.squares[i]}
				//y pasa la función (DDAU)
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	// la función render "pinta" el tablero con el conjunto de componentes Square
	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends Component {
	// en la función constructor se define el state
	constructor(props) {
		super(props);
		// se inicializan todos los valores guardados en el state
		this.state = {
			history: [
				{
					squares: Array(9).fill(null)
				}
			],
			stepNumber: 0,
			xIsNext: true
		};
	}

	// la función handleClick se encarga de actualizar el historial de movimientos,
	// de actualizar quién tirará en el siguiente turno y el valor de cada casilla
	// en el tablero
	handleClick(i) {
		// con x.slice() se hace una copia x, permitiendo hacer modificaciones sin
		// cambiar el valor de x original
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		// aquí se llama la función calculateWinner para saber cuándo detener el juego
		// también se toma en consideración si la casilla ya tiene un valor
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		// en caso de que no haya un ganador o la casilla esté vacía se actualizan
		// las propiedades del state
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	// esta función sirve para cambiar de jugadas en el juego
	jumpTo(step) {
		this.setState({
			// se actualiza la jugada en la que se encuentra
			stepNumber: step,
			// y se actualiza el siguiente turno
			xIsNext: (step % 2) === 0
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		// por cada jugada se crea un botón que permite ir a esa jugada
		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move :
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		// con esta condicional se cambia el valor de status
		let status;
		// si hay un ganador se muestra su nombre
		if (winner) {
			status = "Winner: " + winner;
		} else {
			// si no ha ganado nadie, entonces se muestra quién tira el siguiente turno
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					{/* aquí se renderea el componente Board */}
					<Board
						squares={current.squares}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					{/* aquí se muestran las variables antes definidas */}
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	// esta función guarda un arreglo de las posibles formas en las que 
	// un jugador puede ganar
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	// si en el estado del tablero se encuentra alguna de las combinaciones antes
	// descritas el juego se acaba y hay un ganador
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	// si no hay un ganador, el juego continua
	return null;
}

// aquí se exporta la clase Game
export default Game;