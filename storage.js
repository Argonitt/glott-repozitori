# 3. storage.js - работа с хранилищем
storage_js = '''// Хранилище данных
const storage = {
    data: {
        personality: localStorage.getItem('glott_personality') || 'friend',
        voice: localStorage.getItem('glott_voice') || 'intense',
        theme: localStorage.getItem('glott_theme') || 'dark',
        history: JSON.parse(localStorage.getItem('glott_history') || '[]'),
        notes: JSON.parse(localStorage.getItem('glott_notes') || '[]'),
        reminders: JSON.parse(localStorage.getItem('glott_reminders') || '[]'),
        patterns: JSON.parse(localStorage.getItem('glott_patterns') || '{}')
    },

    // Сохранить
    save: function(key, value) {
        this.data[key] = value;
        localStorage.setItem('glott_' + key, JSON.stringify(value));
    },

    // Получить
    get: function(key) {
        return this.data[key];
    },

    // Добавить в историю
    addToHistory: function(input, response, type = 'chat') {
        const item = {
            input: input,
            response: response,
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

    // Экспорт всех данных
    export: function() {
        const exportData = {
            version: '7.0',
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
        
        app.showMessage('Данные экспортированы!', 'system');
    },

    // Импорт данных
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
                    
                    if (imported.data) {
                        Object.keys(imported.data).forEach(key => {
                            this.data[key] = imported.data[key];
                            localStorage.setItem('glott_' + key, JSON.stringify(imported.data[key]));
                        });
                        
                        app.showMessage('Данные импортированы!', 'system');
                        location.reload();
                    }
                } catch (err) {
                    app.showMessage('Ошибка импорта: ' + err.message, 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    },

    // Очистить всё
    clear: function() {
        if (!confirm('Очистить ВСЕ данные Глота?')) return;
        
        localStorage.removeItem('glott_personality');
        localStorage.removeItem('glott_voice');
        localStorage.removeItem('glott_theme');
        localStorage.removeItem('glott_history');
        localStorage.removeItem('glott_notes');
        localStorage.removeItem('glott_reminders');
        localStorage.removeItem('glott_patterns');
        
        this.data = {
            personality: 'friend',
            voice: 'intense',
            theme: 'dark',
            history: [],
            notes: [],
            reminders: [],
            patterns: {}
        };
        
        app.showMessage('Все данные очищены!', 'system');
        setTimeout(() => location.reload(), 1000);
    }
};
'''

with open(f"{project_dir}/storage.js", 'w', encoding='utf-8') as f:
    f.write(storage_js)
