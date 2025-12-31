export const getZodiacSign = (day, month) => {
  const days = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const signs = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'];
  let monthIndex = month - 1;
  if (day < days[monthIndex]) monthIndex = (monthIndex - 1 + 12) % 12;
  return signs[monthIndex];
};

export const formatUserInput = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatName = (name) => {
  if (!name) return '';
  return name.toUpperCase();
}
