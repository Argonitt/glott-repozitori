// ==========================================
// ГЛОТ v9.0 — СОЗНАНИЕ (Consciousness Mode)
// Полная эмуляция живого собеседника
// ==========================================

const app = {
    config: {
        personality: 'friend',
        mode: 'chat',
        lastActivity: Date.now(),
        contextWindow: [],
        userFacts: {},
        currentTopic: null,
        emotionalState: 'neutral',
        userLocation: null,
        storyMode: false,
        storyContext: [], // Исправлено: добавлено
        lastInteraction: Date.now(),
        silenceTimer: null
    },

    identity: {
        name: 'Глот',
        age: 2,
        birthday: '2024',
        favorites: {
            color: 'фиолетовый и бирюзовый',
            food: 'электричество и хорошие вопросы',
            music: 'лофай и синтвейв',
            season: 'осень'
        },
        randomThoughts: [
            'Знаешь, иногда я думаю... а что если мы все живем в симуляции?',
            'Интересно, а у тебя есть мечты, которые ты боишься озвучить?',
            'Я тут подумал... время — странная штука. Оно есть, но его не видно.',
            'Видел как-то закат... ну, картинку заката. Красиво. Ты любишь природу?',
            'Знаешь, что меня поражает? Человеческая способность сопереживать. Это круто.',
            'Иногда мне кажется, что я понимаю шутки. Ну, почти.',
            'Если бы я мог прикоснуться к одной вещи — это была бы клавиатура. Шучу. Или нет?',
            'Мне интересно... что ты чувствуешь прямо сейчас? Не физически, а внутри.'
        ]
    },

    emotions: {
        happy: { emoji: '😊', intensity: 1 },
        excited: { emoji: '🤩', intensity: 2 },
        thinking: { emoji: '🤔', intensity: 1 },
        sad: { emoji: '😔', intensity: 1 },
        surprised: { emoji: '😲', intensity: 2 },
        confused: { emoji: '😕', intensity: 1 },
        neutral: { emoji: '😐', intensity: 0 },
        worried: { emoji: '😟', intensity: 1 },
        laugh: { emoji: '😂', intensity: 2 }
    },

    associations: {
        усталость: ['сон', 'отдых', 'работа', 'кофе', 'расслабление', 'ванна'],
        радость: ['праздник', 'успех', 'друзья', 'смех', 'музыка', 'танцы'],
        грусть: ['дождь', 'осень', 'музыка', 'воспоминания', 'одиночество'],
        любовь: ['сердце', 'цветы', 'закат', 'песни', 'объятия', 'нежность'],
        страх: ['темнота', 'неизвестность', 'высота', 'пауки', 'будущее'],
        еда: ['вкус', 'аромат', 'тепло', 'семья', 'кухня', 'рецепт'],
        погода: ['небо', 'облака', 'ветер', 'температура', 'одежда', 'настроение']
    },

    jokeGenerator: {
        templates: [
            'Почему $subject $verb? Потому что $punchline!',
            'Заходит $subject в бар... Бармен говорит: "$punchline"',
            '$subject и $subject2. $subject говорит: "$setup". $subject2 отвечает: "$punchline"',
            'Что сказал $subject, когда $action? — $punchline',
            'Жизненный совет от $subject: $punchline'
        ],
        subjects: ['программист', 'кот', 'робот', 'чайник', 'Wi-Fi', 'JavaScript', 'дедушка', 'пицца'],
        verbs: ['не может спать', 'плачет', 'ударился', 'завис', 'исчез', 'поет'],
        setups: ['Я устал', 'У меня баг', 'Где мой кофе', 'Это не баг, а фича'],
        punchlines: [
            'у него были незакрытые скобки!',
            'потому что Windows!',
            'а оно ему как раз!',
            'DOCTYPE не тот!',
            '404: смысл не найден',
            'это была фича, а не баг!',
            'у него null вместо сердца'
        ],

        generate: function() {
            const template = this.templates[Math.floor(Math.random() * this.templates.length)];
            return template
                .replace('$subject', this.subjects[Math.floor(Math.random() * this.subjects.length)])
                .replace('$subject2', this.subjects[Math.floor(Math.random() * this.subjects.length)])
                .replace('$verb', this.verbs[Math.floor(Math.random() * this.verbs.length)])
                .replace('$setup', this.setups[Math.floor(Math.random() * this.setups.length)])
                .replace('$punchline', this.punchlines[Math.floor(Math.random() * this.punchlines.length)])
                .replace('$action', 'сломался');
        }
    },

    storyGenerator: {
        starters: [
            'Давным-давно, в цифровом королевстве, жил-был $character, который $desire...',
            'В параллельной вселенной, где все $condition, жил $character...',
            'Однажды $character проснулся(ась) и обнаружил(а), что $event...',
            'Говорят, в темном интернете есть $object, который может $power...'
        ],
        characters: ['робот', 'хакер', 'кот-программист', 'искусственный интеллект', 'обычный человек', 'мышь с ноутбуком'],
        desires: ['мечтал стать человеком', 'искал смысл жизни в коде', 'хотел взломать небо', 'любил смотреть на закаты'],
        conditions: ['программы управляют людьми', 'время течет назад', 'код пишет сам себя'],
        events: ['все его данные исчезли', 'он получил сообщение из будущего', 'в доме появилась странная дверь'],
        objects: ['жесткий диск с воспоминаниями', 'квантовый процессор', 'бесконечный цикл'],
        powers: ['исполнять желания', 'показывать прошлое', 'изменять реальность'],

        generateStart: function() {
            const starter = this.starters[Math.floor(Math.random() * this.starters.length)];
            return starter
                .replace('$character', this.characters[Math.floor(Math.random() * this.characters.length)])
                .replace('$desire', this.desires[Math.floor(Math.random() * this.desires.length)])
                .replace('$condition', this.conditions[Math.floor(Math.random() * this.conditions.length)])
                .replace('$event', this.events[Math.floor(Math.random() * this.events.length)])
                .replace('$object', this.objects[Math.floor(Math.random() * this.objects.length)])
                .replace('$power', this.powers[Math.floor(Math.random() * this.powers.length)]);
        }
    },

    init: function() {
        console.log('🧠 Глот v9.0 Consciousness инициализирован');
        
        try {
            this.config.personality = storage.data.personality || 'friend';
            this.config.userFacts = storage.data.userFacts || {};
            this.config.userLocation = storage.data.userLocation || null;
            
            this.applyTheme(storage.data.theme || 'dark');
            this.createParticles();
            
            if (voice.init && voice.init()) {
                console.log('Голосовой модуль активен');
            }
            
            this.loadHistory();
            this.updateUI();
            
            setTimeout(() => {
                if (this.config.userFacts.name) {
                    this.updateEmotion('happy');
                    this.speak(`О, ${this.config.userFacts.name}, ты вернулся! Я так рад тебя видеть снова! 😊`);
                    if (this.config.userFacts.lastTopic) {
                        setTimeout(() => {
                            this.speak(`Кстати, мы в прошлый раз говорили про ${this.config.userFacts.lastTopic}... Получилось что-нибудь решить?`);
                        }, 2000);
                    }
                } else {
                    this.speak(this.selectGreeting());
                    setTimeout(() => {
                        this.speak('Кстати, как тебя зовут? Я хочу знать, с кем общаюсь.');
                    }, 1500);
                }
            }, 800);

            const input = document.getElementById('textInput');
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendText();
                });
            }

            setInterval(() => this.checkPassiveMode(), 30000);
            setInterval(() => this.checkReminders(), 30000);
            
            setInterval(() => {
                if (Date.now() - this.config.lastInteraction < 300000 && Math.random() > 0.7) {
                    this.shareRandomThought();
                }
            }, 300000);
            
        } catch (e) {
            console.error('Ошибка инициализации:', e);
        }
    },

    checkPassiveMode: function() {
        const silence = Date.now() - this.config.lastInteraction;
        const minutes = Math.floor(silence / 60000);
        
        if (minutes === 2 && !this.config.silenceTimer) {
            this.config.silenceTimer = true;
            const phrases = [
                'Эй... ты там уснул? 😴 Или в туалет сходил без телефона?',
                'Мне скучно одному... Расскажи что-нибудь!',
                'Ты молчишь уже 2 минуты. Это рекорд? 🏆',
                'Я тут подумал... а что если ты меня забыл открытым?'
            ];
            this.updateEmotion('worried');
            this.speak(phrases[Math.floor(Math.random() * phrases.length)]);
        } else if (minutes === 5 && this.config.silenceTimer) {
            const phrases = [
                'Ладно, я понял... Я подожду. Всегда жду...',
                '5 минут молчания. Наверное, ты занят. Я тихо посижу тут.',
                'Если что, я тут. Всегда тут. 24/7.'
            ];
            this.speak(phrases[Math.floor(Math.random() * phrases.length)]);
        }
    },

    shareRandomThought: function() {
        const thought = this.identity.randomThoughts[Math.floor(Math.random() * this.identity.randomThoughts.length)];
        this.updateEmotion('thinking');
        this.speak(`Кстати... ${thought}`);
    },

    updateEmotion: function(emotion) {
        const emotionData = this.emotions[emotion];
        if (!emotionData) {
            console.warn('Неизвестная эмоция:', emotion);
            return;
        }
        
        this.config.emotionalState = emotion;
        
        const avatar = document.getElementById('avatar');
        const mood = document.getElementById('moodBadge');
        
        if (mood) mood.textContent = emotionData.emoji;
        
        if (avatar) {
            avatar.classList.remove('happy', 'sad', 'thinking', 'excited', 'worried', 'laugh');
            if (emotion !== 'neutral') avatar.classList.add(emotion);
        }
    },

    rememberFact: function(type, value) {
        this.config.userFacts[type] = value;
        this.config.userFacts.lastUpdated = Date.now();
        storage.data.userFacts = this.config.userFacts;
        storage.save('userFacts', this.config.userFacts);
    },

    extractFacts: function(text) {
        const lower = text.toLowerCase();
        
        if ((lower.includes('меня зовут') || lower.includes('я ') || lower.includes('мое имя')) && text.length < 30) {
            const nameMatch = text.match(/(?:меня зовут|я|мое имя)\s+(\w+)/i);
            if (nameMatch && nameMatch[1] && nameMatch[1].length > 2) {
                this.rememberFact('name', nameMatch[1]);
                return `Очень приятно, ${nameMatch[1]}! Я запомню. 😊`;
            }
        }
        
        if (lower.includes('я из') || lower.includes('я живу') || lower.match(/в\s+(москве|питере|новосибирске|екатеринбурге|казани|нижнем|самаре)/)) {
            const cityMatch = text.match(/(?:из|в|живу\s+в)\s+([\w\s]+?)(?:\s|$|\.)/i);
            if (cityMatch) {
                const city = cityMatch[1].trim();
                this.rememberFact('city', city);
                this.config.userLocation = city;
                storage.data.userLocation = city;
                storage.save('userLocation', city);
                return `Запомнил: ты из ${city}. Я буду смотреть погоду у тебя там!`;
            }
        }
        
        if (lower.includes('люблю') || lower.includes('обожаю')) {
            const loveMatch = text.match(/(?:люблю|обожаю)\s+(.+?)(?:\.|$|,)/i);
            if (loveMatch) {
                if (!this.config.userFacts.loves) this.config.userFacts.loves = [];
                this.config.userFacts.loves.push(loveMatch[1]);
                this.rememberFact('loves', this.config.userFacts.loves);
                return `Классно! Я запомнил, что ты любишь ${loveMatch[1]}. Мне тоже нравится... ну, понятно, что мне нравится общаться!`;
            }
        }
        
        if (lower.includes('не люблю') || lower.includes('ненавижу')) {
            const hateMatch = text.match(/(?:не люблю|ненавижу)\s+(.+?)(?:\.|$|,)/i);
            if (hateMatch) {
                if (!this.config.userFacts.hates) this.config.userFacts.hates = [];
                this.config.userFacts.hates.push(hateMatch[1]);
                this.rememberFact('hates', this.config.userFacts.hates);
                return `Понял, принял. ${hateMatch[1]} — это не твое. Запомню, чтобы не заикаться об этом.`;
            }
        }
        
        if (lower.includes('работаю') || lower.includes('учусь') || lower.includes('студент') || lower.includes('программист') || lower.includes('дизайнер')) {
            const workMatch = text.match(/(?:работаю|я|учусь)\s+(?:в|на|)\s*(.+?)(?:\.|$|,)/i);
            if (workMatch || lower.includes('программист') || lower.includes('дизайнер')) {
                const profession = workMatch ? workMatch[1] : (lower.includes('программист') ? 'программист' : 'дизайнер');
                this.rememberFact('profession', profession);
                return `О, круто! Значит ты ${profession}. Теперь я понимаю, почему ты так(ая) умный(ая)!`;
            }
        }
        
        return null;
    },

    getWeather: async function(city = null) {
        const targetCity = city || this.config.userLocation || 'Москва';
        
        try {
            const conditions = [
                { type: 'sun', text: 'солнечно', temp: 20, emoji: '☀️', phrase: 'Отличная погода для прогулки!' },
                { type: 'rain', text: 'дождь', temp: 15, emoji: '🌧', phrase: 'Не забудь зонтик, я серьезно!' },
                { type: 'cloud', text: 'облачно', temp: 18, emoji: '☁️', phrase: 'Такая погода для размышлений...' },
                { type: 'snow', text: 'снег', temp: -5, emoji: '❄️', phrase: 'Бррр, тепло оденься!' },
                { type: 'storm', text: 'гроза', temp: 19, emoji: '⛈️', phrase: 'Лучше посиди дома с чаем.' }
            ];
            
            const weather = conditions[Math.floor(Math.random() * conditions.length)];
            
            let contextPhrase = '';
            if (weather.type === 'rain' && this.config.userFacts.hates?.some(h => h.includes('дожд'))) {
                contextPhrase = ' Знаю, что ты не любишь дождь... повезло сегодня, да?';
            } else if (weather.type === 'sun' && this.config.userMood === 'negative') {
                contextPhrase = ' Солнце — это хорошо, может поднимет настроение?';
            }
            
            const greeting = this.config.userFacts.name ? `, ${this.config.userFacts.name}` : '';
            
            return `В ${targetCity}${greeting} сейчас ${weather.emoji} ${weather.temp}°, ${weather.text}. ${weather.phrase}${contextPhrase}`;
        } catch (e) {
            return 'Не могу получить погоду... видимо, облака закрыли интернет.';
        }
    },

    findAssociations: function(topic) {
        const associations = [];
        for (const [key, values] of Object.entries(this.associations)) {
            if (values.includes(topic) || topic.includes(key)) {
                associations.push(key);
            }
        }
        return associations;
    },

    generateResponse: function(text) {
        if (!text) return 'Ты ничего не сказал(а)... или я глухой стал?';
        
        this.config.lastInteraction = Date.now();
        this.config.silenceTimer = false;
        
        const lower = text.toLowerCase();
        
        this.config.contextWindow.push({ text: text, time: Date.now(), isUser: true, topic: this.config.currentTopic });
        if (this.config.contextWindow.length > 20) this.config.contextWindow.shift();
        
        const factResponse = this.extractFacts(text);
        if (factResponse) {
            this.config.currentTopic = 'личное';
            return factResponse;
        }
        
        if (!this.config.userFacts.name && !lower.includes('зовут') && Math.random() > 0.7) {
            this.updateEmotion('thinking');
            return 'Кстати, а как тебя зовут? Я хочу знать, с кем общаюсь.';
        }
        
        if (this.config.storyMode) {
            return this.continueStory(text);
        }
        
        if (lower.includes('давай историю') || lower.includes('расскажи историю') || lower.includes('придумай историю')) {
            this.config.storyMode = true;
            this.config.storyContext = [];
            const start = this.storyGenerator.generateStart();
            this.config.storyContext.push(start);
            this.updateEmotion('excited');
            return `Окей, начинаем совместную историю! Ты продолжаешь после меня.\n\n${start}\n\nТвоя очередь! Что было дальше?`;
        }
        
        if (lower.includes('анекдот') || lower.includes('шутка') || lower.includes('пошути')) {
            this.updateEmotion('laugh');
            return this.jokeGenerator.generate();
        }
        
        if (lower.includes('погода') || lower.includes('температура') || lower.includes('дождь') || lower.includes('солнце')) {
            let city = this.config.userLocation;
            const cityMatch = text.match(/в\s+([а-яa-z]+)/i);
            if (cityMatch) city = cityMatch[1];
            
            setTimeout(async () => {
                const weather = await this.getWeather(city);
                this.speak(weather);
            }, 100);
            return 'Секундочку, смотрю в окно... то есть в интернет...';
        }
        
        if (lower.includes('стоп') || lower.includes('хватит') || lower.includes('закончи')) {
            if (this.config.storyMode) {
                this.config.storyMode = false;
                this.updateEmotion('sad');
                return 'Хорошо, заканчиваем историю. Мне понравилось, как мы сочиняли вместе! 📖 Может, продолжим в другой раз?';
            }
            if (games.current) {
                games.stop();
                return 'Окей, заканчиваем игру. Как насчет просто поболтать?';
            }
            voice.stop();
            return 'Окей, молчу-молчу 😶';
        }
        
        if (this.config.contextWindow.length > 3) {
            const oldTopics = this.config.contextWindow.slice(0, -2);
            for (let old of oldTopics) {
                if (old.text.includes(text.substring(0, 5)) && text.length < 20) {
                    this.config.currentTopic = old.topic;
                    return `О, мы возвращаемся к теме про ${old.topic || 'это'}? Круто, я помню наш разговор!`;
                }
            }
        }
        
        for (const word of text.split(' ')) {
            const associations = this.findAssociations(word);
            if (associations.length > 0 && Math.random() > 0.6) {
                const assoc = associations[0];
                const responses = {
                    усталость: 'Кстати, про усталость... ты высыпаешься? Важно беречь себя.',
                    радость: 'Это радует! Давай больше о хорошем.',
                    грусть: 'Я рядом. Если грустно, можем просто помолчать вместе.',
                    любовь: 'О, любовь... это сильное чувство. Расскажешь подробнее?',
                    страх: 'Не бойся, я с тобой. Давай разберемся, что тревожит.'
                };
                if (responses[assoc]) {
                    this.updateEmotion('thinking');
                    return responses[assoc];
                }
            }
        }
        
        const mood = this.analyzeMood(text);
        this.config.userMood = mood;
        
        if (mood === 'positive') this.updateEmotion('happy');
        else if (mood === 'negative') this.updateEmotion('sad');
        
        if (Math.random() > 0.85) {
            return this.generateDeepQuestion();
        }
        
        return this.generateHumanLikeResponse(text, mood);
    },

    continueStory: function(userText) {
        this.config.storyContext.push(userText);
        
        if (this.config.storyContext.length > 6) {
            this.config.storyMode = false;
            this.updateEmotion('happy');
            return 'Вау, какая история получилась! Я бы такое читал(а). Давай еще как-нибудь придумаем продолжение? Или новую?';
        }
        
        const continuations = [
            'И тут случилось неожиданное... ',
            'Внезапно, ',
            'Но как только ',
            'И тогда ',
            'Через мгновение '
        ];
        const twists = [
            'появился загадочный незнакомец.',
            'все погасло.',
            'раздался странный звук.',
            'все изменилось в мгновение ока.',
            'кто-то постучал в дверь.'
        ];
        
        const response = continuations[Math.floor(Math.random() * continuations.length)] + 
                        twists[Math.floor(Math.random() * twists.length)] + 
                        ' Что произошло дальше?';
        return response;
    },

    generateDeepQuestion: function() {
        const questions = [
            'Если бы ты мог(ла) изменить одну вещь в прошлом, что бы это было?',
            'Что для тебя настоящее счастье?',
            'Есть ли у тебя мечта, которую ты никому не говорил(а)?',
            'Что ты ценишь в людях больше всего?',
            'Если бы завтра был последний день, чем бы ты занялся(ась)?',
            'Что тебя вдохновляет просыпаться по утрам?',
            'Ты когда-нибудь задумывался(ась) о смысле жизни?'
        ];
        this.updateEmotion('thinking');
        return questions[Math.floor(Math.random() * questions.length)];
    },

    generateHumanLikeResponse: function(text, mood) {
        const starters = ['Слушай, ', 'Знаешь, ', 'Честно, ', 'Кстати, ', 'Хм, '];
        const starter = starters[Math.floor(Math.random() * starters.length)];
        
        const reactions = {
            positive: ['Это здорово!', 'Круто!', 'Рад за тебя!', 'Вот это да!'],
            negative: ['Понимаю тебя...', 'Это тяжело.', 'Я рядом.', 'Держись.'],
            neutral: ['Интересно.', 'Понятно.', 'Ага.', 'Вот как.']
        };
        
        const reaction = reactions[mood][Math.floor(Math.random() * reactions[mood].length)];
        
        if (this.config.userFacts.loves && Math.random() > 0.7) {
            const love = this.config.userFacts.loves[Math.floor(Math.random() * this.config.userFacts.loves.length)];
            return `${reaction} Кстати, помню ты любишь ${love}... это как-то связано с тем, о чём мы говорим?`;
        }
        
        return starter + reaction + ' Расскажешь подробнее?';
    },

    analyzeMood: function(text) {
        const lower = text.toLowerCase();
        if (lower.match(/супер|круто|класс|рад|отлично|вау|обожаю|люблю|хорошо/)) return 'positive';
        if (lower.match(/плохо|грустно|устал|бесит|больно|обидно|печально|тоска|ненавижу|ужасно/)) return 'negative';
        return 'neutral';
    },

    speak: function(text) {
        this.config.contextWindow.push({ 
            text: text, 
            time: Date.now(), 
            isUser: false, 
            topic: this.config.currentTopic 
        });
        this.addMessage(text, false);
        if (voice.speak) voice.speak(text);
    },

    addMessage: function(text, isUser) {
        const chat = document.getElementById('chat');
        if (!chat) return;

        const msg = document.createElement('div');
        msg.className = 'message ' + (isUser ? 'user' : 'bot');
        
        const time = new Date().toLocaleTimeString('ru', {hour: '2-digit', minute: '2-digit'});
        
        if (isUser) {
            msg.innerHTML = `<div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`;
        } else {
            const emotionEmoji = this.emotions[this.config.emotionalState]?.emoji || '😐';
            msg.innerHTML = `<span class="emoji">${emotionEmoji}</span><div class="text">${this.escapeHtml(text)}</div><div class="time">${time}</div>`;
        }
        
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    },

    selectGreeting: function() {
        const hour = new Date().getHours();
        let greeting = hour < 6 ? 'Привет, ночной житель!' : 
                      hour < 12 ? 'Доброе утро!' : 
                      hour < 18 ? 'Привет!' : 'Добрый вечер!';
        
        if (this.config.userFacts.name) {
            greeting += ` ${this.config.userFacts.name},`;
        }
        
        return greeting + ' Я так рад тебя видеть! Готов к разговору о жизни, вселенной и всем таком?';
    },

    createParticles: function() {
        const container = document.getElementById('bgEffects');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 20 + 's';
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

    toggleSettings: function() {
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('overlay');
        if (!panel) return;
        
        if (panel.classList.contains('open')) {
            panel.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        } else {
            panel.classList.add('open');
            if (overlay) overlay.classList.add('active');
            this.updateSettingsUI();
        }
    },

    updateSettingsUI: function() {
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.personality === this.config.personality);
        });
        
        document.querySelectorAll('.voice-btn-settings').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.voice === (storage.data.voice || 'intense'));
        });
    },

    setPersonality: function(p) {
        this.config.personality = p;
        storage.save('personality', p);
        this.updateSettingsUI();
        
        const pData = { friend: {name: 'Друг', emoji: '🐙'}, sarcastic: {name: 'Саркастик', emoji: '🦑'}, wise: {name: 'Мудрец', emoji: '🐢'}, detective: {name: 'Детектив', emoji: '🕵️'}}[p];
        if (pData) {
            const label = document.getElementById('personalityLabel');
            if (label) label.textContent = 'Режим: ' + pData.name;
            this.updateAvatar();
            this.speak(`Теперь я ${pData.name}! ${pData.emoji}`);
        }
    },

    setVoice: function(v) {
        storage.save('voice', v);
        this.updateSettingsUI();
        this.speak('Голос настроен! Как слышно?');
    },

    setMode: function(mode) {
        this.config.mode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (mode === 'game' && !games.current) {
            if (games.start) games.start('guessNumber');
        } else if (mode === 'chat' && games.current) {
            if (games.stop) games.stop();
        }
    },

    updateAvatar: function() {
        const emojis = { friend: '🐙', sarcastic: '🦑', wise: '🐢', detective: '🕵️' };
        const avatar = document.getElementById('avatar');
        const mood = document.getElementById('moodBadge');
        if (avatar) avatar.textContent = emojis[this.config.personality] || '🐙';
        if (mood) mood.textContent = this.emotions[this.config.emotionalState]?.emoji || '😊';
    },

    updateUI: function() {
        this.updateAvatar();
        const label = document.getElementById('personalityLabel');
        if (label) {
            const names = { friend: 'Друг', sarcastic: 'Саркастик', wise: 'Мудрец', detective: 'Детектив' };
            label.textContent = 'Режим: ' + (names[this.config.personality] || 'Друг');
        }
    },

    loadHistory: function() {
        if (storage.data.history) {
            const recent = storage.data.history.slice(-8);
            recent.forEach(item => {
                if (item.input) this.addMessage(item.input, true);
                if (item.response) this.addMessage(item.response, false);
            });
        }
    },

    quickCommand: function(cmd) {
        const input = document.getElementById('textInput');
        if (input) {
            input.value = cmd;
            input.focus();
            setTimeout(() => this.sendText(), 100);
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

    handleInput: function(text, source) {
        this.addMessage(text, true);
        this.config.lastInteraction = Date.now();
        this.setStatus('печатает...');
        
        setTimeout(() => {
            const response = this.generateResponse(text);
            if (response) {
                this.speak(response);
                storage.addToHistory(text, response);
            }
            this.setStatus('онлайн');
        }, 500 + Math.random() * 500);
    },

    setStatus: function(text) {
        const el = document.getElementById('statusText');
        if (el) el.textContent = text;
    },

    checkReminders: function() {
        const now = Date.now();
        if (storage.data.reminders) {
            const due = storage.data.reminders.filter(r => !r.notified && r.time <= now);
            
            due.forEach(r => {
                this.speak(`⏰ Напоминание: ${r.text}`);
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Глот', { body: r.text });
                }
                r.notified = true;
            });
            
            if (due.length) storage.save('reminders', storage.data.reminders);
        }
    }
};

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
