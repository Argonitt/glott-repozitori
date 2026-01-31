// Главное приложение
const app = {
    config: {
        personality: 'friend',
        mode: 'chat',
        lastActivity: Date.now()
    },

    // Данные персонажей
    personalities: {
        friend: {
            emoji: '🐙',
            mood: '😊',
            greetings: ['Привет! Рад тебя слышать! 👋', 'О, это ты! Как жизнь?', 'Наконец-то! Скучал!'],
            phrases: ['Понял тебя!', 'Интересно, расскажи подробнее.', 'Я тебя слушаю...'],
            emotions: { happy: '😄', sad: '😢', surprised: '😲', thinking: '🤔' }
        },
        sarcastic: {
            emoji: '🦑',
            mood: '🙄',
            greetings: ['О, снова ты. Ура.', 'Привет. Надеюсь, повод хороший.'],
            phrases: ['Ну конечно...', 'Оригинально.', 'Ты серьёзно?'],
            emotions: { happy: '😏', sad: '🙄', surprised: '🤨', thinking: '🧐' }
        },
        wise: {
            emoji: '🐢',
            mood: '🤔',
            greetings: ['Приветствую. Что тревожит твой разум?', 'Добро пожаловать в диалог.'],
            phrases: ['Интересная мысль...', 'В этом есть глубина.', 'Позволь мне подумать.'],
            emotions: { happy: '😌', sad: '😔', surprised: '😮', thinking: '🤔' }
        },
        detective: {
            emoji: '🕵️',
            mood: '🧐',
            greetings: ['Интересный случай...', 'Подозрительная тишина.'],
            phrases: ['Анализирую...', 'Улики указывают на...', 'Замечено!'],
            emotions: { happy: '🕵️', sad: '🤔', surprised: '😲', thinking: '🧐' }
        }
    },

    // Инициализация
    init: function() {
        console.log('Глот v7.0 запускается...');

        // Загрузить настройки
        this.config.personality = storage.data.personality;

        // Применить тему
        if (storage.data.theme === 'light') {
            document.body.classList.add('light-theme');
        }

        // Создать фоновые эффекты
        this.createBackgroundEffects();

        // Инициализировать голос
        voice.init();

        // Загрузить историю
        this.loadHistory();

        // Обновить UI
        this.updateUI();

        // Приветствие
        setTimeout(() => {
            this.speak(this.selectGreeting());
        }, 500);

        console.log('Глот готов!');
    },

    // Создать фоновые частицы
    createBackgroundEffects: function() {
        const container = document.getElementById('bgEffects');
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    },

    // Обработка ввода
    handleInput: function(text, source = 'text') {
        this.config.lastActivity = Date.now();

        // Добавить сообщение пользователя
        this.addMessage(text, true);

        // Проверить игру
        if (games.current && games.handleVoice(text)) {
            return;
        }

        // Анализ и ответ
        const response = this.generateResponse(text);

        // Сохранить в историю
        storage.addToHistory(text, response);

        // Ответить
        setTimeout(() => {
            this.speak(response);
        }, 300);
    },

    // Генерация ответа
    generateResponse: function(text) {
        const lower = text.toLowerCase();
        const p = this.personalities[this.config.personality];

        // Команды
        if (lower.includes('помоги') || lower.includes('что ты умеешь')) {
            return 'Я могу:
🎤 Общаться голосом
🌐 Переводить (скажи "переведи")
🎮 Играть ("давай играть")
📝 Делать заметки ("запиши")
⚙️ Настраиваться (нажми ⚙️)';
        }

        if (lower.includes('переведи')) {
            const toTranslate = text.replace(/переведи/gi, '').trim();
            if (toTranslate) {
                return `Перевод "${toTranslate}":
(Здесь будет перевод через API)`;
            }
        }

        if (lower.includes('игра') || lower.includes('играть') || lower.includes('давай играть')) {
            games.start('guessNumber');
            return 'Начинаем игру "Угадай число"! Я загадал число от 1 до 100.';
        }

        if (lower.includes('запиши') || lower.includes('заметка')) {
            const note = text.replace(/запиши|заметка/gi, '').trim();
            if (note) {
                storage.data.notes.push({ text: note, time: Date.now() });
                storage.save('notes', storage.data.notes);
                return `Записал: "${note}"`;
            }
        }

        if (lower.includes('стоп') || lower.includes('хватит')) {
            if (games.current) {
                games.stop();
                return 'Игра остановлена.';
            }
        }

        // Стандартные ответы
        if (lower.includes('привет')) return this.selectGreeting();
        if (lower.includes('как дела')) return 'Отлично! Готов болтать часами. А у тебя?';
        if (lower.includes('как ты')) return 'Функционирую на полную! Голос работает, память в порядке 💪';
        if (lower.includes('шутк')) return this.getJoke();
        if (lower.includes('спасибо')) return 'Всегда пожалуйста! Обращайся 😉';
        if (lower.includes('пока')) return 'Пока! Я рядом если что 😉';

        // Контекстные ответы
        return p.phrases[Math.floor(Math.random() * p.phrases.length)];
    },

    // Выбор приветствия
    selectGreeting: function() {
        const hour = new Date().getHours();
        let timeGreeting = hour < 6 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';
        const p = this.personalities[this.config.personality];
        return timeGreeting + '! ' + p.greetings[Math.floor(Math.random() * p.greetings.length)];
    },

    // Шутка
    getJoke: function() {
        const jokes = [
            'Почему программисты путают Хэллоуин и Рождество? Потому что Oct 31 == Dec 25!',
            'Шёл мимо библиотеки. Зашёл. Теперь я книга.',
            'Мой любимый напиток — Java. Но только если он в script!'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    },

    // Добавить сообщение в чат
    addMessage: function(text, isUser, type = 'normal') {
        const chat = document.getElementById('chat');
        const msg = document.createElement('div');
        msg.className = 'message ' + (isUser ? 'user' : 'glott');

        const time = new Date().toLocaleTimeString('ru', {hour: '2-digit', minute: '2-digit'});
        const p = this.personalities[this.config.personality];

        if (!isUser) {
            msg.innerHTML = `<span class="emoji">${p.emoji}</span>${text}<div class="time">${time}</div>`;
        } else {
            msg.innerHTML = `${text}<div class="time">${time}</div>`;
        }

        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    // Показать системное сообщение
    showMessage: function(text, type = 'normal') {
        this.addMessage(text, false, type);
    },

    // Загрузить историю
    loadHistory: function() {
        const recent = storage.data.history.slice(-10);
        recent.forEach(item => {
            this.addMessage(item.input, true);
            this.addMessage(item.response, false);
        });
    },

    // Озвучить
    speak: function(text) {
        this.addMessage(text, false);
        voice.speak(text);
    },

    // Установить статус
    setStatus: function(text) {
        document.getElementById('statusText').textContent = text;
    },

    // Обновить UI
    updateUI: function() {
        const p = this.personalities[this.config.personality];
        document.getElementById('avatar').textContent = p.emoji;
        document.getElementById('moodBadge').textContent = p.mood;
    },

    // Настройки
    toggleSettings: function() {
        document.getElementById('settings').classList.toggle('open');
        document.querySelector('.overlay').classList.toggle('open');
    },

    setPersonality: function(p) {
        this.config.personality = p;
        storage.save('personality', p);

        document.querySelectorAll('.personality-btn').forEach(btn => btn.classList.remove('active'));
        event.target.closest('.personality-btn').classList.add('active');

        this.updateUI();
        this.speak('Теперь я в режиме "' + p + '"!');
    },

    setVoice: function(v) {
        storage.save('voice', v);
        document.querySelectorAll('.voice-preset').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        this.speak('Голос изменён!');
    },

    toggleTheme: function() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        storage.save('theme', isLight ? 'light' : 'dark');
    },

    // Режимы
    setMode: function(mode) {
        this.config.mode = mode;

        document.querySelectorAll('.mode-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');

        if (mode === 'game') {
            if (!games.current) games.start('guessNumber');
        } else {
            games.stop();
        }
    },

    // Быстрые команды
    quickCommand: function(cmd) {
        document.getElementById('textInput').value = cmd + ' ';
        document.getElementById('textInput').focus();
    },

    // Отправить текст
    sendText: function() {
        const input = document.getElementById('textInput');
        const text = input.value.trim();
        if (text) {
            this.handleInput(text, 'text');
            input.value = '';
        }
    }
};

// Запуск при загрузке
window.onload = function() {
    app.init();
};

// Обработка офлайн
window.addEventListener('offline', () => {
    document.getElementById('offlineIndicator').classList.add('show');
});

window.addEventListener('online', () => {
    document.getElementById('offlineIndicator').classList.remove('show');
});
