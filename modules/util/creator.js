const createRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createToday = () => {
  const offset = 32400000;
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const date = new Date().getDate();
  return new Date(new Date(year, month, date).getTime() + offset).toISOString();
};

const createTomorrow = () => {
  const offset = 32400000;
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const date = new Date().getDate() - 1;
  return new Date(new Date(year, month, date).getTime() + offset).toISOString();
};

module.exports = {
  createRandomNumber,
  createToday,
  createTomorrow,
};
