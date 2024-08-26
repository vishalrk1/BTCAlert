export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getUTCDate(); // Get the day of the month (1-31)
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[date.getUTCMonth()]; // Get the month name

  let hours = date.getUTCHours(); // Get the hour (0-23)
  const minutes = date.getUTCMinutes(); // Get the minutes (0-59)
  const ampm = hours >= 12 ? "pm" : "am"; // Determine AM or PM

  hours = hours % 12; // Convert to 12-hour format
  hours = hours || 12; // The hour '0' should be '12'

  const formattedMinutes = minutes.toString().padStart(2, '0'); // Add leading zero to minutes if needed

  // Add ordinal suffix to day
  const ordinalSuffix = getOrdinalSuffix(day);

  return `${day}${ordinalSuffix} ${month} ${hours}:${formattedMinutes}${ampm}`;
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}