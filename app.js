// ==========================================
// ИСПРАВЛЕННЫЙ БЛОК ПЕРЕВОДА в app.js
// ==========================================

// Метод для определения языка
detectLanguage: function(text) {
    // Проверяем наличие кириллицы
    const hasCyrillic = /[а-яёА-ЯЁ]/.test(text);
    // Проверяем наличие латиницы
    const hasLatin = /[a-zA-Z]/.test(text);
    
    if (hasCyrillic) return 'ru';
    if (hasLatin) return 'en';
    return 'ru'; // По умолчанию считаем русским
},

// Исправленная функция перевода с автоопределением направления
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
},

// Обновлённая генерация ответа с улучшенной командой перевода
generateResponse: function(text) {
    const lower = text.toLowerCase();
    const p = this.personalities[this.config.personality];
    
    // ... (весь предыдущий код до перевода) ...
    
    // ИСПРАВЛЕННЫЙ БЛОК ПЕРЕВОДА
    if (lower.includes('переведи') || lower.includes('перевод')) {
        // Убираем слова-команды из текста
        let toTranslate = text.replace(/переведи|перевод|на английский|на русский/gi, '').trim();
        
        if (toTranslate) {
            // Запускаем перевод с автоопределением
            setTimeout(() => this.translateText(toTranslate), 100);
            
            // Определяем направление для сообщения
            const detected = this.detectLanguage(toTranslate);
            const direction = detected === 'ru' ? 'русский → английский' : 'английский → русский';
            
            return `🔄 Перевожу (${direction}):\n"${toTranslate.substring(0, 100)}${toTranslate.length > 100 ? '...' : ''}"`;
        } else {
            return 'Что перевести? Скажите:\n• "Переведи Hello world"\n• "Переведи Привет мир"\n\nЯ автоматически определю язык!';
        }
    }
    
    // ... (остальной код) ...
},

// Обновлённая справка
getHelpText: function() {
    const p = this.personalities[this.config.personality];
    return `${p.emoji}.
