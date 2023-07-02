var keyPresses = [];
const arrowKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
var snakeBody = [];
const snakeWidth = 30;
const snakeHeight = 30;
const leftEdge = 0;
const rightEdge = 510;
const upEdge = 0;
const downEdge = 510;
var CURRENTDIRECTION = "DOWN";
const MOVEMENTINCREMENT = 30;
const GAMESPEED = 500;
var FOODARRAY = [];
var FOOD = {X: 0, Y: 0};
var SCORE = 0;
var RESTART = false;

document.addEventListener("keydown", (event) => {
				if (arrowKeys.includes(event.key)) {
					//console.log("Key was pressed " + event.key);
					keyPresses.push(event.key);
					}
				}, false);

function getInput() {
	if (keyPresses.length > 0) {
		let input = keyPresses.shift();
		switch (input) {
			case "ArrowDown":
				if (CURRENTDIRECTION != "UP")
					CURRENTDIRECTION = "DOWN";
				break;
			case "ArrowUp":
				if (CURRENTDIRECTION != "DOWN")
					CURRENTDIRECTION = "UP";
				break;
			case "ArrowLeft":
				if (CURRENTDIRECTION != "RIGHT")
					CURRENTDIRECTION = "LEFT";
				break;
			case "ArrowRight":
				if (CURRENTDIRECTION != "LEFT")
					CURRENTDIRECTION = "RIGHT";
				break;
		}
	}
}

async function gameBrain() {
	var ctx;
	SCORE = 0;
	RESTART = false;
	snakeBody.push({x: 30, y: 30});
	const canvas = document.getElementById("snakeScreen");
	if (canvas.getContext) {
		ctx = canvas.getContext("2d");
		//ctx.fillRect(25, 25, 30, 30);
		var i = 0;
		let isGameEnd = false;
		while (!checkSnakeSelfCollision() && !RESTART) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			if (touchesFood()) {
				//add new part to tail instead of head
				//console.log("food touched");
				console.log("current direction " + CURRENTDIRECTION);
				createFood();
				//getInput();
				growBody();
				updateScore();
			}
			getInput();
			moveSnake();
			
			ctx.fillStyle = "red";
			ctx.fillRect(FOOD.X, FOOD.Y, snakeWidth, snakeHeight);
			drawSnake(ctx);
				
			//console.log("Snake head location is " + snakeBody[0].x + " " + snakeBody[0].y);
			await new Promise(r => setTimeout(r, GAMESPEED));
		}
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.font = "48px serif";
	ctx.fillText("GAME OVER", 150, 250);
	//document.getElementById("startButton").disabled = false;
}

function updateScore() {
	SCORE += 50;
	//console.log("Score is " + SCORE);
	document.getElementById("scoreLabel").innerHTML = 'SCORE: ' + SCORE;
}

function growBody() {
	console.log("Snake body length is " + snakeBody.length);
	let part = {x: snakeBody[snakeBody.length - 1].x, y: snakeBody[snakeBody.length - 1].y};
	snakeBody.push(part);
}

function growBodyOriginal() {
	console.log("current direction " + CURRENTDIRECTION);
	let part = {x: 0, y: 0};
	if (snakeBody.length > 0) {
		part.x = snakeBody[0].x;
		part.y = snakeBody[0].y;
	}
	switch (CURRENTDIRECTION) {
		case "UP":
			part.y -= MOVEMENTINCREMENT;
			break;
		case "DOWN":
			//console.log("Moving down");
			part.y += MOVEMENTINCREMENT;
			break;
		case "LEFT":
			part.x -= MOVEMENTINCREMENT;
			break;
		case "RIGHT":
			part.x += MOVEMENTINCREMENT;
		break;
	}
	checkBoundaries(part);
	//checkSnakeCollision(part);
	snakeBody.unshift(part);
}

function touchesFood() {
	if (FOOD.X == snakeBody[0].x && FOOD.Y == snakeBody[0].y) {
		//console.log("returning true");
		return true;
	}
	//console.log("returning false");
	return false;
}

function drawSnake(ctx) {
	ctx.fillStyle = "black";
	snakeBody.forEach(b => {
		ctx.fillRect(b.x, b.y, snakeWidth, snakeHeight);
	});
}

function moveSnake() {
	let part = snakeBody.pop();
	if (snakeBody.length > 0) {
		part.x = snakeBody[0].x;
		part.y = snakeBody[0].y;
	}
	switch (CURRENTDIRECTION) {
		case "UP":
			part.y -= MOVEMENTINCREMENT;
			break;
		case "DOWN":
			//console.log("Moving down");
			part.y += MOVEMENTINCREMENT;
			break;
		case "LEFT":
			part.x -= MOVEMENTINCREMENT;
			break;
		case "RIGHT":
			part.x += MOVEMENTINCREMENT;
		break;
	}
	checkBoundaries(part);
	//checkSnakeCollision(part);
	snakeBody.unshift(part);
}

function checkBoundaries(part) {
	//let coord = {x: part.x, y: part.y};
	if (part.x < leftEdge) {
		part.x = rightEdge;
		CURRENTDIRECTION = "LEFT";
	} else if (part.x > rightEdge) {
		part.x = leftEdge;
		CURRENTDIRECTION = "RIGHT";
	} else if (part.y < upEdge) {
		part.y = downEdge;
		CURRENTDIRECTION = "UP";
	} else if (part.y > downEdge) {
		part.y = upEdge;
		CURRENTDIRECTION = "DOWN";
	}
}

function checkSnakeCollision(part) {
	for (let i = 0; i < snakeBody.length; i++) {
		if (snakeBody[i].x == part.x && snakeBody[i].y == part.y)
			return true;
	}
	return false;
}

function checkSnakeSelfCollision() {
	if (snakeBody.length > 1) {
		for (let i = 1; i < snakeBody.length; i++) {
			if (snakeBody[i].x == snakeBody[0].x && snakeBody[i].y == snakeBody[0].y)
				return true;
		}
	}
	return false;
}

function createFood() {
	let food;
	while (true) {
		food = FOODARRAY[getRandomInt(FOODARRAY.length)];
		if (!checkSnakeCollision(food)) 
			break;
	}
	FOOD.X = food.x;
	FOOD.Y = food.y;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function initializeFoodCoordinates() {
	for (let y = 0; y <= rightEdge; y += MOVEMENTINCREMENT ) {
		for (let x = 0; x <= rightEdge; x += MOVEMENTINCREMENT) {
			FOODARRAY.push({x: x, y: y});
		}
	}
}
//getInput();

async function startGame() {
	RESTART = true;
	await new Promise(r => setTimeout(r, GAMESPEED + 10));
	//document.getElementById("startButton").disabled = true;
	keyPresses = [];
	snakeBody = [];
	CURRENTDIRECTION = "DOWN";
	FOODARRAY = [];
	FOOD = {X: 0, Y: 0};
	SCORE = 0;
	initializeFoodCoordinates();
	createFood();
	gameBrain();
}
