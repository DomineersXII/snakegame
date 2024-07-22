const canvas = document.getElementById("backgroundGrid")! as HTMLCanvasElement
const canvasContext = canvas.getContext("2d")!
const CELL_SIZE = 25
const snake = {
    size: CELL_SIZE-2,
    x: canvas.width/2 - CELL_SIZE,
    y: canvas.height/2 - CELL_SIZE,
    length: 1,
}
const snakeHistory: [number, number][] = [] //tracks old positions of snake.
const apple = {
    size: CELL_SIZE-2,
    x: getRandomPosition()[0],
    y: getRandomPosition()[1],
}

let moveDirection = "right"

function getRandomPosition() {
    const randomX = Math.floor(Math.random() * (canvas.width / CELL_SIZE)) * CELL_SIZE
    const randomY = Math.floor(Math.random() * (canvas.height / CELL_SIZE)) * CELL_SIZE
    return [randomX, randomY]
}

function endGame() {
    clearInterval(connection) //disconnect the game loop
    alert("Game over, press OK to restart.")
    snake.x = canvas.width/2 - CELL_SIZE
    snake.y = canvas.height/2 - CELL_SIZE
    snake.length = 1
    moveDirection = "right"
    snakeHistory.length = 0 

    render()
    connection = setInterval(moveSnake, 200) //reconnect the game loop
}

function eatApple() {
    const position = getRandomPosition()
    apple.x = position[0]
    apple.y = position[1]
    snake.length++

    render()
}

function moveSnake() {
    snakeHistory.push([snake.x, snake.y])
    if (snakeHistory.length >= snake.length) {
        snakeHistory.shift()
    }
    
    if (moveDirection == "up") {
        snake.y -= CELL_SIZE
    } else if (moveDirection == "down") {
        snake.y += CELL_SIZE
    } else if (moveDirection == "right") {
        snake.x += CELL_SIZE
    } else if (moveDirection == "left") {
        snake.x -= CELL_SIZE
    }

    if (snake.y < 0 || snake.y > canvas.height - CELL_SIZE || snake.x > canvas.width - CELL_SIZE || snake.x < 0) { //crash into wall
        endGame()
    }

    for (let i = 0; i < snakeHistory.length; i++) { //crash into self
        if (snake.x === snakeHistory[i][0] && snake.y === snakeHistory[i][1]) {
            endGame()
            break
        }
    }

    render()
}

function render() {
    canvasContext.fillStyle = "black"
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    

    canvasContext.strokeStyle = "white"
    canvasContext.lineWidth = 1
    for (let i = 0; i <= canvas.width; i += CELL_SIZE) {
        canvasContext.moveTo(0, i)
        canvasContext.lineTo(canvas.width, i)
        canvasContext.stroke()
    }
    
    for (let i = 0; i <= canvas.height; i += CELL_SIZE) {
        canvasContext.moveTo(i, 0)
        canvasContext.lineTo(i, canvas.height)
        canvasContext.stroke()
    }
    
    canvasContext.fillStyle = "red"
    canvasContext.fillRect(apple.x+1, apple.y+1, apple.size, apple.size)
    canvasContext.fillStyle = "green"
    canvasContext.fillRect(snake.x+1, snake.y+1, snake.size, snake.size)

    for (let i = 0; i < snakeHistory.length; i++) {
        canvasContext.fillStyle = "green"
        canvasContext.fillRect(snakeHistory[i][0]+1, snakeHistory[i][1]+1, snake.size, snake.size)
    }

    if (snake.x === apple.x && snake.y === apple.y) {
        eatApple()
    }
}



window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (moveDirection != "down") {
                moveDirection = "up"
            }
            break
        case "ArrowDown":
            if (moveDirection != "up") {
                moveDirection = "down"
            }
            break
        case "ArrowLeft":
            if (moveDirection != "right") {
                moveDirection = "left"
            }
            break
        case "ArrowRight":
            if (moveDirection != "left") {
                moveDirection = "right"
            }
            break
        default:
            break
    }
})

render()

let connection = setInterval(moveSnake, 200)