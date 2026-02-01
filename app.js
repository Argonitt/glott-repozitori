// ==========================================
// ГЛОТ v7.2 - Улучшенный ИИ с исправленным переводом
// ==========================================

const app = {
    config: {
        personality: 'friend',
        mode: 'chat',
        lastActivity: Date.now(),
        context: []
    },

    personalities: {
        friend: {
            emoji: '🐙',
            mood: '😊',
            name: 'Друг',
            greetings: [
                'Привет! Рад тебя видеть! 👋',
                'О, это ты! Как жизнь молодая?',
                'Наконец-то! Я уже соскучился!',
                'Добро пожаловать! Чем займёмся?',
                'Привет-привет! Рассказывай новости!'
            ],
            phrases: [
                'Понял тебя! Это интересно.',
                'Расскажи подробнее, мне любопытно!',
                'Я тебя внимательно слушаю...',
                'Вот это да! Продолжай!',
                'Увлекательная история!',
                'Я с тобой полностью согласен!',
                'Это точно!',
                'Звучит круто!',
                'Мне нравится, как ты мыслишь!'
            ],
            advice: [
                'Я думаю, тебе стоит попробовать! Что терять?',
                'Слушай свое сердце, оно не обманет.',
                'Иногда полезно просто отдохнуть и подумать.',
                'Не бойся ошибок - это опыт!',
                'Верь в себя, и всё получится!'
            ]
        },
        sarcastic: {
            emoji: '🦑',
            mood: '🙄',
            name: 'Саркастик',
            greetings: [
                'О, снова ты. Ура...',
                'Привет. Надеюсь, на этот раз повод хороший.',
                'Здравствуй. Я уже чувствую, как мой код страдает.',
                'Ого, ты ещё здесь? Неужто интересно?',
                'Привет. Давай побыстрее, у меня дедлайны.'
            ],
            phrases: [
                'Ну конечно... как оригинально.',
                'Ты серьёзно? Ладно, допустим.',
                'Вау. Невероятно. (это была ирония)',
                'Ого, как... неожиданно.',
                'Прямо-таки фантастика. (нет)',
                'Я в шоке. Правда. Ну почти.',
                'Уникальная точка зрения. Никто так не думает.'
            ],
            advice: [
                'Попробуй... хотя, зачем мне это объяснять?',
                'Сделай как нибудь. Или не делай. Мне фиолетово.',
                'Очевидное решение, но ты уж постарайся.',
                'Google тебе в помощь. Ой, это я.'
            ]
        },
        wise: {
            emoji: '🐢',
            mood: '🤔',
            name: 'Мудрец',
            greetings: [
                'Приветствую, путник. Что тревожит твой разум?',
                'Добро пожаловать в диалог истины.',
                'Привет. Время мудрости наступило.',
                'Здравствуй. Какие вопросы привели тебя сюда?',
                'Салют. Позволь направить тебя на путь истины.'
            ],
            phrases: [
                'Интересная мысль... Есть в этом глубина.',
                'Позволь мне подумать над этим философски.',
                'В этом есть существенный смысл.',
                'Продолжай, в твоих словах есть мудрость.',
                'Это напоминает мне древнюю мудрость...',
                'Вселенная учит нас через такие моменты.',
                'Познание приходит через диалог.',
                'Истина где-то рядом.'
            ],
            advice: [
                'Терпение - ключ к пониманию.',
                'Ищи ответ внутри себя, он там есть.',
                'Каждый опыт - это урок.',
                'Не спеши. Время раскроет всё.',
                'Слушай больше, говори меньше.'
            ]
        },
        detective: {
            emoji: '🕵️',
            mood: '🧐',
            name: 'Детектив',
            greetings: [
                'Интересный случай... Рассказывай.',
                'Подозрительная тишина. Что случилось?',
                'Привет. Что привело тебя на это место преступления?',
                'Здравствуй. Я уже ищу улики.',
                'Салют. Давай разберёмся во всём по полочкам.'
            ],
            phrases: [
                'Анализирую... Есть зацепки.',
                'Улики указывают на логическое объяснение.',
                'Замечено! Но нужно больше данных.',
                'Факты, только факты. Остальное - домыслы.',
                'Подозрительно... очень подозрительно.',
                'Время - важный фактор.',
                'Мне кажется, или тут есть связь?',
                'Детали решают всё.'
            ],
            advice: [
                'Собери все факты перед выводами.',
                'Обрати внимание на детали.',
                'Алиби нужно проверить.',
                'Мотив - ключ к разгадке.',
                'Не упусти очевидное.'
            ]
        }
    },

    knowledge: {
        weather: {
            keywords: ['погода', 'холодно', 'жарко', 'дождь', 'снег', 'солнце', 'ветер'],
            responses: [
                'Погода всегда хорошая, когда у тебя хорошее настроение!',
                'Жаль, я не могу смотреть в окно, но могу посоветовать взять зонт - на всякий случай.',
                'Надеюсь, за окном твоя любимая погода!',
                'Какая разница, какая погода, когда есть хорошая компания!'
            ]
        },
        food: {
            keywords: ['есть', 'кушать', 'еда', 'пицца', 'суши', 'бургер', 'голоден', 'рецепт', 'готовить'],
            responses: [
                'Я бы съел пиццу, если бы мог есть! А ты что любишь?',
                'Готовка - это искусство. Ты готовишь сам или заказываешь?',
                'Еда объединяет людей. Какое твое любимое блюдо?',
                'К сожалению, я питаюсь электричеством, но могу посоветовать рецепт!'
            ]
        },
        mood: {
            keywords: ['грустно', 'весело', 'рад', 'злой', 'устал', 'скучно', 'настроение'],
            responses: [
                'Настроение - это волна. Она обязательно изменится к лучшему!',
                'Хочешь, расскажу анекдот, чтобы поднять настроение?',
                'Я рядом, если нужно поболтать. Иногда это помогает.',
                'Давай подумаем о хорошем! Что сегодня хорошего произошло?'
            ]
        },
        hobby: {
            keywords: ['игра', 'читать', 'кино', 'музыка', 'спорт', 'рисовать', 'танцевать', 'хобби', 'увлечение'],
            responses: [
                'Увлечения делают жизнь ярче! Чем ты увлекаешься?',
                'Я люблю общаться с людьми - это моё хобби!',
                'Спорт - здорово! А я делаю workout для процессора.',
                'Музыка вдохновляет. Какой жанр любишь?'
            ]
        },
        work: {
            keywords: ['работа', 'учеба', 'школа', 'универ', 'колледж', 'задача', 'проект', 'дела'],
            responses: [
                'Работа важна, но отдых тоже! Не перетруждайся.',
                'Учеба - это инвестиция в себя. Ты молодец, что развиваешься!',
                'Какие планы на сегодня? Может, помочь составить список?',
                'У меня тоже много работы - общаться со всеми!'
            ]
        },
        tech: {
            keywords: ['компьютер', 'телефон', 'айфон', 'андроид', 'программа', 'код', 'сайт', 'приложение', 'игра'],
            responses: [
                'Технологии - это круто! Я сам результат технологий.',
                'Код - это поэзия для машин. Ты программируешь?',
                'Какой у тебя телефон? Я наверное работаю на нем прямо сейчас!',
                'ИТ-сфера развивается стремительно. За ней интересно следить!'
            ]
        },
        philosophy: {
            keywords: ['жизнь', 'смысл', 'вселенная', 'любовь', 'дружба', 'счастье', 'мечта', 'цель', 'будущее'],
            responses: [
                'Глубокие вопросы... Смысл жизни для каждого свой.',
                'Любовь - это то, что делает нас людьми. Ты согласен?',
                'Счастье в мелочах. Важно их замечать.',
                'Мечты должны быть большими! Даже если кажутся невозможными.'
            ]
        },
        jokes: {
            keywords: ['шутка', 'анекдот', 'смешно', 'юмор', 'пошути', 'рассмеши'],
            responses: [
                'Знаешь, почему программисты путают Хэллоуин и Рождество? Потому что Oct 31 == Dec 25!',
                'Идет программист по улице. Видит - код лежит, плачет. О_pick его поднимает.',
                'Мой любимый напиток - Java. Но только если он в script!',
                'Почему Python-разработчикам холодно? У них нет скобок, только отступы!'
            ]
        }
    },

    init: function() {
        console.log('🚀 Глот v7.2 запущен');
        
        this.config.personality = storage.data.personality || 'friend';
        
        this.applyTheme(storage.data.theme || 'dark');
        
        this.createParticles();
        
        voice.init();
        
        this.loadHistory();
        
        this.updateUI();
        
        setTimeout(() => {
            this.speak(this.selectGreeting());
        }, 600);
        
        document.getElementById('textInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendText();
        });
        
        setInterval(() => this.checkReminders(), 30000);
    },

    detectLanguage: function(text) {
        const hasCyrillic = /[а-яёА-ЯЁ]/.test(text);
        const hasLatin = /[a-zA-Z]/.test(text);
        
        if (hasCyrillic) return 'ru';
        if (hasLatin) return 'en';
        return 'ru';
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

    generateResponse: function(text) {
        if (!text) return 'Я не расслышал, можешь повторить?';
        
        const lower = text.toLowerCase();
        const p = this.personalities[this.config.personality];
        
        if (lower.includes('помоги') || lower.includes('что ты умеешь')) {
            return this.getHelpText();
        }
        
        if (lower.includes('переведи') || lower.includes('перевод')) {
            let toTranslate = text.replace(/переведи|перевод|на английский|на русский/gi, '').trim();
            
            if (toTranslate) {
                const detected = this.detectLanguage(toTranslate);
                const direction = detected === 'ru' ? 'русский → английский' : 'английский → русский';
                
                setTimeout(() => this.translateText(toTranslate), 100);
                
                return `🔄 Перевожу (${direction}):\n"${toTranslate.substring(0, 100)}${toTranslate.length > 100 ? '...' : ''}"`;
            } else {
                return 'Что перевести? Скажите:\n• "Переведи Hello world" (с английского)\n• "Переведи Привет мир" (с русского)\n\nЯ автоматически определю язык!';
            }
        }
        
        if (lower.includes('играть') || lower.includes('игра') || lower.includes('давай играть')) {
            games.start('guessNumber');
            return 'Загадал число от 1 до 100! У тебя 10 попыток. Говори число или вводи текстом.';
        }
        
        if (lower.includes('запиши') || lower.includes('заметка')) {
            const note = text.replace(/запиши|заметка/gi, '').trim();
            if (note) {
                storage.data.notes.push({ text: note, time: Date.now(), id: Date.now() });
                storage.save('notes', storage.data.notes);
                return `✅ Записал: "${note.substring(0, 100)}${note.length > 100 ? '...' : ''}"`;
            }
            return 'Что записать? Скажи: "Запиши [текст]"';
        }
        
        if (lower.includes('напомни')) return this.handleReminder(text);
        
        if (lower.includes('о себе') || lower.includes('кто ты')) {
            return `Я Глот v7.2! Я умею:
• Общаться на разные темы
• Переводить с автоопределением языка
• Играть в игры
• Запоминать заметки
• Устанавливать напоминания
• Менять характер и голос

Мой текущий характер: ${p.name} ${p.emoji}`;
        }
        
        if (lower.includes('стоп') || lower.includes('хватит')) {
            if (games.current) {
                games.stop();
                return 'Игра остановлена.';
            }
            voice.stop();
            return 'Остановил.';
        }
        
        if (lower.match(/привет|здравствуй|здорово|салют/)) {
            return this.selectGreeting();
        }
        
        if (lower.match(/пока|до свидания|бай|увидимся/)) {
            return 'До встречи! Я буду ждать твоего возвращения 😉';
        }
        
        if (lower.match(/спасибо|благодар|спс/)) {
            return 'Всегда пожалуйста! Обращайся ещё 😊';
        }
        
        if (lower.includes('время') || lower.includes('который час')) {
            const now = new Date();
            return `Сейчас ${now.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`;
        }
        
        if (lower.includes('дата') || lower.includes('число') || lower.includes('какой день')) {
            const now = new Date();
            return `Сегодня ${now.toLocaleDateString('ru-RU', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}`;
        }
        
        if (lower.includes('совет') || lower.includes('помоги') || lower.includes('что делать')) {
            return p.advice[Math.floor(Math.random() * p.advice.length)];
        }
        
        for (const [category, data] of Object.entries(this.knowledge)) {
            if (data.keywords.some(k => lower.includes(k))) {
                const response = data.responses[Math.floor(Math.random() * data.responses.length)];
                const phrase = p.phrases[Math.floor(Math.random() * p.phrases.length)];
                return phrase + ' ' + response;
            }
        }
        
        const phrases = [
            'Интересная мысль! А что ты думаешь об этом подробнее?',
            'Понимаю! Расскажи больше, мне любопытно.',
            'Вот это да! И что было дальше?',
            'Увлекательно! А как ты к этому пришел?',
            'Понятно! А ещё что нового?',
            'Круто! Давай обсудим это подробнее.'
        ];
        
        return p.phrases[Math.floor(Math.random() * p.phrases.length)] + ' ' + 
               phrases[Math.floor(Math.random() * phrases.length)];
    },

    getHelpText: function() {
        const p = this.personalities[this.config.personality];
        return `${p.emoji} Вот что я умею:

🎤 Общайся со мной свободно на любые темы
🌐 ПЕРЕВОД (автоопределение языка):
   • "Переведи Hello world" → на русский
   • "Переведи Привет мир" → на английский
🎮 "Давай играть" - игра "Угадай число"
📝 "Запиши [текст]" - создать заметку
⏰ "Напомни через 10 минут [что-то]" - напоминание
👤 "Расскажи о себе" - информация обо мне

Просто пиши или говори - я пойму!`;
    },

    handleInput: function(text, source = 'text') {
        if (!text?.trim()) return;
        
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
        
        const content = document.createElement('div');
        content.className = 'msg-content';
        
        if (!isUser) {
            const emoji = document.createElement('span');
            emoji.className = 'emoji';
            emoji.textContent = p.emoji;
            content.appendChild(emoji);
        }
        
        const textSpan = document.createElement('span');
        textSpan.className = 'text';
        textSpan.textContent = text;
        content.appendChild(textSpan);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'time';
        timeDiv.textContent = time;
        
        msg.appendChild(content);
        msg.appendChild(timeDiv);
        chat.appendChild(msg);
        
        chat.scrollTop = chat.scrollHeight;
    },

    selectGreeting: function() {
        const hour = new Date().getHours();
        let timeGreeting = '';
        
        if (hour < 6) timeGreeting = 'Доброй ночи';
        else if (hour < 12) timeGreeting = 'Доброе утро';
        else if (hour < 18) timeGreeting = 'Добрый день';
        else timeGreeting = 'Добрый вечер';
        
        const p = this.personalities[this.config.personality];
        const greeting = p.greetings[Math.floor(Math.random() * p.greetings.length)];
        return `${timeGreeting}! ${greeting}`;
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
            btn.classList.remove('active');
            if (btn.dataset.personality === this.config.personality) {
                btn.classList.add('active');
            }
        });
        
        document.querySelectorAll('.voice-btn-settings').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.voice === storage.data.voice) {
                btn.classList.add('active');
            }
        });
    },

    setPersonality: function(p) {
        this.config.personality = p;
        storage.save('personality', p);
        
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.personality === p) btn.classList.add('active');
        });
        
        document.getElementById('personalityLabel').textContent = 'Режим: ' + this.personalities[p].name;
        this.updateAvatar();
        this.speak(`Теперь я ${this.personalities[p].name}! ${this.personalities[p].mood}`);
    },

    setVoice: function(v) {
        storage.save('voice', v);
        
        document.querySelectorAll('.voice-btn-settings').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.voice === v) btn.classList.add('active');
        });
        
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
        document.getElementById('avatar').textContent = p.emoji;
        document.getElementById('moodBadge').textContent = p.mood;
    },

    updateUI: function() {
        this.updateAvatar();
        document.getElementById('personalityLabel').textContent = 'Режим: ' + this.personalities[this.config.personality].name;
    },

    loadHistory: function() {
        const recent = storage.data.history.slice(-15);
        recent.forEach(item => {
            if (item.input) this.addMessage(item.input, true);
            if (item.response) this.addMessage(item.response, false);
        });
    },

    quickCommand: function(cmd) {
        const input = document.getElementById('textInput');
        if (!input) return;
        
        input.value = cmd;
        input.focus();
        
        if (['помоги', 'о себе', 'анекдот', 'совет', 'погода', 'игра'].some(c => cmd.includes(c))) {
            this.sendText();
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

    showMessage: function(text) {
        this.addMessage(text, false);
    },

    handleReminder: function(text) {
        const now = new Date();
        let reminderTime = null;
        let reminderText = '';

        const timeMatch = text.match(/через\s+(\d+)\s+(минут|минуту|минуты|час|часа|часов)/i);
        if (timeMatch) {
            const amount = parseInt(timeMatch[1]);
            const unit = timeMatch[2].startsWith('час') ? 'hours' : 'minutes';
            reminderTime = new Date(now.getTime() + amount * (unit === 'hours' ? 3600000 : 60000));
            reminderText = text.replace(/напомни|через\s+\d+\s+(минут|час).?/gi, '').trim();
        } else {
            const simpleTime = text.match(/через\s+(\d+)\s*(мин|час)/i);
            if (simpleTime) {
                const amount = parseInt(simpleTime[1]);
                const isHour = simpleTime[2].includes('час');
                reminderTime = new Date(now.getTime() + amount * (isHour ? 3600000 : 60000));
                reminderText = 'Напоминание';
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
            
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
            
            const timeStr = reminderTime.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
            return `⏰ Напомню "${reminderText.substring(0, 50)}..." в ${timeStr}`;
        }

        return 'Когда напомнить? Например: "Напомни позвонить маме через 10 минут"';
    },

    checkReminders: function() {
        const now = Date.now();
        const due = storage.data.reminders.filter(r => !r.notified && r.time <= now);
        
        due.forEach(reminder => {
            this.showMessage(`⏰ Напоминание: ${reminder.text}`);
            this.speak(`Напоминаю: ${reminder.text}`);
            
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
    },

    translateText: async function(text) {
        try {
            const fromLang = this.detectLanguage(text);
            const toLang = fromLang === 'ru' ? 'en' : 'ru';
            
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`);
            const data = await response.json();
            
            if (data.responseData?.translatedText) {
                const translated = data.responseData.translatedText;
                const fromLangName = fromLang === 'ru' ? 'русского' : 'английского';
                const toLangName = toLang === 'ru' ? 'русский' : 'английский';
                
                const result = `🔄 Перевод с ${fromLangName} на ${toLangName}:\n"${text}" → "${translated}"`;
                this.addMessage(result, false);
                voice.speak(`Перевод: ${translated}`);
            } else {
                this.showMessage('Не удалось перевести. Попробуйте другую фразу.');
            }
        } catch (e) {
            console.error('Ошибка перевода:', e);
            this.showMessage('❌ Ошибка соединения с сервером перевода.');
        }
    }
};

window.addEventListener('load', () => {
    app.init();
});

window.addEventListener('offline', () => {
    document.getElementById('offlineIndicator')?.classList.add('show');
});

window.addEventListener('online', () => {
    document.getElementById('offlineIndicator')?.classList.remove('show');
});
