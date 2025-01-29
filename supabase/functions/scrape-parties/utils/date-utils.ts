export function getWeeks(startDate: Date, endDate: Date) {
  const weeks = [];
  let currentDate = new Date(startDate);
  
  // Adjust to Monday
  while (currentDate.getDay() !== 1) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    weeks.push({
      start: weekStart,
      end: weekEnd > endDate ? endDate : weekEnd
    });

    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
}

export function formatDate(date: Date) {
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear()
  ].join('/');
}

export function getTargetMonth(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function constructUrl(weekStart: Date, weekEnd: Date) {
  const baseUrl = "https://www.ibiza-spotlight.es/night/events";
  const month = getTargetMonth(weekEnd);
  const start = formatDate(weekStart);
  const end = formatDate(weekEnd);

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `${baseUrl}/${month}`;
  } else {
    return `${baseUrl}/${month}?daterange=${start}-${end}`;
  }
}