const validatePhone = number => {
  const splitNumber = number.split(' ')[1];
  return `0${splitNumber}`;
};

const validateDateFormat = date => {
  const dateFormat2 = `${date.getFullYear()}-${
    date.getMonth() + 1 < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()}`;
  return dateFormat2;
};

const validateKoreaDate = date => {
  const offset = 1000 * 60 * 60 * 9;
  const koreaDate = new Date(date.getTime() + offset);
  return koreaDate;
};

const validateDeleteTime = date => {
  const splitDate = String(date).split('T')[0];
  const year = splitDate.split('-')[0];
  const month = splitDate.split('-')[1] - 1;
  const newDate = splitDate.split('-')[2];
  const result = new Date(year, month, newDate, 0, 0, 0);
  return result;
};

const validateLabStatus = (startDate, endDate) => {
  const today = new Date();
  if (startDate < today && endDate > today) {
    return true;
  }
  return false;
};

const validateCombineTimeAndDate = (date, time) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const newDate = date.getDate();
  const splitTime = Number(time.split(':')[0]);
  const offset = 1000 * 60 * 60 * 9;
  const result = new Date(
    new Date(year, month, newDate, splitTime).getTime() + offset,
  );
  return result;
};

const validateSecretPhone = phone => {
  const splitNumber = phone.split('-');
  const firstNumber = splitNumber[0];
  const lastNumber = splitNumber[2];
  return `${firstNumber} **** ${lastNumber}`;
};

module.exports = {
  validatePhone,
  validateDateFormat,
  validateKoreaDate,
  validateDeleteTime,
  validateCombineTimeAndDate,
  validateLabStatus,
  validateSecretPhone,
};
