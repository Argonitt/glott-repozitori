const games = {
    current: null,
    score: 0,
    gameState: null,

    start: function(gameType = 'guessNumber') {
        this.current = gameType;
        this.score = 0;
        this.gameState = null;

        const container = document.getElementById('gameContainer');
        const content = document.getElementById('gameContent');

        if (!container || !content) return;

        container.classList.add('active');
        container.style.display = 'block';

        if (gameType === 'guessNumber') {
            this.initGuessNumber(content);
        }

        this.updateModeTabs('game');
    },

    initGuessNumber: function(container) {
        const target = Math.floor(Math.random() * 100) + 1;
        const attempts = 0;

        this.gameState = { target, attempts, maxAttempts: 10 };

        container.innerHTML = `
            <div class="game-rules">
                <p>🎯 Я загадал число от 1 до 100</p>
                <p>У вас ${this.gameState.maxAttempts} попыток</p>
            </div>
            <div class="game-stats">
                <span>Попыток: <strong id="attemptsCount">0</strong>/${this.gameState.maxAttempts}</span>
                <span id="gameHint" class="hint-text"></span>
            </div>
            <div class="game-input">
                <input type="number" id="guessInput" placeholder="Ваше число" min="1" max="100" 
                    onkeypress="if(event.key==='Enter') games.makeGuess()">
                <button onclick="games.makeGuess()" class="game-btn">Угадать</button>
            </div>
            <button onclick="games.stop()" class="stop-game-btn">⏹ Остановить игру</button>
        `;

        setTimeout(() => {
            const input = document.getElementById('guessInput');
            if (input) input.focus();
        }, 100);
    },

    makeGuess: function() {
        if (!this.current || !this.gameState) return;

        const input = document.getElementById('guessInput');
        const hintEl = document.getElementById('gameHint');
        const attemptsEl = document.getElementById('attemptsCount');

        if (!input) return;

        const guess = parseInt(input.value);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.showHint('Введите число от 1 до 100!', 'error');
            return;
        }

        this.gameState.attempts++;
        const attempts = this.gameState.attempts;

        if (attemptsEl) attemptsEl.textContent = attempts;

        if (attempts > this.gameState.maxAttempts) {
            this.showHint(`❌ Попытки закончились! Было: ${this.gameState.target}`, 'error');
            app.speak(`Вы не угадали. Это было ${this.gameState.target}`);
            setTimeout(() => this.offerRestart(), 2000);
            return;
        }

        if (guess === this.gameState.target) {
            const score = Math.max(100 - (attempts - 1) * 10, 10);
            this.score += score;
            
            this.showHint(`🎉 Правильно! +${score} очков`, 'success');
            document.getElementById('gameScore').textContent = `Счёт: ${this.score}`;
            
            app.speak(`Поздравляю! Вы угадали число ${this.gameState.target} с ${attempts} попытки!`);
            
            setTimeout(() => this.offerRestart(), 1500);
        } else if (guess < this.gameState.target) {
            this.showHint('🔼 Больше! (осталось ' + (this.gameState.maxAttempts - attempts) + ')', 'warning');
            app.speak('Больше');
        } else {
            this.showHint('🔽 Меньше! (осталось ' + (this.gameState.maxAttempts - attempts) + ')', 'warning');
            app.speak('Меньше');
        }

        input.value = '';
        input.focus();
    },

    showHint: function(text, type) {
        const hint = document.getElementById('gameHint');
        if (!hint) return;
        hint.textContent = text;
        hint.className = 'hint-text ' + type;
    },

    offerRestart: function() {
        if (confirm('Сыграем ещё раз?')) {
            this.start('guessNumber');
        } else {
            this.stop();
        }
    },

    handleVoice: function(text) {
        if (!this.current || !this.gameState) return false;

        const numbers = text.match(/\d+/g);
        if (!numbers) return false;

        const num = parseInt(numbers[0]);
        if (isNaN(num)) return false;

        if (this.current === 'guessNumber') {
            const input = document.getElementById('guessInput');
            if (input) {
                input.value = num;
                this.makeGuess();
                return true;
            }
        }
        return false;
    },

    stop: function() {
        this.current = null;
        this.gameState = null;
        
        const container = document.getElementById('gameContainer');
        if (container) {
            container.classList.remove('active');
            container.style.display = 'none';
        }
        
        app.setMode('chat', false);
        this.updateModeTabs('chat');
    },

    updateModeTabs: function(mode) {
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.mode === mode || (mode === 'chat' && tab.textContent.includes('Чат')) || (mode === 'game' && tab.textContent.includes('Игра'))) {
                tab.classList.add('active');
            }
        });
    }
};
