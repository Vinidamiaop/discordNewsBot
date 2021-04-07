function currentTime() {
  const time = new Date();
  const hour = time.getUTCHours() - 3;
  const minutes = time.getMinutes();
  const currentDate = time.getDate();
  const currentMonth = time.getMonth();
  const currentYear = time.getFullYear();
  return `${currentDate}/${currentMonth}/${currentYear} - ${hour}:${minutes}`;
}

module.exports = currentTime;
