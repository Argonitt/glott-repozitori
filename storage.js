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
            console.error('Ошибка загрузки:', e);
            this.reset();
        }
    },

    safeGet: function(key, defaultValue) {
        try {
            const item = localStorage.getItem(`glott_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    // СЕЙЧАС (баг):
save: function(key, value) {
    this.data[key] = value;
    localStorage.setItem('glott_' + key, JSON.stringify(value)); // ❌ Всё stringify, даже строки
},

get: function(key) {
    return this.data[key]; // ❌ Нет чтения из localStorage при старте
},
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                if (key === 'history') {
                    this.data[key] = this.data[key].slice(-20);
                    localStorage.setItem(`glott_${key}`, JSON.stringify(this.data[key]));
                    return true;
                }
            }
            console.error('Ошибка сохранения:', e);
            return false;
        }
    },

    addToHistory: function(input, response) {
        const item = {
            input: String(input).substring(0, 500),
            response: String(response).substring(0, 1000),
            time: Date.now(),
            date: new Date().toISOString()
        };
        
        this.data.history.push(item);
        if (this.data.history.length > 100) {
            this.data.history = this.data.history.slice(-100);
        }
        this.save('history', this.data.history);
    },

    export: function() {
        try {
            const data = {
                version: '7.2',
                date: new Date().toISOString(),
                data: this.data
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `glott-backup-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            if (window.app) app.showMessage('✅ Данные экспортированы!');
        } catch (e) {
            if (window.app) app.showMessage('❌ Ошибка экспорта');
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
                    
                    if (!imported.data) throw new Error('Неверный формат файла');
                    
                    const keys = ['personality', 'voice', 'theme', 'history', 'notes', 'reminders'];
                    keys.forEach(key => {
                        if (imported.data[key] !== undefined) {
                            this.data[key] = imported.data[key];
                            localStorage.setItem(`glott_${key}`, JSON.stringify(imported.data[key]));
                        }
                    });
                    
                    if (window.app) {
                        app.showMessage('✅ Данные импортированы! Перезагрузка...');
                        setTimeout(() => location.reload(), 1000);
                    }
                } catch (err) {
                    if (window.app) app.showMessage('❌ Ошибка: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    },

    clear: function() {
        if (!confirm('Очистить ВСЕ данные? Это нельзя отменить!')) return;
        
        const keys = ['personality', 'voice', 'theme', 'history', 'notes', 'reminders', 'patterns'];
        keys.forEach(key => localStorage.removeItem(`glott_${key}`));
        
        this.reset();
        if (window.app) {
            app.showMessage('🗑️ Все данные очищены!');
            setTimeout(() => location.reload(), 500);
        }
    },

    reset: function() {
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
