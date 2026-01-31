// Хранилище данных с валидацией и обработкой ошибок
const storage = {
    data: {
        personality: 'friend',
        voice: 'intense',
        theme: 'dark',
        history: [],
        notes: [],
        reminders: [],
        patterns: {}
    },

    init: function() {
        try {
            this.data.personality = this.safeGet('personality', 'friend');
            this.data.voice = this.safeGet('voice', 'intense');
            this.data.theme = this.safeGet('theme', 'dark');
            this.data.history = this.safeGet('history', []);
            this.data.notes = this.safeGet('notes', []);
            this.data.reminders = this.safeGet('reminders', []);
            this.data.patterns = this.safeGet('patterns', {});
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
            this.resetToDefaults();
        }
    },

    safeGet: function(key, defaultValue) {
        try {
            const item = localStorage.getItem(`glott_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn(`Ошибка чтения ${key}:`, e);
            return defaultValue;
        }
    },

    save: function(key, value) {
        try {
            this.data[key] = value;
            localStorage.setItem(`glott_${key}`, JSON.stringify(value));
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                if (key === 'history' && value.length > 10) {
                    const trimmed = value.slice(-10);
                    this.data[key] = trimmed;
                    localStorage.setItem(`glott_${key}`, JSON.stringify(trimmed));
                    app.showMessage('Хранилище заполнено, очищена старая история', 'warning');
                    return true;
                }
                app.showMessage('Хранилище переполнено. Очистите историю.', 'error');
            }
            return false;
        }
    },

    addToHistory: function(input, response, type = 'chat') {
        const cleanInput = this.sanitizeString(input);
        const cleanResponse = this.sanitizeString(response);
        
        const item = {
            input: cleanInput.substring(0, 500),
            response: cleanResponse.substring(0, 1000),
            type: type,
            time: Date.now(),
            date: new Date().toISOString()
        };
        
        this.data.history.push(item);
        if (this.data.history.length > 100) {
            this.data.history = this.data.history.slice(-100);
        }
        this.save('history', this.data.history);
    },

    sanitizeString: function(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[<>]/g, '');
    },

    export: function() {
        try {
            const exportData = {
                version: '7.1',
                exportDate: new Date().toISOString(),
                data: this.data
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `glott-backup-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            app.showMessage('Данные экспортированы!', 'success');
        } catch (e) {
            app.showMessage('Ошибка экспорта', 'error');
        }
    },

    import: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    
                    if (!imported.data || typeof imported.data !== 'object') {
                        throw new Error('Неверная структура файла');
                    }

                    const required = ['personality', 'voice', 'theme', 'history', 'notes', 'reminders', 'patterns'];
                    const missing = required.filter(key => !(key in imported.data));
                    
                    if (missing.length > 0) {
                        throw new Error(`Отсутствуют поля: ${missing.join(', ')}`);
                    }

                    Object.keys(imported.data).forEach(key => {
                        if (required.includes(key)) {
                            this.data[key] = imported.data[key];
                            localStorage.setItem(`glott_${key}`, JSON.stringify(imported.data[key]));
                        }
                    });

                    app.showMessage('Данные импортированы! Перезагрузка...', 'success');
                    setTimeout(() => location.reload(), 1000);
                } catch (err) {
                    app.showMessage('Ошибка импорта: ' + err.message, 'error');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    },

    clear: function() {
        if (!confirm('Очистить ВСЕ данные Глота? Это действие нельзя отменить.')) return;

        try {
            const keys = ['personality', 'voice', 'theme', 'history', 'notes', 'reminders', 'patterns'];
            keys.forEach(key => localStorage.removeItem(`glott_${key}`));
            
            this.resetToDefaults();
            app.showMessage('Все данные очищены!', 'success');
            setTimeout(() => location.reload(), 1000);
        } catch (e) {
            app.showMessage('Ошибка очистки данных', 'error');
        }
    },

    resetToDefaults: function() {
        this.data = {
            personality: 'friend',
            voice: 'intense',
            theme: 'dark',
            history: [],
            notes: [],
            reminders: [],
            patterns: {}
        };
    }
};

storage.init();
