document.addEventListener('DOMContentLoaded', () => {
    // the main grid
    const container = document.getElementById("grid");
    for(var i = 0; i < 200; i++){
        container.innerHTML +=  '<div>' + '</div>';
    }
    for(var i = 0; i < 10; i++){
        container.innerHTML +=  "<div id='taken' class='taken'>" + "</div>";
    }
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const width = 10;

    // next tetromino grid
    const nextContainer = document.getElementById("nextGrid");
    for(var i = 0; i < 16; i++){
        nextContainer.innerHTML +=  '<div>' + '</div>';
    }

    // extras
    const scoreDisplay = document.querySelector('#score');
    const startButton = document.querySelector('#startButton');
    let score = 0;
    let timer;
    const colors = [
        'orange', 'red', 'purple', 'green', 'blue',
    ];

    startButton.addEventListener('click', () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        } else {
            draw();
            timer = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrominos.length);
            nextTetromino();
        }
    })

    // Tetrominos
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [2, width+2, width*2+2, width*3+2],
        [width*2, width*2+1, width*2+2, width*2+3],
    ]
    const jTetromino = [
        [1, 2, width+1, width*2+1],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2, width*2+1],
        [width, width*2, width*2+1, width*2+2],
    ]
    const lTetromino = [
        [0, 1, width+1, width*2+1],
        [width, width+1, width+2, width*2],
        [1, width+1, width*2+1, width*2+2],
        [width+2, width*2, width*2+1, width*2+2],
    ]
    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
    ]
    const sTetromino = [
        [1, 2, width+0, width+1],
        [1, width+1, width+2, width*2+2],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
    ]
    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1],
    ]
    const zTetromino = [
        [0, 1, width+1, width+2],
        [2, width+1, width+2, width*2+1],
        [width, width+1, width*2+1, width*2+2],
        [1, width, width+1, width*2],
    ]
    const theTetrominos = [iTetromino, jTetromino, lTetromino, oTetromino, sTetromino, tTetromino, zTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    let randomTetromino = Math.floor(Math.random()*theTetrominos.length);
    let currentTetromino = theTetrominos[randomTetromino][currentRotation];
    let nextRandom = 0;
    
    // Draw puts the tetromino on the grid and undraw removes the tetromino from the grid
    function draw() {
        currentTetromino.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[randomTetromino]
        })
    }

    function undraw() {
        currentTetromino.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
    }

    // keyboard input functions
    function playerControl(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', playerControl)

    // Move tetrominos down every one second and keyboard commands to move tetrominos left, right, and down manually as well as rotating

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function moveLeft() {
        undraw();
        const leftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);
        if(!leftEdge) {
            currentPosition -=1
        }
        if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1;
        }
        draw();     
    }

    function moveRight() {
        undraw();
        const rightEdge = currentTetromino.some(index => (currentPosition + index) % width === width-1);
        if(!rightEdge) {
            currentPosition +=1
        }
        if(currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1;
        }
        draw();     
    }

    function rotate() {
        undraw();
        currentRotation ++;
        if (currentRotation === currentTetromino.length) {
            currentRotation = 0
        }
        currentTetromino = theTetrominos[random][currentRotation]
        draw();
    }

    // Tells the tetrominos when to stop
    function freeze() {
        if(currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // starts a new falling tetromino
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominos.length);
            currentTetromino = theTetrominos[random][currentRotation];
            currentPosition = 4;
            draw();
            nextTetromino();
            addScore();
            gameOver();
        }
    }

    // next tetromino display consts
    const nextSquares = document.querySelectorAll('.nextGrid div');
    const nextWidth = 4;
    let NextIndex = 0;
    
    // next teromino display shape
    const nextTetrominos = [
        [1, nextWidth+1, nextWidth*2+1, nextWidth*3+1],
        [1, 2, nextWidth+1, nextWidth*2+1],
        [0, 1, nextWidth+1, nextWidth*2+1],
        [0, 1, nextWidth, nextWidth+1],
        [1, 2, nextWidth+0, nextWidth+1],
        [1, nextWidth, nextWidth+1, nextWidth+2],
        [0, 1, nextWidth+1, nextWidth+2],
    ]

    // display the shape
    function nextTetromino() {
        nextSquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        nextTetrominos[nextRandom].forEach(index => {
            nextSquares[NextIndex + index].classList.add('tetromino')
            nextSquares[NextIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    function addScore() {
        for (i=0; i < 199; i+=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score +=10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = ''
                })
            const squaresRemove = squares.splice(i, width);
            squares = squaresRemove.concat(squares);
            squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over
    function gameOver() {
        if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end';
            clearInterval(timer);

        }
    }




})



