export const formatLocalDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const year = date.getFullYear().toString().slice(-2);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}


export function formatDateToYYYYMMDD(currentDate) {

  // Get the current date components
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  // Format the date as "YYYY-mm-dd"
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}