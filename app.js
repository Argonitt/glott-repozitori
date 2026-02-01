// ==========================================
// ГЛОТ v7.2 - Полностью рабочая версия
// ==========================================

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
            name: 'Друг',
            greetings: ['Привет! Рад тебя видеть! 👋', 'О, это ты! Как жизнь?', 'Наконец-то! Скучал!'],
            phrases: ['Понял тебя!', 'Интересно, расскажи подробнее.', 'Я тебя слушаю...'],
            advice: ['Слушай свое сердце!', 'Не бойся ошибок - это опыт!']
        },
        sarcastic: {
            emoji: '🦑',
            mood: '🙄',
            name: 'Саркастик',
            greetings: ['О, снова ты. Ура.', 'Привет. Надеюсь, повод хороший.'],
            phrases: ['Ну конечно...', 'Оригинально.', 'Ты серьёзно?'],
            advice: ['Попробуй... хотя зачем?', 'Сделай как нибудь.']
        },
        wise: {
            emoji: '🐢',
            mood: '🤔',
            name: 'Мудрец',
            greetings: ['Приветствую. Что тревожит твой разум?', 'Добро пожаловать в диалог.'],
            phrases: ['Интересная мысль...', 'В этом есть глубина.', 'Позволь мне подумать.'],
            advice: ['Терпение - ключ к пониманию.', 'Ищи ответ внутри себя.']
        },
        detective: {
            emoji: '🕵️',
            mood: '🧐',
            name: 'Детектив',
            greetings: ['Интересный случай...', 'Подозрительная тишина.'],
            phrases: ['Анализирую...', 'Улики указывают на...', 'Замечено!'],
            advice: ['Собери все факты.', 'Обрати внимание на детали.']
        }
    },

    knowledge: {
        weather: {
            keywords: ['погода', 'холодно', 'жарко', 'дождь', 'снег'],
            responses: ['Погода - это настроение природы!', 'Надеюсь, за окном всё хорошо.']
        },
        food: {
            keywords: ['есть', 'еда', 'пицца', 'суши', 'голоден'],
            responses: ['Я бы съел пиццу, если бы мог!', 'Какое твое любимое блюдо?']
        },
        mood: {
            keywords: ['грустно', 'весело', 'рад', 'злой', 'устал'],
            responses: ['Настроение - это волна. Она пройдёт!', 'Я рядом, если нужно поболтать.']
        },
        tech: {
            keywords: ['компьютер', 'телефон', 'программа', 'код'],
            responses: ['Технологии - это круто!', 'Ты программируешь?']
        }
    },

    init: function() {
        console.log('🚀 Глот v7.2 запущен');
        
        try {
            this.config.personality = storage.data.personality || 'friend';
            
            this.applyTheme(storage.data.theme || 'dark');
            this.createParticles();
            
            if (voice.init()) {
                console.log('Голос подключен');
            }
            
            this.loadHistory();
            this.updateUI();
            
            setTimeout(() => {
                this.speak(this.selectGreeting());
            }, 600);
            
            // Обработчик Enter
            const input = document.getElementById('textInput');
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendText();
                });
            }
            
            // Проверка напоминаний каждые 30 сек
            setInterval(() => this.checkReminders(), 30000);
            
        } catch (e) {
            console.error('Ошибка инициализации:', e);
        }
    },

    createParticles: function() {
        const container = document.getElementById('bgEffects');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 15 + 's';
            p.style.animationDuration = (15 + Math.random() * 10) + 's';
            container.appendChild(p);
        }
    },

    applyTheme: function(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(theme + '-theme');
        storage.save('theme', theme);
    },

    toggleTheme: function() {
        const isLight = document.body.classList.contains('light-theme');
        this.applyTheme(isLight ? 'dark' : 'light');
        this.speak(isLight ? 'Тёмная тема включена' : 'Светлая тема включена');
    },

    detectLanguage: function(text) {
        const hasCyrillic = /[а-яёА-ЯЁ]/.test(text);
        const hasLatin = /[a-zA-Z]/.test(text);
        if (hasCyrillic) return 'ru';
        if (hasLatin) return 'en';
        return 'ru';
    },

    generateResponse: function(text) {
        if (!text) return 'Я не расслышал, повтори!';
        
        const lower = text.toLowerCase();
        const p = this.personalities[this.config.personality];
        
        // Помощь
        if (lower.includes('помоги') || lower.includes('что ты умеешь')) {
            return this.getHelpText();
        }
        
        // ===== ИСПРАВЛЕННЫЙ ПЕРЕВОД =====
        if (lower.includes('переведи') || lower.includes('перевод')) {
            // Убираем команду из текста
            let toTranslate = text.replace(/переведи|перевод|на английский|на русский/gi, '').trim();
            
            if (toTranslate) {
                // Определяем язык
                const detected = this.detectLanguage(toTranslate);
                const fromLang = detected;
                const toLang = detected === 'ru' ? 'en' : 'ru';
                const direction = detected === 'ru' ? 'русский → английский' : 'английский → русский';
                
                // Запускаем перевод
                setTimeout(() => this.translateText(toTranslate, fromLang, toLang), 100);
                
                return `🔄 Перевожу (${direction}):\n"${toTranslate.substring(0, 100)}${toTranslate.length > 100 ? '...' : ''}"`;
            } else {
                return 'Что перевести? Напиши:\n• "Переведи Hello world"\n• "Переведи Привет мир"';
            }
        }
        
        // Игра
        if (lower.includes('играть') || lower.includes('игра')) {
            games.start('guessNumber');
            return 'Загадал число от 1 до 100! У тебя 10 попыток.';
        }
        
        // Заметка
        if (lower.includes('запиши') || lower.includes('заметка')) {
            const note = text.replace(/запиши|заметка/gi, '').trim();
            if (note) {
                storage.data.notes.push({ text: note, time: Date.now(), id: Date.now() });
                storage.save('notes', storage.data.notes);
                return `✅ Записал: "${note.substring(0, 100)}${note.length > 100 ? '...' : ''}"`;
            }
            return 'Что записать? Скажи: "Запиши [текст]"';
        }
        
        // Напоминание
        if (lower.includes('напомни')) {
            return this.handleReminder(text);
        }
        
        // О себе
        if (lower.includes('о себе') || lower.includes('кто ты')) {
            return `Я Глот v7.2! Я умею общаться, переводить, играть и помогать. Мой характер: ${p.name} ${p.emoji}`;
        }
        
        // Стоп
        if (lower.includes('стоп') || lower.includes('хватит')) {
            if (games.current) {
                games.stop();
                return 'Игра остановлена.';
            }
            voice.stop();
            return 'Остановил.';
        }
        
        // Привет
        if (lower.match(/привет|здравствуй|здорово/)) {
            return this.selectGreeting();
        }
        
        // Пока
        if (lower.match(/пока|до свидания|бай/)) {
            return 'До встречи! Я буду ждать 😉';
        }
        
        // Спасибо
        if (lower.match(/спасибо|спс/)) {
            return 'Всегда пожалуйста! Обращайся 😊';
        }
        
        // Время
        if (lower.includes('время') || lower.includes('час')) {
            const now = new Date();
            return `Сейчас ${now.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`;
        }
        
        // Совет
        if (lower.includes('совет')) {
            return p.advice[Math.floor(Math.random() * p.advice.length)];
        }
        
        // Проверяем базу знаний
        for (const [category, data] of Object.entries(this.knowledge)) {
            if (data.keywords.some(k => lower.includes(k))) {
                const resp = data.responses[Math.floor(Math.random() * data.responses.length)];
                return p.phrases[Math.floor(Math.random() * p.phrases.length)] + ' ' + resp;
            }
        }
        
        // По умолчанию
        return p.phrases[Math.floor(Math.random() * p.phrases.length)] + ' Расскажи подробнее?';
    },

    getHelpText: function() {
        return `🤖 Я Глот v7.2!

🌐 ПЕРЕВОД (автоопределение):
   • "Переведи Hello world" → русский
   • "Переведи Привет мир" → английский

🎮 "Давай играть" - угадай число
📝 "Запиши [текст]" - заметка
⏰ "Напомни через 5 минут [что]" 
👤 "О себе" - кто я`;
    },

    handleInput: function(text, source) {
        if (!text || !text.trim()) return;
        
        this.config.lastActivity = Date.now();
        this.addMessage(text, true);
        
        if (games.current && games.handleVoice(text)) return;
        
        setTimeout(() => {
            const response = this.generateResponse(text);
            this.speak(response);
            storage.addToHistory(text, response);
        }, source === 'voice' ? 400 : 100);
    },

    speak: function(text) {
        this.addMessage(text, false);
        voice.speak(text);
    },

    addMessage: function(text, isUser) {
        const chat = document.getElementById('chat');
        if (!chat) return;

        const msg = document.createElement('div');
        msg.className = 'message ' + (isUser ? 'user' : 'bot');
        
        const time = new Date().toLocaleTimeString('ru', {hour: '2-digit', minute: '2-digit'});
        const p = this.personalities[this.config.personality];
        
        if (isUser) {
            msg.innerHTML = `<div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`;
        } else {
            msg.innerHTML = `<span class="emoji">${p.emoji}</span><div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`;
        }
        
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    selectGreeting: function() {
        const hour = new Date().getHours();
        let timeGreeting = hour < 6 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';
        const p = this.personalities[this.config.personality];
        return timeGreeting + '! ' + p.greetings[Math.floor(Math.random() * p.greetings.length)];
    },

    toggleSettings: function() {
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('overlay');
        
        if (panel.classList.contains('open')) {
            panel.classList.remove('open');
            overlay.classList.remove('active');
        } else {
            panel.classList.add('open');
            overlay.classList.add('active');
            this.updateSettingsUI();
        }
    },

    updateSettingsUI: function() {
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.personality === this.config.personality);
        });
        
        document.querySelectorAll('.voice-btn-settings').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.voice === storage.data.voice);
        });
    },

    setPersonality: function(p) {
        this.config.personality = p;
        storage.save('personality', p);
        this.updateSettingsUI();
        document.getElementById('personalityLabel').textContent = 'Режим: ' + this.personalities[p].name;
        this.updateAvatar();
        this.speak(`Теперь я ${this.personalities[p].name}!`);
    },

    setVoice: function(v) {
        storage.save('voice', v);
        this.updateSettingsUI();
        this.speak('Голос изменён!');
    },

    setMode: function(mode) {
        this.config.mode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (mode === 'game' && !games.current) {
            games.start('guessNumber');
        } else if (mode === 'chat' && games.current) {
            games.stop();
        }
    },

    updateAvatar: function() {
        const p = this.personalities[this.config.personality];
        const avatar = document.getElementById('avatar');
        const mood = document.getElementById('moodBadge');
        if (avatar) avatar.textContent = p.emoji;
        if (mood) mood.textContent = p.mood;
    },

    updateUI: function() {
        this.updateAvatar();
        const label = document.getElementById('personalityLabel');
        if (label) label.textContent = 'Режим: ' + this.personalities[this.config.personality].name;
    },

    loadHistory: function() {
        const recent = storage.data.history.slice(-10);
        recent.forEach(item => {
            if (item.input) this.addMessage(item.input, true);
            if (item.response) this.addMessage(item.response, false);
        });
    },

    quickCommand: function(cmd) {
        const input = document.getElementById('textInput');
        if (input) {
            input.value = cmd;
            input.focus();
            if (['помоги', 'о себе', 'игра'].some(c => cmd.includes(c))) {
                setTimeout(() => this.sendText(), 100);
            }
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
    },

    setStatus: function(text) {
        const el = document.getElementById('statusText');
        if (el) el.textContent = text;
    },

    handleReminder: function(text) {
        const now = new Date();
        let reminderTime = null;
        let reminderText = '';

        const match = text.match(/через\s+(\d+)\s+(минут|час)/i);
        if (match) {
            const amount = parseInt(match[1]);
            const isHour = match[2].includes('час');
            reminderTime = new Date(now.getTime() + amount * (isHour ? 3600000 : 60000));
            reminderText = text.replace(/напомни|через\s+\d+\s+(минут|час)/gi, '').trim() || 'Напоминание';
        }

        if (reminderTime) {
            const reminder = {
                id: Date.now(),
                text: reminderText.substring(0, 200),
                time: reminderTime.getTime(),
                notified: false
            };
            storage.data.reminders.push(reminder);
            storage.save('reminders', storage.data.reminders);
            
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
            
            const timeStr = reminderTime.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
            return `⏰ Напомню в ${timeStr}: "${reminderText.substring(0, 50)}..."`;
        }

        return 'Когда напомнить? "Напомни через 10 минут позвонить"';
    },

    checkReminders: function() {
        const now = Date.now();
        const due = storage.data.reminders.filter(r => !r.notified && r.time <= now);
        
        due.forEach(r => {
            this.showMessage(`⏰ Напоминание: ${r.text}`);
            this.speak(`Напоминаю: ${r.text}`);
            
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Глот', { body: r.text });
            }
            r.notified = true;
        });
        
        if (due.length) storage.save('reminders', storage.data.reminders);
    },

    showMessage: function(text) {
        this.addMessage(text, false);
    },

    translateText: async function(text, fromLang, toLang) {
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
            const data = await response.json();
            
            if (data.responseData?.translatedText) {
                const translated = data.responseData.translatedText;
                const result = `✅ Перевод:\n${translated}`;
                this.addMessage(result, false);
                voice.speak(translated);
            }
        } catch (e) {
            this.showMessage('❌ Ошибка перевода');
        }
    }
};

// Инициализация при загрузке
window.addEventListener('load', () => {
    app.init();
});

window.addEventListener('offline', () => {
    const ind = document.getElementById('offlineIndicator');
    if (ind) ind.classList.add('show');
});

window.addEventListener('online', () => {
    const ind = document.getElementById('offlineIndicator');
    if (ind) ind.classList.remove('show');
});
