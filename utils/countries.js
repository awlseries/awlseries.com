// utils/countries.js
export const countryList = [
  { code: 'ru', name: 'Россия', flag: '🇷🇺' },
  { code: 'us', name: 'США', flag: '🇺🇸' },
  { code: 'de', name: 'Германия', flag: '🇩🇪' },
  { code: 'fr', name: 'Франция', flag: '🇫🇷' },
  { code: 'gb', name: 'Великобритания', flag: '🇬🇧' },
  { code: 'jp', name: 'Япония', flag: '🇯🇵' },
  { code: 'kr', name: 'Корея', flag: '🇰🇷' },
  { code: 'cn', name: 'Китай', flag: '🇨🇳' },
  { code: 'br', name: 'Бразилия', flag: '🇧🇷' },
  { code: 'in', name: 'Индия', flag: '🇮🇳' },
  { code: 'ca', name: 'Канада', flag: '🇨🇦' },
  { code: 'au', name: 'Австралия', flag: '🇦🇺' },
  { code: 'it', name: 'Италия', flag: '🇮🇹' },
  { code: 'es', name: 'Испания', flag: '🇪🇸' },
  { code: 'ua', name: 'Украина', flag: '🇺🇦' },
  { code: 'kz', name: 'Казахстан', flag: '🇰🇿' },
  { code: 'by', name: 'Беларусь', flag: '🇧🇾' },
  { code: 'pl', name: 'Польша', flag: '🇵🇱' },
  { code: 'tr', name: 'Турция', flag: '🇹🇷' },
  { code: 'nl', name: 'Нидерланды', flag: '🇳🇱' },
  { code: 'se', name: 'Швеция', flag: '🇸🇪' },
  { code: 'no', name: 'Норвегия', flag: '🇳🇴' },
  { code: 'fi', name: 'Финляндия', flag: '🇫🇮' },
  { code: 'dk', name: 'Дания', flag: '🇩🇰' },
];

export const getCountryByCode = (code) => {
  return countryList.find(country => country.code === code) || countryList[0];
};