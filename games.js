// Игровой модуль
const games = {
    current: null,
    score: 0,

    // Старт игры
    start: function(gameType = 'guessNumber') {
        this.current = gameType;
        this.score = 0;

        const container = document.getElementById('gameContainer');
        const content = document.getElementById('gameContent');

        container.classList.add('active');

        if (gameType === 'guessNumber') {
            this.initGuessNumber(content);
        }

        app.setMode('game');
    },

    // Игра "Угадай число"
    initGuessNumber: function(container) {
        const target = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;

        this.gameState = { target, attempts };

        container.innerHTML = `
            <p>🎯 Я загадал число от 1 до 100</p>
            <p>Ваши попытки: <span id="attempts">0</span></p>
            <div class="game-input">
                <input type="number" id="guessInput" placeholder="Ваше число" min="1" max="100">
                <button onclick="games.makeGuess()">Угадать</button>
            </div>
            <p id="guessHint"></p>
        `;

        // Фокус на поле ввода
        setTimeout(() => {
            const input = document.getElementById('guessInput');
            if (input) input.focus();
        }, 100);
    },

    // Сделать попытку
    makeGuess: function() {
        const input = document.getElementById('guessInput');
        const hint = document.getElementById('guessHint');
        const attemptsEl = document.getElementById('attempts');

        if (!input || !this.gameState) return;

        const guess = parseInt(input.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            hint.textContent = 'Введите число от 1 до 100!';
            hint.style.color = 'var(--danger)';
            return;
        }

        this.gameState.attempts++;
        attemptsEl.textContent = this.gameState.attempts;

        if (guess === this.gameState.target) {
            hint.textContent = '🎉 Правильно! Вы угадали!';
            hint.style.color = 'var(--success)';
            this.score += Math.max(100 - this.gameState.attempts * 10, 10);
            document.getElementById('gameScore').textContent = 'Счёт: ' + this.score;

            app.speak(`Поздравляю! Вы угадали число ${this.gameState.target} за ${this.gameState.attempts} попыток!`);

            setTimeout(() => {
                if (confirm('Сыграем ещё?')) {
                    this.start('guessNumber');
                } else {
                    this.stop();
                }
            }, 1000);

        } else if (guess < this.gameState.target) {
            hint.textContent = '🔼 Больше!';
            hint.style.color = 'var(--warning)';
            app.speak('Больше!');
        } else {
            hint.textContent = '🔽 Меньше!';
            hint.style.color = 'var(--warning)';
            app.speak('Меньше!');
        }

        input.value = '';
        input.focus();
    },

    // Обработка голосового ввода для игры
    handleVoice: function(text) {
        if (!this.current) return false;

        const num = parseInt(text.replace(/[^0-9]/g, ''));
        if (!isNaN(num) && this.current === 'guessNumber') {
            const input = document.getElementById('guessInput');
            if (input) {
                input.value = num;
                this.makeGuess();
                return true;
            }
        }
        return false;
    },

    // Остановить игру
    stop: function() {
        this.current = null;
        this.gameState = null;
        document.getElementById('gameContainer').classList.remove('active');
        app.setMode('chat');
    }
};
