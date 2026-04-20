'use strict';

/* =====================================================
   TRANSLATION STORAGE
===================================================== */

// Object that will hold all translation dictionaries
/* ReqI2 */
let translations = {};

/* =====================================================
   TRANSLATION APPLICATION
===================================================== */

/* ReqI3 */
/**
 * Applies translations to elements declaring i18n attributes.
 * @param {string} locale Language code (e.g. 'en', 'es')
 */
function applyTranslations(locale) {

    const dictionary = translations[locale];

    if (!dictionary) {
        console.warn(`Translations for "${locale}" not found.`);
        return;
    }

    /* ---- Text content ---- */
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        const text = dictionary[key];

        if (text !== undefined) {
            // Check if it's an input with specific attributes
            // But per instructions, text replace innerHTML
            element.innerHTML = text;
        }
    });

    /* ---- ALT attributes ---- */
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.dataset.i18nAlt;
        if (dictionary[key]) element.alt = dictionary[key];
    });

    /* ---- TITLE attributes ---- */
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.dataset.i18nTitle;
        if (dictionary[key]) element.title = dictionary[key];
    });

    // Update document language for accessibility
    document.documentElement.lang = locale;
}

/* =====================================================
   DATE FORMATTING
===================================================== */

/* ReqI8 */
/**
 * Create a date formatter based on the selected locale.
 */
function createDateFormatter(locale) {
    const dateLocale = locale === 'es' ? 'es-ES' : 'en-GB';

    return new Intl.DateTimeFormat(dateLocale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDate(date, formatter) {
    return formatter.format(date);
}

function applyDateFormat(locale) {
    const formatter = createDateFormatter(locale);

    const dateElements = document.querySelectorAll('[data-date]');

    dateElements.forEach(el => {
        const dateStr = (el.dataset.date || '').trim();
        if (!dateStr) return;

        const date = new Date(dateStr);

        if (isNaN(date)) {
            console.error('Invalid date in data-date:', dateStr);
            el.textContent = 'Invalid date';
            return;
        }

        el.textContent = formatDate(date, formatter);
    });
}

/* =====================================================
   CURRENCY FORMATTING
===================================================== */

/*ReqI9*/
/* ReqI10 */
/**
 * Create a currency formatter based on the selected locale.
 */
function createCurrencyFormatter(locale) {
    const numberLocale = locale === 'es' ? 'es-ES' : 'en-GB';

    return new Intl.NumberFormat(numberLocale, {
        style: 'currency',
        currency: locale === 'es' ? 'EUR' : 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatPrice(price, formatter) {
    return formatter.format(price);
}

function applyPriceFormat(locale) {
    const formatter = createCurrencyFormatter(locale);
    const priceElements = document.querySelectorAll('[data-price]');

    priceElements.forEach(el => {
        const priceStr = (el.dataset.price || '').trim();
        if (!priceStr) return;
        const price = Number(priceStr);
        if (isNaN(price)) {
            console.error('Invalid price in data-price:', priceStr);
            el.textContent = 'Invalid price';
            return;
        }
        el.textContent = formatPrice(price, formatter);
    });
}

/* =====================================================
   INITIALISATION
===================================================== */

/* ReqI5 */
(function initI18n() {
    const i18nSelectors = [
        '[data-i18n]',
        '[data-i18n-alt]',
        '[data-i18n-title]',
        '[data-date]',
        '[data-price]',
        '#language-switcher'
    ].join(',');

    if (!document.querySelector(i18nSelectors)) {
        console.debug('i18n: no translatable elements or language control found — initialization skipped.');
        return;
    }

    /* ReqI6 */
    console.debug('i18n: translatable elements or language control detected — initializing.');

    // Determine the most accurate base URL for fetching the translations file
    const currentScriptUrl = (document.currentScript && document.currentScript.src)
        || (document.querySelector('script[src*="i18n"]') && document.querySelector('script[src*="i18n"]').src)
        || window.location.href;

    const translationUrl = new URL('translations.json', currentScriptUrl).href;

    // Load translation file
    fetch(translationUrl)
        .then(response => response.json())
        .then(data => {
            translations = data;
            const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';

            // Set the switcher if it exists
            const switcher = document.getElementById('language-switcher');
            if (switcher) {
                switcher.value = savedLanguage;
            }

            switchLanguage(savedLanguage);
        })
        .catch(error => {
            console.error('Failed to load translations:', error);
        });
})(); // self-invoking function to run immediately on script load

/* ReqI4 */
/**
 * Changes language and stores user preference.
 */
function switchLanguage(locale) {
    applyTranslations(locale);
    applyDateFormat(locale);
    applyPriceFormat(locale);
    localStorage.setItem('preferredLanguage', locale);
}
