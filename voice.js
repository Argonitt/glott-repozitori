const voice = {
    recognition: null,
    isListening: false,
    isSpeaking: false,
    voicesLoaded: false,

    presets: {
        intense: { rate: 1.1, pitch: 1.0, volume: 1.0 },
        calm: { rate: 0.9, pitch: 0.9, volume: 0.8 },
        deep: { rate: 0.8, pitch: 0.7, volume: 1.0 },
        friendly: { rate: 1.0, pitch: 1.1, volume: 0.9 }
    },

    init: function() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Распознавание речи не поддерживается');
            return false;
        }

        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'ru-RU';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI();
                app.setStatus('слушаю...');
                document.getElementById('avatarContainer')?.classList.add('listening');
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateUI();
                app.setStatus('онлайн');
                document.getElementById('avatarContainer')?.classList.remove('listening');
            };

            this.recognition.onresult = (e) => {
                if (e.results.length > 0) {
                    const text = e.results[0][0].transcript;
                    app.handleInput(text, 'voice');
                }
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

            this.loadVoices();
            if (window.speechSynthesis) {
                window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }

            return true;
        } catch (e) {
            return false;
        }
    },

    loadVoices: function() {
        if (!window.speechSynthesis) return;
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) this.voicesLoaded = true;
    },

    getRussianVoice: function() {
        if (!window.speechSynthesis) return null;
        const voices = window.speechSynthesis.getVoices();
        return voices.find(v => v.lang.includes('ru') && v.name.includes('Google')) ||
               voices.find(v => v.lang.includes('ru') && v.name.includes('Microsoft')) ||
               voices.find(v => v.lang.includes('ru'));
    },

    toggle: function() {
        if (!this.recognition) {
            if (!this.init()) {
                app.showMessage('Голосовой ввод не поддерживается', 'error');
                return;
            }
        }

        try {
            if (this.isListening) {
                this.recognition.stop();
            } else {
                this.recognition.start();
            }
        } catch (e) {
            app.showMessage('Ошибка доступа к микрофону', 'error');
        }
    },

    updateUI: function() {
        const btn = document.getElementById('voiceBtn');
        const hint = document.getElementById('hint');
        if (!btn || !hint) return;

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

    speak: function(text) {
        if (!window.speechSynthesis) return;

        this.stop();

        this.isSpeaking = true;
        const avatar = document.getElementById('avatar');
        if (avatar) avatar.classList.add('speaking');
        app.setStatus('говорит');

        const preset = this.presets[storage.data.voice] || this.presets.intense;
        const chunks = this.splitText(text);
        let currentChunk = 0;

        const speakChunk = () => {
            if (currentChunk >= chunks.length) {
                this.isSpeaking = false;
                if (avatar) avatar.classList.remove('speaking');
                app.setStatus('онлайн');
                return;
            }

            const utterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
            utterance.lang = 'ru-RU';
            utterance.rate = preset.rate;
            utterance.pitch = preset.pitch;
            utterance.volume = preset.volume;

            const voice = this.getRussianVoice();
            if (voice) utterance.voice = voice;

            utterance.onend = () => {
                currentChunk++;
                speakChunk();
            };

            utterance.onerror = () => {
                currentChunk++;
                speakChunk();
            };

            window.speechSynthesis.speak(utterance);
        };

        speakChunk();
    },

    splitText: function(text, maxLength = 180) {
        if (text.length <= maxLength) return [text];
        
        const chunks = [];
        const sentences = text.split(/([.!?]+)/);
        let current = '';
        
        for (let i = 0; i < sentences.length; i++) {
            const part = sentences[i];
            if ((current + part).length > maxLength && current.length > 0) {
                chunks.push(current.trim());
                current = part;
            } else {
                current += part;
            }
        }
        if (current.trim()) chunks.push(current.trim());
        
        return chunks.length > 0 ? chunks : [text.substring(0, maxLength)];
    },

    stop: function() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        this.isSpeaking = false;
        const avatar = document.getElementById('avatar');
        if (avatar) avatar.classList.remove('speaking');
    }
};
