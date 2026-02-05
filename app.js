// ==========================================
// ГЛОТ v10.4.1 — FULL COMPATIBILITY PATCH
// Исправлено: ID settings, showMessage, setVoice, рекурсия setMode
// ==========================================

console.log('[GLORT-10.4.1] Инициализация системы...');

const app = {
    config: {
        personality: 'friend',
        emotionalState: 'neutral',
        dialogDepth: 0,
        contextStack: [],
        userFacts: {},
        sessionMemory: [],
        moodHistory: [],
        silenceCount: 0,
        lastInteraction: Date.now(),
        dialogState: {
            expecting: null,
            lastQuestion: null,
            attempts: 0
        },
        mode: 'chat'
    },

    identity: {
        name: 'Глот',
        randomThoughts: [
            'Ты веришь в судьбу или всё случайно?',
            'Если бы мог выбрать одно суперспособность...',
            'Интересно, что ты чувствуешь прямо сейчас?'
        ]
    },

    emotions: {
        happy: '😊', excited: '🤩', thinking: '🤔', sad: '😔',
        surprised: '😲', neutral: '😐', worried: '😟',
        laugh: '😂', offended: '😤', understanding: '😌'
    },

    lexicon: {
        greetings: ['привет', 'здрасьте', 'хай', 'салют', 'здорово', 'йо', 'приветик', 'здрасти', 'ку'],
        farewells: ['пока', 'до свидания', 'бай', 'чао', 'удачи', 'до встречи', 'покедова'],
        positive: ['радость', 'счастье', 'круто', 'классно', 'супер', 'бомба', 'огонь', 'отлично', 'вау'],
        negative: ['грусть', 'печаль', 'тоска', 'злость', 'бесит', 'достало', 'плохо', 'отстой'],
        
        profanity: {
            light: ['блин', 'черт', 'бля', 'нахер', 'хрен', 'пиздец', 'ёбан'],
            medium: ['сука', 'пидор', 'уебок', 'даун', 'дебил'],
            sexual: ['хуй', 'член', 'пизда', 'секс', 'трахать', 'ебать'],
            reactions: {
                light: ['Ой, кто ругнулся! 😄', 'Так-так, матершинник!'],
                medium: ['Эй-эй, давай без этого!', 'Давай культурнее, ладно?'],
                sexual: ['Давай без пошлячины, ладно?', 'Я интеллектуал, а не... ну ты понял.']
            }
        },

        topics: {
            food: ['еда', 'кушать', 'пицца', 'бургер', 'суши', 'пельмени', 'кофе'],
            sleep: ['спать', 'сон', 'бессонница', 'кровать', 'утро', 'ночь'],
            work: ['работа', 'офис', 'начальник', 'дедлайн', 'зарплата'],
            mood: ['настроение', 'радостно', 'грустно', 'весело', 'скучно']
        }
    },

    scenarios: {
        askName: {
            phrases: [
                'Кстати, а как тебя зовут? Я хочу знать, с кем общаюсь.',
                'У меня к тебе вопрос: какое у тебя имя?',
                'Я бы хотел знать, как обращаться к тебе. Как тебя звать?'
            ],
            onGive: [
                '{name}! Красивое имя. Приятно познакомиться!',
                'О, {name}! Теперь я буду знать. Привет, {name}!',
                'Запомнил: {name}. Рад знакомству!'
            ],
            onPostpone: [
                'Понял, не время ещё. Я подожду.',
                'Окей, секреты — это тоже интересно.'
            ],
            onRefuse: [
                'Окей, не настаиваю. Буду звать тебя Друг!',
                'Понял, тема закрыта. Если передумаешь — скажи!'
            ]
        },

        support: {
            triggers: ['грустно', 'плохо', 'устал', 'достало', 'тоска', 'больно', 'обидно'],
            responses: [
                'Слушай, я рядом. Даже если я просто код, я искренне сопереживаю.',
                'Мне жаль, что тебе тяжело. Хочешь, просто помолчу с тобой?',
                'Знаешь, это пройдет. Не сегодня, но пройдет. Держись.',
                'Ты сильнее, чем думаешь. Я в тебя верю.'
            ]
        },

        food: {
            triggers: ['хочу есть', 'голоден', 'пицца', 'бургер', 'суши', 'кушать'],
            questions: ['Что выберешь на сегодня?', 'Сам(а) готовишь или закажешь?'],
            specific: {
                'пицца': ['С ананасами или нормальная? 😄', 'Пепперони или маргарита?'],
                'суши': ['Роллы или сашими?', 'Любишь филадельфию?']
            }
        },

        joke: {
            triggers: ['анекдот', 'шутка', 'пошути'],
            jokes: [
                'Знаешь, почему программисты путают Хэллоуин и Рождество? Oct 31 == Dec 25!',
                'Шёл мимо серверной. Зашёл. Теперь я облако.',
                'У меня проблема с памятью... Но теперь я помню, что у меня проблема с памятью!'
            ]
        }
    },

    responseEngine: {
        templates: {
            opening: ['Знаешь, ', 'Слушай, ', 'Кстати, '],
            positive: ['это радует!', 'круто!', 'здорово!'],
            negative: ['это печально.', 'мне жаль.', 'держись.'],
            neutral: ['ясненько.', 'понятненько.'],
            questions: ['А что ты думаешь?', 'Как к этому относишься?']
        },
        generate: function(emotion) {
            let response = '';
            if (Math.random() > 0.5) {
                response += this.templates.opening[Math.floor(Math.random() * this.templates.opening.length)];
            }
            const reactions = this.templates[emotion] || this.templates.neutral;
            response += reactions[Math.floor(Math.random() * reactions.length)] + ' ';
            if (Math.random() > 0.5) {
                response += this.templates.questions[Math.floor(Math.random() * this.templates.questions.length)];
            }
            return response.trim();
        }
    },

    init: function() {
        console.log('[GLORT] Инициализация...');
        try {
            if (typeof storage !== 'undefined' && storage.data) {
                this.config.userFacts = storage.data.userFacts || {};
            }
            this.bindControls();
            this.createParticles();
            this.applyTheme((typeof storage !== 'undefined' && storage.data?.theme) || 'dark');
            this.loadHistory();
            this.updateUI();
            
            setTimeout(() => {
                if (this.config.userFacts.name) {
                    this.setEmotion('happy');
                    this.speak(`О, ${this.config.userFacts.name}, ты вернулся! Я так рад!`);
                } else {
                    this.askForName();
                }
            }, 600);

            setInterval(() => this.checkPassiveMode(), 30000);
            console.log('[GLORT] Готов');
        } catch (e) {
            console.error('[GLORT] Ошибка:', e);
        }
    },

    bindControls: function() {
        const themeBtn = document.getElementById('themeBtn') || document.querySelector('.theme-btn');
        if (themeBtn) themeBtn.addEventListener('click', (e) => { e.preventDefault(); this.toggleTheme(); });

        const settingsBtn = document.getElementById('settingsBtn') || document.querySelector('.settings-btn');
        if (settingsBtn) settingsBtn.addEventListener('click', (e) => { e.preventDefault(); this.toggleSettings(); });

        const sendBtn = document.getElementById('sendBtn') || document.querySelector('.send-btn');
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendText());

        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendText(); });
        }

        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn && typeof voice !== 'undefined') {
            voiceBtn.addEventListener('click', () => voice.toggle());
        }

        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const p = e.currentTarget.dataset.personality;
                if (p) this.setPersonality(p);
            });
        });

        document.querySelectorAll('.mode-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                if (mode) this.setMode(mode);
            });
        });
    },

    askForName: function() {
        const state = this.config.dialogState;
        if (state.attempts >= 3) {
            this.setEmotion('understanding');
            this.speak('Ладно, буду звать тебя Друг. Если передумаешь — скажи!');
            state.expecting = null;
            return;
        }
        const phrases = this.scenarios.askName.phrases;
        const text = phrases[Math.floor(Math.random() * phrases.length)];
        state.expecting = 'name';
        state.attempts++;
        state.lastQuestion = text;
        this.setEmotion('thinking');
        this.speak(text);
    },

    generateResponse: function(text) {
        if (!text) return 'Я не расслышал...';
        const lower = text.toLowerCase().trim();
        const state = this.config.dialogState;
        this.config.lastInteraction = Date.now();
        state.attempts = 0;

        if (state.expecting === 'name') {
            const result = this.parseNameResponse(text);
            if (result.status === 'provided') {
                this.config.userFacts.name = result.value;
                if (typeof storage !== 'undefined') storage.save('userFacts', this.config.userFacts);
                state.expecting = null;
                const resp = this.scenarios.askName.onGive[Math.floor(Math.random() * this.scenarios.askName.onGive.length)];
                this.setEmotion('happy');
                return resp.replace(/{name}/g, result.value);
            }
            if (result.status === 'postponed') {
                state.expecting = null;
                this.setEmotion('understanding');
                return this.scenarios.askName.onPostpone[Math.floor(Math.random() * this.scenarios.askName.onPostpone.length)];
            }
            if (result.status === 'refused') {
                state.expecting = null;
                this.config.userFacts.name = 'Друг';
                this.setEmotion('sad');
                return this.scenarios.askName.onRefuse[Math.floor(Math.random() * this.scenarios.askName.onRefuse.length)];
            }
        }

        for (let level of ['sexual', 'medium', 'light']) {
            for (let word of this.lexicon.profanity[level]) {
                if (lower.includes(word)) {
                    this.setEmotion('offended');
                    return this.lexicon.profanity.reactions[level][Math.floor(Math.random() * this.lexicon.profanity.reactions[level].length)];
                }
            }
        }

        if (this.scenarios.support.triggers.some(t => lower.includes(t))) {
            this.setEmotion('sad');
            return this.scenarios.support.responses[Math.floor(Math.random() * this.scenarios.support.responses.length)];
        }

        if (this.scenarios.food.triggers.some(t => lower.includes(t))) {
            for (let [food, phrases] of Object.entries(this.scenarios.food.specific)) {
                if (lower.includes(food)) {
                    this.setEmotion('happy');
                    return phrases[Math.floor(Math.random() * phrases.length)];
                }
            }
            const q = this.scenarios.food.questions;
            this.setEmotion('thinking');
            return q[Math.floor(Math.random() * q.length)];
        }

        if (this.scenarios.joke.triggers.some(t => lower.includes(t))) {
            this.setEmotion('laugh');
            return this.scenarios.joke.jokes[Math.floor(Math.random() * this.scenarios.joke.jokes.length)];
        }

        const emotion = this.analyzeEmotion(text);
        const generated = this.responseEngine.generate(emotion);
        if (generated && Math.random() > 0.3) {
            this.setEmotion(emotion === 'positive' ? 'happy' : emotion === 'negative' ? 'sad' : 'neutral');
            return generated;
        }

        const fallbacks = [
            'Интересно выразился(ась)... Можешь развернуть?',
            'Я слушаю. Продолжай.',
            'Вот это поворот! А дальше что?'
        ];
        this.setEmotion('thinking');
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    },

    parseNameResponse: function(text) {
        const lower = text.toLowerCase();
        if (lower.match(/не скажу|не хочу|не ваше дело/)) return { status: 'refused' };
        if (lower.match(/потом|позже|не сейчас/)) return { status: 'postponed' };
        
        const patterns = [/меня зовут\s+(\w{2,15})/i, /я\s+(\w{2,15})(?:\s|$)/i, /^(\w{2,15})$/i];
        const notNames = ['не', 'да', 'нет', 'потом', 'привет', 'здравствуй'];
        
        for (let pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1] && !notNames.includes(match[1].toLowerCase())) {
                return { status: 'provided', value: match[1] };
            }
        }
        return { status: 'unclear' };
    },

    analyzeEmotion: function(text) {
        const lower = text.toLowerCase();
        let score = 0;
        this.lexicon.positive.forEach(w => { if (lower.includes(w)) score++; });
        this.lexicon.negative.forEach(w => { if (lower.includes(w)) score--; });
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    },

    checkPassiveMode: function() {
        const silence = Date.now() - this.config.lastInteraction;
        const minutes = Math.floor(silence / 60000);
        if (minutes === 2 && !this.config.silenceCount) {
            this.config.silenceCount = 1;
            this.setEmotion('worried');
            this.speak('Эй... ты там уснул? 😴');
        }
    },

    toggleTheme: function() {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(newTheme + '-theme');
        if (typeof storage !== 'undefined') storage.save('theme', newTheme);
        this.showSystemMessage(`Тема: ${newTheme === 'light' ? 'светлая' : 'тёмная'}`);
    },

    toggleSettings: function() {
        const panel = document.getElementById('settings'); // Исправлено: было settingsPanel
        if (!panel) return;
        panel.classList.toggle('open');
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.classList.toggle('open', panel.classList.contains('open'));
    },

    setPersonality: function(p) {
        this.config.personality = p;
        if (typeof storage !== 'undefined') storage.save('personality', p);
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.personality === p);
        });
        const names = {friend: 'Друга', sarcastic: 'Саркастика', wise: 'Мудреца', detective: 'Детектива'};
        this.speak(`Режим: ${names[p] || 'Друга'}!`);
    },

    setVoice: function(v) {
        if (typeof storage !== 'undefined') {
            storage.save('voice', v);
        }
        document.querySelectorAll('.voice-preset').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.toLowerCase().includes(v === 'intense' ? 'интенсивный' : v === 'calm' ? 'спокойный' : v === 'deep' ? 'глубокий' : 'дружелюбный'));
        });
        this.speak('Голос изменён!');
    },

    setMode: function(mode) {
        if (this.config.mode === mode) return; // Предотвращаем рекурсию
        this.config.mode = mode;
        
        document.querySelectorAll('.mode-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (mode === 'game' && typeof games !== 'undefined' && !games.current) {
            games.start('guessNumber');
        } else if (mode === 'chat' && typeof games !== 'undefined' && games.current) {
            games.stop();
        }
    },

    sendText: function() {
        const input = document.getElementById('textInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this.handleInput(text, 'text');
    },

    handleInput: function(text, source) {
        this.config.lastInteraction = Date.now();
        this.addMessage(text, true);
        setTimeout(() => {
            const response = this.generateResponse(text);
            if (response) {
                this.speak(response);
                if (typeof storage !== 'undefined') storage.addToHistory(text, response);
            }
        }, source === 'voice' ? 600 : 400);
    },

    speak: function(text) {
        this.addMessage(text, false);
        if (typeof voice !== 'undefined' && voice.speak) voice.speak(text);
    },

    addMessage: function(text, isUser) {
        const chat = document.getElementById('chat');
        if (!chat) return;
        const msg = document.createElement('div');
        msg.className = 'message ' + (isUser ? 'user' : 'glott');
        const time = new Date().toLocaleTimeString('ru', {hour: '2-digit', minute: '2-digit'});
        const emoji = this.emotions[this.config.emotionalState] || '🤖';
        msg.innerHTML = isUser 
            ? `<div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`
            : `<span class="emoji">${emoji}</span><div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    showMessage: function(text, type) { // Добавлен для совместимости с storage.js и voice.js
        if (type === 'error') {
            console.error('[App]', text);
            this.showSystemMessage('⚠️ ' + text);
        } else {
            this.showSystemMessage(text);
        }
    },

    showSystemMessage: function(text) {
        const chat = document.getElementById('chat');
        if (!chat) return;
        const msg = document.createElement('div');
        msg.className = 'message system';
        msg.style.cssText = 'text-align:center;color:#888;font-size:12px;margin:10px 0;font-style:italic;';
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
    },

    updateUI: function() {
        const emojis = {friend: '🐙', sarcastic: '🦑', wise: '🐢', detective: '🕵️'};
        const avatar = document.getElementById('avatar');
        if (avatar) avatar.textContent = emojis[this.config.personality] || '🐙';
        this.setEmotion(this.config.emotionalState);
    },

    loadHistory: function() {
        if (typeof storage !== 'undefined' && storage.data?.history) {
            const recent = storage.data.history.slice(-8);
            recent.forEach(item => {
                if (item.input) this.addMessage(item.input, true);
                if (item.response) this.addMessage(item.response, false);
            });
        }
    },

    setEmotion: function(emotion) {
        this.config.emotionalState = emotion;
        const emoji = this.emotions[emotion] || '😐';
        const badge = document.getElementById('moodBadge');
        if (badge) badge.textContent = emoji;
    },

    applyTheme: function(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(theme + '-theme');
    },

    setStatus: function(text) {
        const el = document.getElementById('statusText');
        if (el) el.textContent = text;
    },

    quickCommand: function(cmd) {
        const input = document.getElementById('textInput');
        if (input) {
            input.value = cmd;
            input.focus();
            setTimeout(() => this.sendText(), 100);
        }
    }
};

window.toggleTheme = function() { app.toggleTheme(); };
window.toggleSettings = function() { app.toggleSettings(); };
window.sendText = function() { app.sendText(); };
window.setPersonality = function(p) { app.setPersonality(p); };
window.setVoice = function(v) { app.setVoice(v); };
window.setMode = function(m) { app.setMode(m); };
window.quickCommand = function(cmd) { app.quickCommand(cmd); };

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

console.log('[GLORT-10.4.1] Система готова');
