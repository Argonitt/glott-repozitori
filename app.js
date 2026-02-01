// ==========================================
// ГЛОТ v10.3 — STABLE RELEASE
// Полный код с рабочими кнопками и диагностикой
// ==========================================

console.log('[GLORT] Загрузка модуля...');

const app = {
    // Конфигурация
    config: {
        personality: 'friend',
        emotionalState: 'neutral',
        userFacts: {},
        storyMode: false,
        lastInteraction: Date.now()
    },

    // Эмоции
    emotions: {
        happy: '😊', excited: '🤩', thinking: '🤔', sad: '😔',
        surprised: '😲', neutral: '😐', worried: '😟',
        laugh: '😂', offended: '😤', understanding: '😌'
    },

    // Инициализация
    init: function() {
        console.log('[GLORT] Инициализация...');
        
        try {
            // Загружаем данные
            if (typeof storage !== 'undefined' && storage.data) {
                this.config.userFacts = storage.data.userFacts || {};
                console.log('[GLORT] Данные загружены');
            }

            // Привязываем кнопки (самое важное!)
            this.bindControls();
            
            // Создаем частицы
            this.createParticles();
            
            // Применяем тему
            const savedTheme = (typeof storage !== 'undefined' && storage.data?.theme) || 'dark';
            this.applyTheme(savedTheme);
            
            // Приветствие
            setTimeout(() => {
                if (this.config.userFacts.name) {
                    this.speak(`Привет, ${this.config.userFacts.name}! Рад тебя видеть снова! 😊`);
                } else {
                    this.speak('Привет! Я Глот v10.3. Как тебя зовут?');
                }
            }, 500);
            
            console.log('[GLORT] Готов к работе');
            
        } catch (e) {
            console.error('[GLORT] Ошибка инициализации:', e);
            alert('Ошибка загрузки приложения. Проверьте консоль (F12)');
        }
    },

    // Привязка всех управляющих элементов
    bindControls: function() {
        console.log('[GLORT] Привязка кнопок...');
        
        // 1. Кнопка темы (по ID или классу)
        const themeBtn = document.getElementById('themeBtn') || document.querySelector('.theme-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[UI] Клик по теме');
                this.toggleTheme();
            });
            console.log('[GLORT] ✓ Кнопка темы привязана');
        } else {
            console.error('[GLORT] ✗ Кнопка темы не найдена. Проверьте ID="themeBtn" или class="theme-btn"');
        }

        // 2. Кнопка настроек
        const settingsBtn = document.getElementById('settingsBtn') || document.querySelector('.settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[UI] Клик по настройкам');
                this.toggleSettings();
            });
            console.log('[GLORT] ✓ Кнопка настроек привязана');
        } else {
            console.error('[GLORT] ✗ Кнопка настроек не найдена. Проверьте ID="settingsBtn" или class="settings-btn"');
        }

        // 3. Кнопка отправки
        const sendBtn = document.getElementById('sendBtn') || document.querySelector('.send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendText();
            });
        }

        // 4. Поле ввода (Enter)
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendText();
                }
            });
            console.log('[GLORT] ✓ Поле ввода привязано');
        } else {
            console.error('[GLORT] ✗ Поле ввода не найдено. Проверьте ID="textInput"');
        }

        // 5. Кнопка голоса
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn && typeof voice !== 'undefined') {
            voiceBtn.addEventListener('click', () => {
                voice.toggle();
            });
        }

        // 6. Кнопки в настройках (персонажи)
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const p = e.currentTarget.dataset.personality;
                if (p) this.setPersonality(p);
            });
        });

        // 7. Кнопки режимов
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                if (mode) this.setMode(mode);
            });
        });
    },

    // Переключение темы
    toggleTheme: function() {
        console.log('[Action] Смена темы');
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(newTheme + '-theme');
        
        if (typeof storage !== 'undefined') {
            storage.save('theme', newTheme);
        }
        
        this.showSystemMessage(`Тема изменена на ${newTheme === 'light' ? 'светлую' : 'тёмную'}`);
    },

    // Переключение настроек
    toggleSettings: function() {
        console.log('[Action] Открытие/закрытие настроек');
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('overlay');
        
        if (!panel) {
            console.error('Панель настроек не найдена!');
            return;
        }
        
        const isOpen = panel.classList.contains('open');
        
        if (isOpen) {
            panel.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        } else {
            panel.classList.add('open');
            if (overlay) overlay.classList.add('active');
            this.updateSettingsUI();
        }
    },

    // Отправка сообщения
    sendText: function() {
        const input = document.getElementById('textInput');
        if (!input) return;
        
        const text = input.value.trim();
        if (!text) return;
        
        input.value = '';
        this.handleInput(text, 'text');
    },

    // Обработка ввода
    handleInput: function(text, source) {
        this.config.lastInteraction = Date.now();
        this.addMessage(text, true);
        
        // Имитация "печатает..."
        this.setStatus('печатает...');
        
        setTimeout(() => {
            const response = this.generateResponse(text);
            this.speak(response);
            this.setStatus('онлайн');
            
            if (typeof storage !== 'undefined') {
                storage.addToHistory(text, response);
            }
        }, source === 'voice' ? 600 : 400);
    },

    // Генерация ответа (упрощенная но рабочая версия)
    generateResponse: function(text) {
        if (!text) return 'Я не расслышал?';
        
        const lower = text.toLowerCase();
        
        // Запоминание имени
        if (!this.config.userFacts.name) {
            const nameMatch = text.match(/(?:меня зовут|я\s+|мое имя\s+)(\w{2,15})/i);
            if (nameMatch && nameMatch[1]) {
                const name = nameMatch[1];
                this.config.userFacts.name = name;
                if (typeof storage !== 'undefined') {
                    storage.save('userFacts', this.config.userFacts);
                }
                this.setEmotion('happy');
                return `${name}! Приятно познакомиться! 😊 Я запомнил твое имя.`;
            }
        }
        
        // Приветствие
        if (lower.match(/привет|здравствуй|хай/)) {
            this.setEmotion('happy');
            const name = this.config.userFacts.name;
            return name ? `Привет, ${name}! Рад тебя видеть!` : 'Привет! Как дела?';
        }
        
        // Прощание
        if (lower.match(/пока|до свидания|бай/)) {
            this.setEmotion('sad');
            return 'До встречи! Возвращайся скорее! 👋';
        }
        
        // Как дела
        if (lower.match(/как дела|как ты/)) {
            this.setEmotion('happy');
            return 'У меня всё отлично! Готов к разговору. А у тебя как?';
        }
        
        // Помощь
        if (lower.includes('помоги') || lower.includes('что ты умеешь')) {
            return 'Я умею: разговаривать, переводить, играть в "Угадай число", запоминать твое имя и то, что ты любишь. Просто пиши как другу!';
        }
        
        // Fallback с вариативностью
        const responses = [
            'Интересно... Расскажи подробнее?',
            'Понял тебя! А что думаешь об этом?',
            'Вот это да! Продолжай, я слушаю.',
            'Занятная мысль! А почему именно так?',
            'Я тебя слушаю. Рассказывай дальше.',
            'Понятно. А как ты к этому относишься?',
            'Круто! А что было дальше?',
            'Знаешь, это напомнило мне... хотя постой, расскажи сначала ты.'
        ];
        
        this.setEmotion('thinking');
        return responses[Math.floor(Math.random() * responses.length)];
    },

    // Установка персонажа
    setPersonality: function(p) {
        this.config.personality = p;
        if (typeof storage !== 'undefined') {
            storage.save('personality', p);
        }
        
        // Обновляем UI
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.personality === p);
        });
        
        const names = {friend: 'Друга', sarcastic: 'Саркастика', wise: 'Мудреца', detective: 'Детектива'};
        this.speak(`Теперь я в режиме ${names[p] || 'Друга'}!`);
    },

    // Установка режима
    setMode: function(mode) {
        this.config.mode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (mode === 'game' && typeof games !== 'undefined') {
            games.start('guessNumber');
        }
    },

    // Вспомогательные методы
    setEmotion: function(emotion) {
        this.config.emotionalState = emotion;
        const emoji = this.emotions[emotion] || '😐';
        const badge = document.getElementById('moodBadge');
        if (badge) badge.textContent = emoji;
    },

    setStatus: function(text) {
        const el = document.getElementById('statusText');
        if (el) el.textContent = text;
    },

    applyTheme: function(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.add(theme + '-theme');
    },

    updateSettingsUI: function() {
        // Обновление активных кнопок в настройках
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.personality === this.config.personality);
        });
    },

    speak: function(text) {
        if (!text) return;
        this.addMessage(text, false);
        if (typeof voice !== 'undefined' && voice.speak) {
            voice.speak(text);
        }
    },

    addMessage: function(text, isUser) {
        const chat = document.getElementById('chat');
        if (!chat) return;
        
        const msg = document.createElement('div');
        msg.className = 'message ' + (isUser ? 'user' : 'bot');
        
        const time = new Date().toLocaleTimeString('ru', {hour: '2-digit', minute: '2-digit'});
        const emoji = isUser ? '' : (this.emotions[this.config.emotionalState] || '🤖');
        
        msg.innerHTML = isUser 
            ? `<div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`
            : `<span class="emoji">${emoji}</span><div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`;
        
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    showSystemMessage: function(text) {
        const chat = document.getElementById('chat');
        if (!chat) return;
        
        const msg = document.createElement('div');
        msg.className = 'message system';
        msg.style.cssText = 'text-align: center; color: #888; font-size: 12px; margin: 10px 0;';
        msg.textContent = text;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    },

    createParticles: function() {
        const container = document.getElementById('bgEffects');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 10 + 's';
            p.style.animationDuration = (10 + Math.random() * 10) + 's';
            container.appendChild(p);
        }
    }
};

// ГЛОБАЛЬНЫЕ ФУНКЦИИ для onclick (на всякий случай)
window.toggleTheme = function() { app.toggleTheme(); };
window.toggleSettings = function() { app.toggleSettings(); };
window.sendText = function() { app.sendText(); };
window.setPersonality = function(p) { app.setPersonality(p); };
window.setMode = function(m) { app.setMode(m); };

// Инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

console.log('[GLORT] Модуль загружен');
