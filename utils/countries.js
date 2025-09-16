// countries.js - список всех стран с кодами и флагами
const COUNTRIES = [
    { code: 'KZ', name: 'Казахстан', flag: '../public/images/icons/icon-kazakhstan.png' },
    { code: 'RU', name: 'Россия', flag: '../public/images/icons/icon-russia.png' },
    { code: 'US', name: 'США', flag: '../public/images/icons/icon-usa.png' },
    { code: 'DE', name: 'Германия', flag: '../public/images/icons/icon-germany.png' },
    { code: 'FR', name: 'Франция', flag: '../public/images/icons/icon-france.png' },
    { code: 'GB', name: 'Великобритания', flag: '../public/images/icons/icon-uk.png' },
    { code: 'CN', name: 'Китай', flag: '../public/images/icons/icon-china.png' },
    { code: 'JP', name: 'Япония', flag: '../public/images/icons/icon-japan.png' },
    { code: 'KR', name: 'Корея', flag: '../public/images/icons/icon-korea.png' },
    { code: 'BR', name: 'Бразилия', flag: '../public/images/icons/icon-brazil.png' },
    // Добавьте остальные страны...
];

// Функция поиска страны по коду
function getCountryByCode(code) {
    return COUNTRIES.find(country => country.code === code) || COUNTRIES[0];
}