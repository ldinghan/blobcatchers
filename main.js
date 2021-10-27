const cells =  Array.from(document.querySelectorAll('.cell'));
const targetCells = cells.slice(0,30);
const playerCells = cells.slice(30);
const healthDisplay = document.querySelector('.health');
const timer = document.querySelector('.timer');

var min = 0;
var sec = 0;
var stoptime = true;
var arr = ['small','medium','big'];

let dropCount, speed, health;

document.addEventListener("keydown", e => {
	if (e.keyCode == 32 && !dropCount) {
		startGame();
	}
	const player = document.querySelector('.player');
	if (e.key === 'ArrowRight' && playerCells.includes(player.parentElement.nextElementSibling)) {
		player.parentElement.nextElementSibling.appendChild(player);
	}
	if (e.key === 'ArrowLeft' && playerCells.includes(player.parentElement.previousElementSibling)) {
		player.parentElement.previousElementSibling.appendChild(player);
	}
});

function startTimer() {
	if (stoptime == true) {
		stoptime = false;
		timerCycle();
	}
}

function stopTimer() {
	if (stoptime == false) {
		stoptime = true;
	}
}

function timerCycle() {
	if (stoptime == false) {
		sec = parseInt(sec);
		min = parseInt(min);
		sec++;
		if (sec == 60) {
			min++;
			sec = 0;
		}
		if (sec < 10 || sec == 0) {
			sec = '0' + sec;
		}
		if (min == 0) {
			min = '0'
		}
		timer.innerHTML = min + ':' + sec;
		setTimeout('timerCycle()',1000);
	}
}

function resetTimer() {
	sec = 0;
	min = 0;
	timer.innerHTML = "00:00"
}

function reset(){
	healthDisplay.innerHTML = '100';
	cells.forEach(cell => cell.innerHTML = '');
	const playerPosition = Math.floor(Math.random() * 6);
	playerCells[playerPosition].innerHTML = '<div class="player"></div>';
	if (sessionStorage.getItem('highscore')) {
		highscoremin = Math.floor(sessionStorage.getItem('highscore')/60);
		highscoresec = sessionStorage.getItem('highscore') %60;
		document.querySelector('.highscore').innerHTML = highscoremin + 'min' + highscoresec + 'sec';
	} else {
		document.querySelector('.highscore').innerHTML = 'GO MAKE A NEW HIGHSCORE';
	}
	health = 100;
	speed = 1000;
	dropCount = 0;
	resetTimer();
}

function startGame() {
	reset();
	startTimer();
	loop();
}

function loop() {
	var randomSize = arr[Math.floor(Math.random() * arr.length)];
	let stopGame = false;
	for (let i = targetCells.length - 1; i >= 0; i--) {
		const cell = targetCells[i];
		const nextCell = cells[i+6];
		const target = cell.children[0];

		if (!target) {
			continue;
		}
		nextCell.appendChild(target);

		if (playerCells.includes(nextCell)) {
			if (nextCell.querySelector('.player')) {
				if (nextCell.querySelector('.big')) {
					health+=3;
				}
				if (nextCell.querySelector('.medium')) {
					health+=2;
				}
				if (nextCell.querySelector('.small')) {
					health+=1;
				}
				healthDisplay.style.color="green";
				target.remove();
			} else {
				if (nextCell.querySelector('.big')) {
					health-=1;
				}
				if (nextCell.querySelector('.medium')) {
					health-=2;
				}
				if (nextCell.querySelector('.small')) {
					health-=3;
				}
				healthDisplay.style.color="red";
				target.remove();
			}
		}
	}
	const dropRandom = Math.floor(Math.random() * 3);
	if (dropCount % dropRandom === 0) {
		const position = Math.floor(Math.random() * 6);
		targetCells[position].innerHTML = '<div class="target ' + randomSize + '"></div>';
	}
	if (health < 0) {
		stopGame = true;
	}
	if (stopGame) {
		stopTimer();
		currentscore = min*60 + sec;
		if (currentscore > sessionStorage.getItem('highscore')) {
			sessionStorage.setItem('highscore', currentscore);
		}
		alert('You lose! You stayed alive for ' + min + 'min' + sec + 'sec');
		reset();
	} else {
		dropCount++;
		healthDisplay.innerHTML = health;
		speed = Math.max(150, speed - 50);
		setTimeout(loop,speed);
	}
}
