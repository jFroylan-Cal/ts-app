export function formatDates(date: String): Date {
  const dateSplit = date.split('-');
  const year = dateSplit[0];
  const month = dateSplit[1];
  const day = dateSplit[2];
  const dateFormat = new Date(Number(year), Number(month) - 1, Number(day));
  return dateFormat;
}
