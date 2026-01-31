// Главное приложение с безопасностью и исправленными event handlers
const app = {
    config: {
        personality: 'friend',
        mode: 'chat',
        lastActivity: Date.now()
    },

    personalities: {
        friend: {
            emoji: '🐙',
            mood: '😊',
            greetings: ['Привет! Рад тебя слышать! 👋', 'О, это ты! Как жизнь?', 'Наконец-то! Скучал!'],
            phrases: ['Понял тебя!', 'Интересно, расскажи подробнее.', 'Я тебя слушаю...', 'Рассказывай!', 'Увлекательно!'],
            emotions: { happy: '😄', sad: '😢', surprised: '😲', thinking: '🤔' }
        },
        sarcastic: {
            emoji: '🦑',
            mood: '🙄',
            greetings: ['О, снова ты. Ура.', 'Привет. Надеюсь, повод хороший.', 'Ого, ты ещё здесь?'],
            phrases: ['Ну конечно...', 'Оригинально.', 'Ты серьёзно?', 'Неожиданно (нет).', 'Вау.'],
            emotions: { happy: '😏', sad: '🙄', surprised: '🤨', thinking: '🧐' }
        },
        wise: {
            emoji: '🐢',
            mood: '🤔',
            greetings: ['Приветствую. Что тревожит твой разум?', 'Добро пожаловать в диалог.', 'Время мудрости наступило.'],
            phrases: ['Интересная мысль...', 'В этом есть глубина.', 'Позволь мне подумать.', 'Существенно.', 'Продолжай.'],
            emotions: { happy: '😌', sad: '😔', surprised: '😮', thinking: '🤔' }
        },
        detective: {
            emoji: '🕵️',
            mood: '🧐',
            greetings: ['Интересный случай...', 'Подозрительная тишина.', 'Что привело тебя сюда?'],
            phrases: ['Анализирую...', 'Улики указывают на...', 'Замечено!', 'Факты, только факты.', 'Подозрительно...'],
            emotions: { happy: '🕵️', sad: '🤔', surprised: '😲', thinking: '🧐' }
        }
    },

    init: function() {
        console.log('Глот v7.1 запускается...');

        this.config.personality = storage.data.personality;

        if (storage.data.theme === 'light') {
            document.body.classList.add('light-theme');
        }

        this.createBackgroundEffects();
        
        if (voice.init()) {
            console.log('Голосовой модуль активирован');
        }

        this.loadHistory();
        this.updateUI();

        // Проверка напоминаний
        this.checkReminders();

        setTimeout(() => {
            this.speak(this.selectGreeting());
        }, 500);

        console.log('Глот готов!');
    },

    createBackgroundEffects: function() {
        const container = document.getElementById('bgEffects');
        if (!container) return;

        container.innerHTML = ''; // Очистка при повторной инициализации
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    },

    handleInput: function(text, source = 'text') {
        if (!text || typeof text !== 'string') return;
        
        text = text.trim();
        if (!text) return;

        this.config.lastActivity = Date.now();

        // Безопасное добавление сообщения
        this.addMessage(text, true);

        // Проверка игры
        if (games.current && games.handleVoice(text)) {
            return;
        }

        // Генерация и сохранение ответа
        const response = this.generateResponse(text);
        storage.addToHistory(text, response);

        setTimeout(() => {
            this.speak(response);
        }, 300);
    },

    generateResponse: function(text) {
        const lower = text.toLowerCase();
        const p = this.personalities[this.config.personality];

        // Помощь
        if (lower.includes('помоги') || lower.includes('что ты умеешь') || lower.includes('команды')) {
            return `Я могу:
🎤 Общаться голосом
🌐 Переводить (скажи "переведи [текст]")
🎮 Играть ("давай играть")
📝 Делать заметки ("запиши [текст]")
⏰ Напоминать ("напомни [что] в [время]")
⚙️ Настраиваться (нажми ⚙️)`;
        }

        // Перевод через бесплатный API (MyMemory)
        if (lower.includes('переведи') || lower.includes('перевод')) {
            const toTranslate = text.replace(/переведи|перевод/gi, '').trim();
            if (toTranslate) {
                this.translateText(toTranslate);
                return `Перевожу: "${toTranslate.substring(0, 50)}..."`;
            } else {
                return 'Что перевести? Скажите: "Переведи [текст]"';
            }
        }

        // Игры
        if (lower.includes('игра') || lower.includes('играть') || lower.includes('давай играть')) {
            games.start('guessNumber');
            return 'Начинаем игру "Угадай число"! Я загадал число от 1 до 100. У вас 10 попыток.';
        }

        // Заметки
        if (lower.includes('запиши') || lower.includes('заметка')) {
            const note = text.replace(/запиши|заметка/gi, '').trim();
            if (note) {
                storage.data.notes.push({ 
                    text: note.substring(0, 500), 
                    time: Date.now(),
                    id: Date.now()
                });
                storage.save('notes', storage.data.notes);
                return `✅ Записал: "${note.substring(0, 100)}${note.length > 100 ? '...' : ''}"`;
            } else {
                return 'Что записать? Скажите: "Запиши [текст]"';
            }
        }

        // Напоминания
        if (lower.includes('напомни')) {
            return this.handleReminder(text);
        }

        // Остановка
        if (lower.includes('стоп') || lower.includes('хватит') || lower.includes('останови')) {
            if (games.current) {
                games.stop();
                return 'Игра остановлена. Возвращаемся к чату.';
            }
            if (voice.isSpeaking) {
                voice.stop();
                return 'Остановил озвучку.';
            }
        }

        // Приветствия и базовые ответы
        if (lower.includes('привет') || lower.includes('здравствуй')) {
            return this.selectGreeting();
        }
        if (lower.includes('как дела') || lower.includes('как ты')) {
            const states = ['Отлично! Готов помогать.', 'Функционирую на полную!', 'Всё системы в норме.'];
            return states[Math.floor(Math.random() * states.length)] + ' А у тебя?';
        }
        if (lower.includes('шутк') || lower.includes('расскажи шутку')) {
            return this.getJoke();
        }
        if (lower.includes('спасибо') || lower.includes('благодар')) {
            return 'Всегда пожалуйста! Обращайся 😉';
        }
        if (lower.includes('пока') || lower.includes('до свидания')) {
            return 'Пока! Я рядом, если что. Нажми 🎤 или напиши!';
        }

        // Время
        if (lower.includes('время') || lower.includes('который час')) {
            const now = new Date();
            return `Сейчас ${now.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`;
        }

        // Дата
        if (lower.includes('дата') || lower.includes('какое сегодня число') || lower.includes('какой сегодня')) {
            const now = new Date();
            return `Сегодня ${now.toLocaleDateString('ru-RU', {weekday: 'long', day: 'numeric', month: 'long'})}`;
        }

        // Контекстные ответы персонажа
        return p.phrases[Math.floor(Math.random() * p.phrases.length)];
    },

    // Обработка напоминаний
    handleReminder: function(text) {
        // Простой парсинг: "напомни позвонить маме через 5 минут" или "напомни в 15:00"
        const now = new Date();
        let reminderTime = null;
        let reminderText = '';

        // Паттерн "через X минут/часов"
        const timeMatch = text.match(/через\s+(\d+)\s+(минут|минуту|минуты|час|часа|часов)/i);
        if (timeMatch) {
            const amount = parseInt(timeMatch[1]);
            const unit = timeMatch[2].startsWith('час') ? 'hours' : 'minutes';
            
            reminderTime = new Date(now.getTime() + amount * (unit === 'hours' ? 3600000 : 60000));
            reminderText = text.replace(/напомни|через\s+\d+\s+(минут|час).?/gi, '').trim();
        } else {
            // Паттерн "в HH:MM"
            const clockMatch = text.match(/в\s+(\d{1,2})[:.](\d{2})/);
            if (clockMatch) {
                const hours = parseInt(clockMatch[1]);
                const minutes = parseInt(clockMatch[2]);
                
                reminderTime = new Date(now);
                reminderTime.setHours(hours, minutes, 0, 0);
                
                if (reminderTime < now) {
                    reminderTime.setDate(reminderTime.getDate() + 1); // Завтра
                }
                reminderText = text.replace(/напомни|в\s+\d{1,2}[:.]\d{2}/gi, '').trim();
            }
        }

        if (reminderTime && reminderText) {
            const reminder = {
                id: Date.now(),
                text: reminderText.substring(0, 200),
                time: reminderTime.getTime(),
                notified: false
            };
            
            storage.data.reminders.push(reminder);
            storage.save('reminders', storage.data.reminders);
            
            // Запрашиваем разрешение на уведомления
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
            
            const timeStr = reminderTime.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
            return `⏰ Напомню "${reminderText.substring(0, 50)}${reminderText.length > 50 ? '...' : ''}" в ${timeStr}`;
        }

        return 'Когда напомнить? Скажите: "Напомни [что] через [N] минут" или "в [час:минуты]"';
    },

    checkReminders: function() {
        setInterval(() => {
            const now = Date.now();
            const due = storage.data.reminders.filter(r => !r.notified && r.time <= now);
            
            due.forEach(reminder => {
                this.showMessage(`⏰ Напоминание: ${reminder.text}`, 'reminder');
                this.speak(`Напоминаю: ${reminder.text}`);
                
                // Браузерное уведомление
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Глот напоминает', {
                        body: reminder.text,
                        icon: '🐙'
                    });
                }
                
                reminder.notified = true;
            });
            
            if (due.length > 0) {
                storage.save('reminders', storage.data.reminders);
            }
        }, 30000); // Проверка каждые 30 секунд
    },

    // Перевод через бесплатный API
    translateText: async function(text) {
        if (!text) return;
        
        try {
            // MyMemory API (бесплатно до 1000 слов/день)
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|en`);
            const data = await response.json();
            
            if (data.responseData) {
                const translated = data.responseData.translatedText;
                const result = `Перевод "${text.substring(0, 30)}...":\n${translated}`;
                this.addMessage(result, false);
                voice.speak(`Перевод: ${translated}`);
            } else {
                throw new Error('Нет данных');
            }
        } catch (e) {
            console.error('Ошибка перевода:', e);
            this.showMessage('❌ Ошибка перевода. Попробуйте позже.', 'error');
        }
    },

    selectGreeting: function() {
        const hour = new Date().getHours();
        let timeGreeting = '';
        
        if (hour < 6) timeGreeting = 'Доброй ночи';
        else if (hour < 12) timeGreeting = 'Доброе утро';
        else if (hour < 18) timeGreeting = 'Добрый день';
        else timeGreeting = 'Добрый вечер';
        
        const p = this.personalities[this.config.personality];
        const randomGreeting = p.greetings[Math.floor(Math.random() * p.greetings.length)];
        return `${timeGreeting}! ${randomGreeting}`;
    },

    getJoke: function() {
        const jokes = [
            'Почему программисты путают Хэллоуин и Рождество? Потому что Oct 31 == Dec 25!',
            'Шёл мимо библиотеки. Зашёл. Теперь я книга.',
            'Мой любимый напиток — Java. Но только если он в script!',
            'Почему Python-разработчикам холодно? Потому что у них нет скобок, только отступы!',
            'У меня есть шутка про UDP, но не факт, что она до вас дойдёт.'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    },

    // Безопасное добавление сообщения (защита от XSS)
    addMessage: function(text, isUser, type = 'normal') {
        const chat = document.getElementById('chat');
        if (!chat) return;

        const msg = document.createElement('div');
        msg.className = 'message ' + (isUser ? 'user' : 'glott');

        const time = new Date().toLocaleTimeString('ru', {hour: '2-digit', minute: '2-digit'});
        const p = this.personalities[this.config.personality];

        if (!isUser) {
            // Безопасное создание структуры через textContent
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'emoji';
            emojiSpan.textContent = p.emoji;
            
            const textSpan = document.createElement('span');
            textSpan.className = 'text';
            textSpan.textContent = text;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'time';
            timeDiv.textContent = time;
            
            msg.appendChild(emojiSpan);
            msg.appendChild(textSpan);
            msg.appendChild(timeDiv);
        } else {
            const textSpan = document.createElement('span');
            textSpan.className = 'text';
            textSpan.textContent = text;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'time';
            timeDiv.textContent = time;
            
            msg.appendChild(textSpan);
            msg.appendChild(timeDiv);
        }

        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    showMessage: function(text, type = 'normal') {
        this.addMessage(text, false);
    },

    loadHistory: function() {
        const recent = storage.data.history.slice(-10);
        recent.forEach(item => {
            if (item.input) this.addMessage(item.input, true);
            if (item.response) this.addMessage(item.response, false);
        });
    },

    speak: function(text) {
        this.addMessage(text, false);
        voice.speak(text);
    },

    setStatus: function(text) {
        const statusEl = document.getElementById('statusText');
        if (statusEl) statusEl.textContent = text;
    },

    updateUI: function() {
        const p = this.personalities[this.config.personality];
        const avatar = document.getElementById('avatar');
        const moodBadge = document.getElementById('moodBadge');
        
        if (avatar) avatar.textContent = p.emoji;
        if (moodBadge) moodBadge.textContent = p.mood;
    },

    toggleSettings: function() {
        const settings = document.getElementById('settings');
        const overlay = document.querySelector('.overlay');
        
        if (settings && overlay) {
            settings.classList.toggle('open');
            overlay.classList.toggle('open');
        }
    },

    // Исправленные методы с передачей элемента вместо глобального event
    setPersonality: function(p, btnElement) {
        this.config.personality = p;
        storage.save('personality', p);

        // Убираем active со всех кнопок
        document.querySelectorAll('.personality-btn').forEach(btn => btn.classList.remove('active'));
        // Добавляем active нажатой кнопке
        if (btnElement) btnElement.classList.add('active');

        this.updateUI();
        this.speak(`Теперь я в режиме "${p}"!`);
    },

    setVoice: function(v, btnElement) {
        storage.save('voice', v);
        
        document.querySelectorAll('.voice-preset').forEach(btn => btn.classList.remove('active'));
        if (btnElement) btnElement.classList.add('active');
        
        this.speak('Голос изменён!');
    },

    toggleTheme: function() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        storage.save('theme', isLight ? 'light' : 'dark');
    },

    setMode: function(mode, callFromGames = true) {
        this.config.mode = mode;

        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.mode === mode || (mode === 'chat' && tab.textContent.includes('Чат')) || (mode === 'game' && tab.textContent.includes('Игра'))) {
                tab.classList.add('active');
            }
        });

        if (mode === 'game' && callFromGames && !games.current) {
            games.start('guessNumber');
        } else if (mode === 'chat' && games.current) {
            games.stop();
        }
    },

    quickCommand: function(cmd) {
        const input = document.getElementById('textInput');
        if (input) {
            input.value = cmd + ' ';
            input.focus();
        }
    },

    sendText: function() {
        const input = document.getElementById('textInput');
        if (!input) return;
        
        const text = input.value.trim();
        if (text) {
            this.handleInput(text, 'text');
            input.value = '';
        }
    }
};

// Запуск при загрузке
window.addEventListener('load', () => {
    app.init();
});

// Обработка офлайн
window.addEventListener('offline', () => {
    const indicator = document.getElementById('offlineIndicator');
    if (indicator) indicator.classList.add('show');
});

window.addEventListener('online', () => {
    const indicator = document.getElementById('offlineIndicator');
    if (indicator) indicator.classList.remove('show');
});

// Безопасность: блокировка XSS через URL
window.addEventListener('hashchange', () => {
    const hash = location.hash.replace(/[<>]/g, '');
    location.hash = hash;
});
