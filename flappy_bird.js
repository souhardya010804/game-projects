class FlappyBird {
    constructor() {
        this.gameContainer = document.getElementById('game-container');
        this.bird = document.getElementById('bird');
        this.scoreElement = document.getElementById('score');
        this.startButton = document.getElementById('start-button');
        
        this.birdY = 300;
        this.birdVelocity = 0;
        this.gravity = 0.5;
        this.jumpForce = -10;
        this.pipes = [];
        this.pipeGap = 150;
        this.pipeInterval = 1500;
        this.score = 0;
        this.gameLoop = null;
        this.isGameRunning = false;

        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isGameRunning) {
                this.jump();
            }
        });
        
        this.gameContainer.addEventListener('click', () => {
            if (this.isGameRunning) {
                this.jump();
            }
        });

        this.bird.style.top = this.birdY + 'px';
    }

    startGame() {
        if (this.isGameRunning) return;
        
        this.resetGame();
        this.isGameRunning = true;
        this.startButton.style.display = 'none';
        this.gameLoop = setInterval(() => this.update(), 20);
        this.spawnPipes();
    }

    resetGame() {
        this.birdY = 300;
        this.birdVelocity = 0;
        this.score = 0;
        this.scoreElement.textContent = '0';
        this.pipes.forEach(pipe => pipe.remove());
        this.pipes = [];
    }

    update() {
        // Update bird position
        this.birdVelocity += this.gravity;
        this.birdY += this.birdVelocity;
        this.bird.style.top = this.birdY + 'px';
        this.bird.style.transform = rotate(${this.birdVelocity * 2}deg);

        // Check collisions
        if (this.checkCollision()) {
            this.gameOver();
            return;
        }

        // Update pipes
        this.updatePipes();
    }

    jump() {
        this.birdVelocity = this.jumpForce;
    }

    spawnPipes() {
        if (!this.isGameRunning) return;

        const pipeHeight = Math.random() * (400 - this.pipeGap) + 100;
        
        // Create top pipe
        const topPipe = document.createElement('div');
        topPipe.className = 'pipe';
        topPipe.style.height = pipeHeight + 'px';
        topPipe.style.top = '0';
        topPipe.style.left = '400px';
        
        // Create bottom pipe
        const bottomPipe = document.createElement('div');
        bottomPipe.className = 'pipe';
        bottomPipe.style.height = (600 - pipeHeight - this.pipeGap) + 'px';
        bottomPipe.style.bottom = '0';
        bottomPipe.style.left = '400px';

        this.gameContainer.appendChild(topPipe);
        this.gameContainer.appendChild(bottomPipe);
        this.pipes.push(topPipe, bottomPipe);

        setTimeout(() => this.spawnPipes(), this.pipeInterval);
    }

    updatePipes() {
        for (let i = 0; i < this.pipes.length; i++) {
            const pipe = this.pipes[i];
            const currentLeft = parseFloat(pipe.style.left);
            
            if (currentLeft < -60) {
                pipe.remove();
                this.pipes.splice(i, 1);
                i--;
                continue;
            }

            pipe.style.left = (currentLeft - 2) + 'px';

            // Score when passing pipes
            if (currentLeft === 48) {
                if (i % 2 === 0) {
                    this.score++;
                    this.scoreElement.textContent = this.score;
                }
            }
        }
    }

    checkCollision() {
        const birdRect = this.bird.getBoundingClientRect();
        
        // Check wall collision
        if (this.birdY < 0 || this.birdY > 560) {
            return true;
        }

        // Check pipe collision
        for (const pipe of this.pipes) {
            const pipeRect = pipe.getBoundingClientRect();
            if (
                birdRect.left < pipeRect.right &&
                birdRect.right > pipeRect.left &&
                birdRect.top < pipeRect.bottom &&
                birdRect.bottom > pipeRect.top
            ) {
                return true;
            }
        }

        return false;
    }

    gameOver() {
        this.isGameRunning = false;
        clearInterval(this.gameLoop);
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Play Again';
    }
}

// Initialize the game
const game = new FlappyBird();