const { validateKoreaDate } = require('./validation');

const checkLabRecruitStatus = (startDate, recruit) => {
  const today = validateKoreaDate(new Date());
  if (recruit && startDate < today) {
    return true;
  }
  return false;
};

const checkLabNewStatus = createDate => {
  const today = new Date();
  if (createDate + 6 > today) {
    return true;
  }
  return false;
};

module.exports = {
  checkLabRecruitStatus,
  checkLabNewStatus,
};
