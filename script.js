// Game Constants & Variables
let inputDir = {x: 0, y: 0};
const foodSound = new Audio('food_G1U6tlb.mp3');
const gameOverSound = new Audio('game_over.mp3');
const moveSound = new Audio('pow-90398.mp3');
const musicSound = new Audio('repeat-gaming-background-music-instrumental-218942.mp3');
let speed = 5;
let score = 0;
let final_time = 0;
let snakeArr = [{ x : 13, y : 15 }]; // origin of snake head
let food = {x: 6, y: 6};
let hiscoreval = 0;
let isGameOver = false; // Game over flag

// Game Functions
function main(current_time){
    window.requestAnimationFrame(main);
    if ((current_time - final_time) / 1000 < 1 / speed) {
        return;
    }
    final_time = current_time;
    gameEngine();
}

function isCollide(snake){
    // If snake bumps into itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If snake bumps into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine(){
   // Update the snake array & food
   if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause(); // Stop music on game over
        inputDir = {x: 0, y: 0};
        alert("Game Over. Press any key to Play again!");
        snakeArr = [{x: 13, y: 15}];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        isGameOver = true; // Set game-over flag
        return;
   }
   
   // If snake eats the food, increment the score and regenerate food
   if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        scoreBox.innerHTML = "Score: " + score;
        
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }

        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random())};
   }

   // Moving the snake
   for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = {...snakeArr[i]};
   }

   snakeArr[0].x += inputDir.x;
   snakeArr[0].y += inputDir.y;

   // Display the snake and food
   board.innerHTML = "";

   snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }

        board.appendChild(snakeElement);
   });

   // Display the food
   let foodElement = document.createElement('div');
   foodElement.style.gridRowStart = food.y;
   foodElement.style.gridColumnStart = food.x;
   foodElement.classList.add('food');
   board.appendChild(foodElement);
}

// Main logic starts here
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    // Start the game only if it's not in game-over state
    if (isGameOver) {
        musicSound.play(); // Start the music only after restarting
        isGameOver = false;
    }
    
    inputDir = { x: 0, y: 1 }; // Start the game movement
    moveSound.play();

    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        default:
            break;
    }
});

