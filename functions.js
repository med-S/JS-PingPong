const canvas = document.getElementById("pong");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const context = canvas.getContext("2d");


// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

//Draw Functions
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h); // (X from the left, Y from the top, width, height)
}

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false); // (X from the left, Y from the top, radius, start Angle, end Angle, direction'false==clock wires direction')
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "50px fantasy";
    context.fillText(text, x, y);
}

//Create User and Computer Paddles
const user = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "white",
    score: 0
}
const com = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "white",
    score: 0
}

//Create and Draw The Dashed Line in the middle
const net = {
    x: (canvas.width / 2) - (2 / 2),
    y: 0,
    width: 2,
    height: 10,
    color: "white",
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 13) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//Create the ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    raduis: 10,
    speed: 5,
    velocityX: 5, //velocity = speed + direction
    velocityY: 5,
    color: "white"
};

//draw the game's different parts
drawRect(0, 0, canvas.width, canvas.height, "black");
drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, "white");
drawNet();
drawRect(user.x, user.y, user.width, user.height, user.color);
drawRect(com.x, 100, com.width, com.height, com.color);
drawCircle(ball.x, ball.y, ball.raduis, ball.color);

//drawing function for updates
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "black");
    drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5, "white");
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawCircle(ball.x, ball.y, ball.raduis, ball.color);
}

//Control the user's paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(event) {
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
}

function collision(b, p) {
    b.top = b.y - b.raduis;
    b.bottom = b.y + b.raduis;
    b.left = b.x - b.raduis;
    b.right = b.x + b.raduis;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

function update() { //Mov, Pos, Score (The Logic of the game)
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //Simple AI To Control The Computer Paddle (if computerLevel=1 we'll never be able to beat it)
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

    if (ball.y + ball.raduis > canvas.height || ball.y - ball.raduis < 0) {
        ball.velocityY = -ball.velocityY;
        wall.play();
    }

    let player = (ball.x < canvas.width / 2) ? user : com;

    if (collision(ball, player)) {
        hit.play();

        let collisionPoint = ball.y - (player.y + player.height / 2); //Where the ball hits the player paddle
        collisionPoint = collisionPoint / (player.height / 2);
        //Calculate the angle of reflexion
        let angle = collisionPoint * Math.PI / 4;
        //Calculate the direction X of the ball after hiting the paddle
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        //Change the velocity
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);
        //speed up when the ball hits a paddle
        ball.speed += 0.4;
    }
    //update the score
    if (ball.x - ball.raduis < 0) {
        com.score++;
        comScore.play();
        resetBall();
    } else if (ball.x + ball.raduis > canvas.width) {
        user.score++;
        userScore.play();
        resetBall();
    }
}

function game() {
    update();
    render();
}

function startGame(){
startBtn.addEventListener('click', function() {
    startBtn.style.display = "none";
    restartBtn.style.display = "block";
    setInterval(game, 1000 / 50); //Call the game 50 times per seconde

});
}

startGame();

restartBtn.addEventListener("click", function() {
    startGame();
});
