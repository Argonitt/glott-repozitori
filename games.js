const games = {
    current: null,
    score: 0,
    gameState: null,

    start: function(type = 'guessNumber') {
        this.current = type;
        this.score = 0;
        
        const container = document.getElementById('gameContainer');
        const content = document.getElementById('gameContent');
        
        if (!container || !content) return;
        
        container.classList.add('active');
        container.style.display = 'block';
        
        if (type === 'guessNumber') this.initGuessNumber(content);
        
        // Обновляем табы
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === 'game');
        });
    },

    initGuessNumber: function(container) {
        this.gameState = {
            target: Math.floor(Math.random() * 100) + 1,
            attempts: 0,
            max: 10
        };

        container.innerHTML = `
            <div class="game-info">
                <p>🎯 Я загадал число от 1 до 100</p>
                <p class="attempts">Попыток: <span id="att">0</span>/${this.gameState.max}</p>
            </div>
            <div id="hint" class="game-hint"></div>
            <div class="game-controls">
                <input type="number" id="guess" min="1" max="100" placeholder="Твое число..." 
                    onkeypress="if(event.key==='Enter')games.makeGuess()">
                <button onclick="games.makeGuess()" class="game-btn">Угадать</button>
            </div>
            <button onclick="games.stop()" class="stop-btn">Остановить</button>
        `;
        
        setTimeout(() => document.getElementById('guess')?.focus(), 100);
    },

    makeGuess: function() {
        const input = document.getElementById('guess');
        const hint = document.getElementById('hint');
        const att = document.getElementById('att');
        
        if (!input || !this.gameState) return;
        
        const val = parseInt(input.value);
        if (isNaN(val) || val < 1 || val > 100) {
            hint.textContent = 'Введи число от 1 до 100!';
            hint.className = 'game-hint error';
            return;
        }

        this.gameState.attempts++;
        if (att) att.textContent = this.gameState.attempts;
        
        const t = this.gameState.target;
        const a = this.gameState.attempts;
        const max = this.gameState.max;

        if (a > max) {
            hint.textContent = `Попытки закончились! Было: ${t}`;
            hint.className = 'game-hint error';
            if (window.app) app.speak(`Ты не угадал. Это было ${t}`);
            setTimeout(() => this.askRestart(), 1500);
            return;
        }

        if (val === t) {
            const score = Math.max(110 - a * 10, 10);
            this.score += score;
            document.getElementById('gameScore').textContent = `Счёт: ${this.score}`;
            hint.textContent = `🎉 Верно! +${score} очков`;
            hint.className = 'game-hint success';
            if (window.app) app.speak(`Правильно! Ты угадал с ${a} попытки. Набрано ${score} очков`);
            if (window.app) app.setMode('game'); 
            setTimeout(() => this.askRestart(), 1200);
        } else if (val < t) {
            hint.textContent = `🔼 Больше! (осталось ${max - a})`;
            hint.className = 'game-hint';
            if (window.app) app.speak('Больше');
        } else {
            hint.textContent = `🔽 Меньше! (осталось ${max - a})`;
            hint.className = 'game-hint';
            if (window.app) app.speak('Меньше');
        }
        
        input.value = '';
        input.focus();
    },

    askRestart: function() {
        if (confirm('Сыграем ещё?')) {
            this.start('guessNumber');
        } else {
            this.stop();
        }
    },

    handleVoice: function(text) {
        if (!this.current) return false;
        const nums = text.match(/\d+/g);
        if (!nums) return false;
        
        const n = parseInt(nums[0]);
        const input = document.getElementById('guess');
        if (input && n >= 1 && n <= 100) {
            input.value = n;
            this.makeGuess();
            return true;
        }
        return false;
    },

    stop: function() {
        this.current = null;
        this.gameState = null;
        
        const c = document.getElementById('gameContainer');
        if (c) {
            c.classList.remove('active');
            c.style.display = 'none';
        }
        
        // Возвращаем режим чата
        if (window.app) app.setMode('chat');
    }
};
