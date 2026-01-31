// Голосовой модуль
const voice = {
    recognition: null,
    isListening: false,
    isSpeaking: false,

    // Пресеты голоса
    presets: {
        intense: { rate: 1.1, pitch: 1.0, volume: 1.0, desc: 'Мощный, чёткий' },
        calm: { rate: 0.9, pitch: 0.9, volume: 0.8, desc: 'Спокойный, мягкий' },
        deep: { rate: 0.8, pitch: 0.7, volume: 1.0, desc: 'Глубокий, весомый' },
        friendly: { rate: 1.0, pitch: 1.1, volume: 0.9, desc: 'Тёплый, приветливый' }
    },

    // Инициализация
    init: function() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Распознавание речи не поддерживается');
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ru-RU';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI();
            app.setStatus('слушаю...');
            document.getElementById('avatarContainer').classList.add('listening');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI();
            app.setStatus('онлайн');
            document.getElementById('avatarContainer').classList.remove('listening');
        };

        this.recognition.onresult = (e) => {
            const text = e.results[0][0].transcript;
            console.log('Распознано:', text);
            app.handleInput(text, 'voice');
        };

        this.recognition.onerror = (e) => {
            console.error('Ошибка:', e.error);
            this.isListening = false;
            this.updateUI();

            if (e.error === 'not-allowed') {
                app.showMessage('Разрешите доступ к микрофону', 'error');
            } else if (e.error === 'no-speech') {
                app.speak('Не расслышал, повторите');
            }
        };

        return true;
    },

    // Включить/выключить
    toggle: function() {
        if (!this.recognition) {
            if (!this.init()) {
                app.showMessage('Голосовой ввод не поддерживается', 'error');
                return;
            }
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    },

    // Обновить UI
    updateUI: function() {
        const btn = document.getElementById('voiceBtn');
        const hint = document.getElementById('hint');

        if (this.isListening) {
            btn.classList.add('listening');
            btn.textContent = '👂';
            hint.textContent = 'Говорите...';
        } else {
            btn.classList.remove('listening');
            btn.textContent = '🎤';
            hint.textContent = 'Нажмите 🎤 и говорите';
        }
    },

    // Озвучить текст
    speak: function(text) {
        if (!window.speechSynthesis) {
            console.log('Озвучка не поддерживается');
            return;
        }

        // Остановить предыдущую речь
        window.speechSynthesis.cancel();

        this.isSpeaking = true;
        document.getElementById('avatar').classList.add('speaking');
        app.setStatus('говорит');

        const preset = this.presets[storage.data.voice] || this.presets.intense;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        utterance.rate = preset.rate;
        utterance.pitch = preset.pitch;
        utterance.volume = preset.volume;

        // Выбрать лучший голос
        const voices = window.speechSynthesis.getVoices();
        const russianVoice = voices.find(v => 
            v.lang.includes('ru') && (v.name.includes('Google') || v.name.includes('Premium'))
        ) || voices.find(v => v.lang.includes('ru'));

        if (russianVoice) {
            utterance.voice = russianVoice;
        }

        utterance.onend = () => {
            this.isSpeaking = false;
            document.getElementById('avatar').classList.remove('speaking');
            app.setStatus('онлайн');
        };

        utterance.onerror = (e) => {
            console.error('Ошибка озвучки:', e);
            this.isSpeaking = false;
            document.getElementById('avatar').classList.remove('speaking');
        };

        window.speechSynthesis.speak(utterance);
    },

    // Остановить речь
    stop: function() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        this.isSpeaking = false;
    }
};

// Загрузить голоса при старте
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        console.log('Голоса загружены:', window.speechSynthesis.getVoices().length);
    };
}
