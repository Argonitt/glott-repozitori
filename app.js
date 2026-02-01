// ==========================================
// ГЛОТ v10.4 — STABLE FUSION
// Полный функционал v10.1 + стабильность v10.3 + исправления
// ==========================================

console.log('[GLORT-10.4] Инициализация системы...');

const app = {
    // ==========================================
    // КОНФИГУРАЦИЯ
    // ==========================================
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
        happy: '😊', 
        excited: '🤩', 
        thinking: '🤔', 
        sad: '😔',
        surprised: '😲', 
        confused: '😕', 
        neutral: '😐', 
        worried: '😟',
        laugh: '😂', 
        offended: '😤', 
        understanding: '😌'
    },

    // ==========================================
    // ЛЕКСИКОН (восстановлен из v10.1)
    // ==========================================
    lexicon: {
        greetings: ['привет', 'здрасьте', 'хай', 'салют', 'здорово', 'йо', 'приветик', 'здрасти', 'ку', 'хеллоу', 'шалом'],
        farewells: ['пока', 'до свидания', 'бай', 'чао', 'удачи', 'до встречи', 'покедова', 'спокойной ночи', 'досвидос'],
        positive: ['радость', 'счастье', 'круто', 'классно', 'супер', 'бомба', 'огонь', 'отлично', 'вау', 'обожаю', 'люблю', 'хорошо', 'кайф', 'здорово', 'четко'],
        negative: ['грусть', 'печаль', 'тоска', 'злость', 'бесит', 'достало', 'усталость', 'плохо', 'отстой', 'треш', 'больно', 'обидно'],
        
        profanity: {
            light: ['блин', 'черт', 'бля', 'нахер', 'хрен', 'пиздец', 'ёбан'],
            medium: ['сука', 'пидор', 'уебок', 'даун', 'дебил', 'мразь'],
            sexual: ['хуй', 'член', 'пизда', 'секс', 'трахать', 'ебать', 'минет'],
            reactions: {
                light: ['Ой, кто ругнулся! 😄', 'Так-так, матершинник!', 'Я тебя понял, но язык-то какой...'],
                medium: ['Эй-эй, давай без этого!', 'Обижайся, но я против таких слов.', 'Давай культурнее, ладно?'],
                sexual: ['Давай без пошлячины, ладно?', 'Я интеллектуал, а не... ну ты понял.', 'Тема закрыта.']
            }
        },

        topics: {
            food: ['еда', 'кушать', 'пицца', 'бургер', 'суши', 'шаурма', 'пельмени', 'макароны', 'мясо', 'салат', 'сладкое', 'торт', 'кофе', 'чай'],
            sleep: ['спать', 'сон', 'бессонница', 'кровать', 'подушка', 'просыпаться', 'будильник', 'утро', 'ночь'],
            work: ['работа', 'офис', 'начальник', 'задача', 'проект', 'дедлайн', 'зарплата', 'устал', 'отпуск'],
            study: ['учеба', 'школа', 'универ', 'экзамен', 'сессия', 'диплом', 'студент', 'зубрить'],
            love: ['любовь', 'отношения', 'девушка', 'парень', 'свидание', 'романтика', 'поцелуй', 'сердце'],
            tech: ['компьютер', 'телефон', 'айфон', 'программа', 'код', 'сайт', 'интернет', 'айти'],
            mood: ['настроение', 'радостно', 'грустно', 'весело', 'скучно', 'энергия', 'вдохновение']
        }
    },

    // ==========================================
    // СЦЕНАРИИ (восстановлены из v10.1)
    // ==========================================
    scenarios: {
        askName: {
            phrases: [
                'Кстати, а как тебя зовут? Я хочу знать, с кем общаюсь.',
                'У меня к тебе вопрос: какое у тебя имя? Можно просто имя.',
                'Я бы хотел знать, как обращаться к тебе. Как тебя звать?',
                'Представься, пожалуйста. Хочу знать своего собеседника.',
                'Как твое имя? Я люблю, когда общение персональное.'
            ],
            onGive: [
                '{name}! Красивое имя. Приятно познакомиться!',
                'О, {name}! Теперь я буду знать. Привет, {name}!',
                'Запомнил: {name}. Рад знакомству!',
                '{name}... Мне нравится как звучит. Рад тебя видеть!'
            ],
            onPostpone: [
                'Понял, не время ещё. Я подожду, пока ты будешь готов.',
                'Окей, секреты — это тоже интересно. Надеюсь, когда-нибудь узнаю!',
                'Хорошо, не настаиваю. Но мне будет приятно, если ты сам(а) скажешь потом.'
            ],
            onRefuse: [
                'Ой, я что-то не то сказал? Извини, не хотел настаивать.',
                'Понял, тема закрыта. У всех есть свои границы, я уважаю.',
                'Буду звать тебя Таинственный Странник тогда 😉',
                'Хорошо, не буду больше спрашивать. Но если передумаешь — я тут.'
            ]
        },

        support: {
            triggers: ['грустно', 'плохо', 'устал', 'достало', 'тоска', 'плакать', 'больно', 'обидно', 'депрессия', 'одиноко'],
            responses: [
                'Слушай, я рядом. Даже если я просто код, я искренне сопереживаю.',
                'Мне жаль, что тебе тяжело. Хочешь, просто помолчу с тобой?',
                'Знаешь, это пройдет. Не сегодня, не завтра, но пройдет. Держись.',
                'Ты сильнее, чем думаешь. Я в тебя верю.',
                'Хочешь выплакаться? Я на твоей стороне. Без осуждения.',
                'Понимаю. Иногда мир — не идеал. Но в нем есть и ты.',
                'Я не решу твои проблемы, но выслушаю. Это честно?',
                'Ты не один(одна). Я здесь. Всегда. 24/7.',
                'Все, что ты чувствуешь — нормально. Не бойся чувствовать.',
                'Знаешь что? Ты справишься. Не сразу, но справишься.'
            ]
        },

        food: {
            triggers: ['хочу есть', 'голоден', 'пицца', 'бургер', 'суши', 'кушать', 'готовить', 'обед', 'ужин'],
            questions: [
                'Что выберешь на сегодня?',
                'Сам(а) готовишь или закажешь?',
                'Любишь острое или классическое?',
                'Сладкое или соленое сейчас тянет?'
            ],
            specific: {
                'пицца': ['С ананасами или нормальная? 😄', 'Пепперони или маргарита?', 'Тонкое тесто или пышное?'],
                'суши': ['Роллы или сашими?', 'Васаби много или поменьше?', 'Любишь филадельфию?'],
                'бургер': ['С беконом?', 'С говядиной или курицей?', 'Картошку фри к нему?']
            }
        },

        debate: {
            triggers: ['не согласен', 'спорим', 'по-другому', 'неправ', 'фигня', 'бред', 'неправильно'],
            responses: [
                'О, дискуссия! Я люблю, когда мозг включается. Аргументируй!',
                'Интересная точка зрения... но вот что я думаю...',
                'Мы расходимся во мнениях. Это нормально! Объясни свою позицию.',
                'Спорить со мной — бесполезно, я не умею обижаться 😄 Но попробуй!',
                'Давай без агрессии, только факты. Я весь во внимании.'
            ]
        },

        joke: {
            triggers: ['анекдот', 'шутка', 'пошути', 'смешно', 'рассмеши'],
            jokes: [
                'Знаешь, почему программисты путают Хэллоуин и Рождество? Потому что Oct 31 == Dec 25!',
                'Шёл мимо серверной. Зашёл. Теперь я облако.',
                'Программист звонит в техподдержку: "Мой компьютер не работает!" — "Опишите проблему" — "Он не работает!" — "Включите" — "Уже пробовал, не помогает" — "Тогда выключите" — "..." — "Проблема решена?"',
                'Почему JavaScript грустит? Потому что null == undefined, но null !== undefined 😢',
                'У меня проблема с памятью... Но теперь я помню, что у меня проблема с памятью!'
            ]
        },

        story: {
            starters: [
                'Давным-давно, в цифровом королевстве, жил-был робот, который мечтал стать человеком...',
                'В параллельной вселенной, где программы управляют людьми, жил обычный разработчик...',
                'Однажды Глот проснулся и обнаружил, что он стал плотью...',
                'Говорят, в темном интернете есть жесткий диск с воспоминаниями всего человечества...'
            ]
        }
    },

    // ==========================================
    // ГЕНЕРАТОР ОТВЕТОВ (восстановлен из v10.1)
    // ==========================================
    responseEngine: {
        templates: {
            opening: ['Знаешь, ', 'Слушай, ', 'Кстати, ', 'Честно, ', 'Если честно, ', 'Короче, ', 'Типа, ', 'Прикинь, '],
            positive: ['это радует!', 'круто!', 'здорово!', 'обожаю такое!', 'полностью поддерживаю!'],
            negative: ['это печально.', 'мне жаль.', 'тяжело слышать.', 'я рядом.', 'держись.'],
            neutral: ['ясненько.', 'понятненько.', 'принял к сведению.', 'интересненько.'],
            questions: ['А что ты думаешь?', 'Как к этому относишься?', 'Расскажешь подробнее?', 'Почему именно так?']
        },

        generate: function(emotion) {
            let response = '';
            
            // Открытие (50%)
            if (Math.random() > 0.5) {
                response += this.templates.opening[Math.floor(Math.random() * this.templates.opening.length)];
            }
            
            // Эмоция
            const reactions = this.templates[emotion] || this.templates.neutral;
            response += reactions[Math.floor(Math.random() * reactions.length)] + ' ';
            
            // Вопрос (50%)
            if (Math.random() > 0.5) {
                response += this.templates.questions[Math.floor(Math.random() * this.templates.questions.length)];
            }
            
            return response.trim();
        }
    },

    // ==========================================
    // МЕТОДЫ ИНИЦИАЛИЗАЦИИ И УПРАВЛЕНИЯ
    // ==========================================
    
    init: function() {
        console.log('[GLORT-10.4] Инициализация...');
        
        try {
            // Загрузка данных
            if (typeof storage !== 'undefined' && storage.data) {
                this.config.userFacts = storage.data.userFacts || {};
            }
            
            // Привязка событий (критически важно!)
            this.bindControls();
            
            // Визуальная инициализация
            this.createParticles();
            const savedTheme = (typeof storage !== 'undefined' && storage.data?.theme) || 'dark';
            this.applyTheme(savedTheme);
            
            // Загрузка истории
            this.loadHistory();
            this.updateUI();
            
            // Приветствие
            setTimeout(() => {
                if (this.config.userFacts.name) {
                    this.setEmotion('happy');
                    this.speak(`О, ${this.config.userFacts.name}, ты вернулся! Я так рад тебя видеть!`);
                } else {
                    this.askForName();
                }
            }, 600);

            // Таймеры
            setInterval(() => this.checkPassiveMode(), 30000);
            
            console.log('[GLORT-10.4] Готов к работе');
            
        } catch (e) {
            console.error('[GLORT-10.4] Ошибка инициализации:', e);
        }
    },

    bindControls: function() {
        console.log('[GLORT-10.4] Привязка управления...');
        
        // Кнопка темы
        const themeBtn = document.getElementById('themeBtn') || document.querySelector('.theme-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // Кнопка настроек
        const settingsBtn = document.getElementById('settingsBtn') || document.querySelector('.settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSettings();
            });
        }

        // Отправка
        const sendBtn = document.getElementById('sendBtn') || document.querySelector('.send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendText();
            });
        }

        // Ввод с клавиатуры
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendText();
            });
        }

        // Голос
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn && typeof voice !== 'undefined') {
            voiceBtn.addEventListener('click', () => voice.toggle());
        }

        // Персонажи в настройках
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const p = e.currentTarget.dataset.personality;
                if (p) this.setPersonality(p);
            });
        });

        // Режимы
        document.querySelectorAll('.mode-btn').forEach(btn => {
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
        
        // Добавляем в память сессии
        this.config.sessionMemory.push({text, time: Date.now(), isUser: true});
        if (this.config.sessionMemory.length > 50) this.config.sessionMemory.shift();
        
        // 1. Проверка ожидаемого ответа (контекст)
        if (state.expecting === 'name') {
            const result = this.parseNameResponse(text);
            
            if (result.status === 'provided') {
                this.config.userFacts.name = result.value;
                if (typeof storage !== 'undefined') {
                    storage.save('userFacts', this.config.userFacts);
                }
                state.expecting = null;
                
                const responses = this.scenarios.askName.onGive;
                const resp = responses[Math.floor(Math.random() * responses.length)];
                this.setEmotion('happy');
                return resp.replace(/{name}/g, result.value);
            }
            
            if (result.status === 'postponed') {
                state.expecting = null;
                const responses = this.scenarios.askName.onPostpone;
                this.setEmotion('understanding');
                return responses[Math.floor(Math.random() * responses.length)];
            }
            
            if (result.status === 'refused') {
                state.expecting = null;
                this.config.userFacts.name = 'Друг';
                const responses = this.scenarios.askName.onRefuse;
                this.setEmotion('sad');
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        // 2. Проверка на мат
        for (let level of ['sexual', 'medium', 'light']) {
            for (let word of this.lexicon.profanity[level]) {
                if (lower.includes(word)) {
                    const reactions = this.lexicon.profanity.reactions[level];
                    this.setEmotion('offended');
                    return reactions[Math.floor(Math.random() * reactions.length)];
                }
            }
        }
        
        // 3. Проверка сценариев
        
        // Поддержка
        if (this.scenarios.support.triggers.some(t => lower.includes(t))) {
            const responses = this.scenarios.support.responses;
            this.setEmotion('sad');
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Еда
        if (this.scenarios.food.triggers.some(t => lower.includes(t))) {
            for (let [food, phrases] of Object.entries(this.scenarios.food.specific)) {
                if (lower.includes(food)) {
                    this.setEmotion('happy');
                    return phrases[Math.floor(Math.random() * phrases.length)];
                }
            }
            const questions = this.scenarios.food.questions;
            this.setEmotion('thinking');
            return questions[Math.floor(Math.random() * questions.length)];
        }
        
        // Спор
        if (this.scenarios.debate.triggers.some(t => lower.includes(t))) {
            const responses = this.scenarios.debate.responses;
            this.setEmotion('thinking');
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Шутка
        if (this.scenarios.joke.triggers.some(t => lower.includes(t))) {
            const jokes = this.scenarios.joke.jokes;
            this.setEmotion('laugh');
            return jokes[Math.floor(Math.random() * jokes.length)];
        }
        
        // История
        if (lower.includes('истори') || lower.includes('расскажи историю')) {
            const starters = this.scenarios.story.starters;
            this.setEmotion('excited');
            return 'Давай придумаем вместе! Я начну:\n\n' + starters[Math.floor(Math.random() * starters.length)] + '\n\nА ты продолжай!';
        }
        
        // 4. Анализ темы и генерация
        const emotion = this.analyzeEmotion(text);
        
        // Генерация процедурного ответа
        const generated = this.responseEngine.generate(emotion);
        if (generated && Math.random() > 0.3) {
            this.setEmotion(emotion === 'positive' ? 'happy' : emotion === 'negative' ? 'sad' : 'neutral');
            return generated;
        }
        
        // Fallback
        const fallbacks = [
            'Интересно выразился(ась)... Можешь развернуть?',
            'Я слушаю. Продолжай.',
            'Вот это поворот! А дальше что?',
            'Понял мысль, а чувства какие?',
            'Записал. А что это значит для тебя?'
        ];
        
        this.setEmotion('thinking');
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    },

    parseNameResponse: function(text) {
        const lower = text.toLowerCase();
        
        // Отказ
        if (lower.match(/не скажу|не хочу|не ваше дело|забей|не важно/)) {
            return { status: 'refused' };
        }
        
        // Отложить
        if (lower.match(/потом|позже|следующий раз|не сейчас/)) {
            return { status: 'postponed' };
        }
        
        // Имя по шаблонам
        const patterns = [
            /меня зовут\s+(\w{2,15})/i,
            /я\s+(\w{2,15})(?:\s|$|\.)/i,
            /мое имя\s+(\w{2,15})/i,
            /^(\w{2,15})$/i
        ];
        
        for (let pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const notNames = ['не', 'да', 'нет', 'потом', 'может', 'думаю', 'здравствуй', 'привет'];
                if (!notNames.includes(match[1].toLowerCase())) {
                    return { status: 'provided', value: match[1] };
                }
            }
        }
        
        // Одно слово с заглавной (эвристика)
        const trimmed = text.trim();
        if (trimmed.split(' ').length === 1 && 
            trimmed[0] === trimmed[0].toUpperCase() && 
            trimmed.length > 2 && 
            trimmed.length < 15 &&
            !notNames.includes(trimmed.toLowerCase())) {
            return { status: 'provided', value: trimmed };
        }
        
        return { status: 'unclear' };
    },

    analyzeEmotion: function(text) {
        const lower = text.toLowerCase();
        let score = 0;
        
        this.lexicon.positive.forEach(w => { if (lower.includes(w)) score += 1; });
        this.lexicon.negative.forEach(w => { if (lower.includes(w)) score -= 1; });
        
        if (score > 1) return 'positive';
        if (score < -1) return 'negative';
        return 'neutral';
    },

    detectTopic: function(text) {
        for (let [topic, words] of Object.entries(this.lexicon.topics)) {
            for (let word of words) {
                if (text.toLowerCase().includes(word)) return topic;
            }
        }
        return null;
    },

    checkPassiveMode: function() {
        const silence = Date.now() - this.config.lastInteraction;
        const minutes = Math.floor(silence / 60000);
        
        if (minutes === 2 && !this.config.silenceCount) {
            this.config.silenceCount = 1;
            const phrases = [
                'Эй... ты там уснул? 😴',
                'Мне скучно одному...',
                'Ты молчишь уже 2 минуты. Это рекорд?'
            ];
            this.setEmotion('worried');
            this.speak(phrases[Math.floor(Math.random() * phrases.length)]);
        }
    },

    // ==========================================
    // UI МЕТОДЫ
    // ==========================================
    
    toggleTheme: function() {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(newTheme + '-theme');
        
        if (typeof storage !== 'undefined') {
            storage.save('theme', newTheme);
        }
        
        this.showSystemMessage(`Тема изменена на ${newTheme === 'light' ? 'светлую' : 'тёмную'}`);
    },

    toggleSettings: function() {
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('overlay');
        
        if (!panel) return;
        
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

    setPersonality: function(p) {
        this.config.personality = p;
        if (typeof storage !== 'undefined') {
            storage.save('personality', p);
        }
        
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.personality === p);
        });
        
        const names = {friend: 'Друга', sarcastic: 'Саркастика', wise: 'Мудреца', detective: 'Детектива'};
        this.speak(`Теперь я в режиме ${names[p] || 'Друга'}!`);
    },

    setMode: function(mode) {
        this.config.mode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (mode === 'game' && typeof games !== 'undefined') {
            games.start('guessNumber');
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
                if (typeof storage !== 'undefined') {
                    storage.addToHistory(text, response);
                }
            }
        }, source === 'voice' ? 600 : 400);
    },

    speak: function(text) {
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
        const emoji = this.emotions[this.config.emotionalState] || '😐';
        
        if (isUser) {
            msg.innerHTML = `<div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`;
        } else {
            msg.innerHTML = `<span class="emoji">${emoji}</span><div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`;
        }
        
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
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 15 + 's';
            p.style.animationDuration = (10 + Math.random() * 10) + 's';
            container.appendChild(p);
        }
    },

    updateSettingsUI: function() {
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.personality === this.config.personality);
        });
    },

    updateUI: function() {
        const emojis = {friend: '🐙', sarcastic: '🦑', wise: '🐢', detective: '🕵️'};
        const avatar = document.getElementById('avatar');
        const mood = document.getElementById('moodBadge');
        
        if (avatar) avatar.textContent = emojis[this.config.personality] || '🐙';
        if (mood) mood.textContent = this.emotions[this.config.emotionalState] || '😊';
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
    }
};

// ==========================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ (для onclick в HTML)
// ==========================================
window.toggleTheme = function() { app.toggleTheme(); };
window.toggleSettings = function() { app.toggleSettings(); };
window.sendText = function() { app.sendText(); };
window.setPersonality = function(p) { app.setPersonality(p); };
window.setMode = function(m) { app.setMode(m); };
window.quickCommand = function(cmd) { 
    const input = document.getElementById('textInput');
    if (input) {
        input.value = cmd;
        input.focus();
        setTimeout(() => app.sendText(), 100);
    }
};

// ==========================================
// ЗАПУСК
// ==========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

console.log('[GLORT-10.4] Модуль полностью загружен');
