const container = document.querySelector('.board__boxes');

const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');

const boardPlayer0 = document.querySelector('.board__player-0');
const boardPlayer1 = document.querySelector('.board__player-1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

function matrix() {
	let k = 0,
		a = [];
	for (let i = 0; i < 10; i++) {
		if (i % 2 != 0) {
			for (let j = 0; j < 10; j++, k++) {
				a[k] = parseInt('' + i + j) + 1;
			}
		} else {
			for (let j = 9; j >= 0; j--, k++) {
				a[k] = parseInt('' + i + j) + 1;
			}
		}
	}
	k = 99;
	while (k >= 0) {
		createBox(a[k]);
		k--;
	}
	function createBox(i) {
		const div = document.createElement('div');
		const text = document.createTextNode(i);
		div.classList.add(`board__box-${i}`);
		div.appendChild(text);
		container.appendChild(div);
	}
}

let snakes = [];
let ladders = [];

function snakesnladders() {
	for (let i = 0; i < 9; i++) {
		snakes[i] = new Array(2);
		ladders[i] = new Array(2);
	}
	snakes[0][0] = 84;
	snakes[0][1] = 40;
	snakes[1][0] = 56;
	snakes[1][1] = 4;
	snakes[2][0] = 85;
	snakes[2][1] = 7;
	snakes[3][0] = 95;
	snakes[3][1] = 10;
	snakes[4][0] = 93;
	snakes[4][1] = 50;
	snakes[5][0] = 24;
	snakes[5][1] = 6;
	snakes[6][0] = 61;
	snakes[6][1] = 23;
	snakes[7][0] = 33;
	snakes[7][1] = 17;

	ladders[0][0] = 21;
	ladders[0][1] = 80;
	ladders[1][0] = 3;
	ladders[1][1] = 57;
	ladders[2][0] = 64;
	ladders[2][1] = 99;
	ladders[3][0] = 25;
	ladders[3][1] = 75;
	ladders[4][0] = 29;
	ladders[4][1] = 94;
	ladders[5][0] = 58;
	ladders[5][1] = 79;
	ladders[6][0] = 8;
	ladders[6][1] = 28;
	ladders[7][0] = 49;
	ladders[7][1] = 70;
	ladders[8][0] = 90;
	ladders[8][1] = 92;
}
let score, currentScore, activePlayer, playing, sixes, isOpen;

const init = function () {
	score = [0, 0];
	activePlayer = 0;
	playing = true;
	sixes = 0;
	isOpen = [false, false];
	score0El.textContent = 0;
	score1El.textContent = 0;
	matrix();
	snakesnladders();

	diceEl.classList.add('hidden');
	player0El.classList.remove('player--winner');
	player1El.classList.remove('player--winner');
	player0El.classList.add('player--active');
	player1El.classList.remove('player--active');
};
init();

const switchPlayer = function () {
	activePlayer = activePlayer === 0 ? 1 : 0;
	player0El.classList.toggle('player--active');
	player1El.classList.toggle('player--active');
};

btnRoll.addEventListener('click', function () {
	if (playing) {
		let dice = Math.trunc(Math.random() * 6) + 1;
		diceEl.classList.remove('hidden');
		diceEl.src = `./assets/dice-${dice}.png`;
		if (dice === 6) {
			sixes++;
			isOpen[activePlayer] = true;
			if (score[activePlayer] === 0) dice = 1;
		} else {
			sixes = 0;
		}

		if (sixes === 3) {
			if (score[activePlayer] > 12) {
				score[activePlayer] -= 12;
			} else {
				score[activePlayer] = 1;
			}
			dice = 0;
			sixes = 0;
			jumpTo(score[activePlayer]);
		}
		if (score[activePlayer] + dice > 100) {
			dice = 0;
			sixes = 0;
		}

		if (!isOpen[activePlayer]) {
			switchPlayer();
			return;
		}
		playing = false;
		score[activePlayer] += dice;

		if (score[activePlayer] > 100) {
			score[activePlayer] -= dice;
			dice = 0;
		}
		if (activePlayer === 0) {
			score0El.textContent = score[0];
		} else {
			score1El.textContent = score[1];
		}
		if (score[activePlayer] !== 0 && score[activePlayer] <= 100) move(score[activePlayer], dice);
		let jump = false;
		for (let index = 0; index < 8; index++) {
			if (score[activePlayer] === ladders[index][0]) {
				score[activePlayer] = ladders[index][1];
				jump = true;
			}
			if (score[activePlayer] === snakes[index][0]) {
				score[activePlayer] = snakes[index][1];
				jump = true;
			}
		}
		setTimeout(() => {
			if (jump === true) {
				jumpTo(score[activePlayer]);
			}
			if (sixes === 0) switchPlayer();
			playing = true;
		}, 500 * (dice + 1));
	}
	if (score[activePlayer] === 100) {
		setTimeout(() => {
			playing = false;
			diceEl.classList.add('hidden');
		}, 2000);
		document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
		document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
	}
});
function move(to, steps) {
	let i = to - steps + 1;
	setInterval(function () {
		if (i <= to) {
			const current = document.querySelector(`.board__box-${i}`);
			current.appendChild(eval(`boardPlayer${activePlayer}`));
			if (score[activePlayer] - steps === 0) {
				eval(`boardPlayer${activePlayer}`).style.left = '7%';
				eval(`boardPlayer${activePlayer}`).style.bottom = '6%';
			}
			i++;
		} else return;
	}, 500);
}

function jumpTo(to) {
	const current = document.querySelector(`.board__box-${to}`);
	current.appendChild(eval(`boardPlayer${activePlayer}`));
	if (activePlayer === 0) {
		score0El.textContent = to;
	} else {
		score1El.textContent = to;
	}
}
