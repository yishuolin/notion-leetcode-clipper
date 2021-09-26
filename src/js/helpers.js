const getDateString = () => {
  const d = new Date();
  const month = (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1);
  return d.getFullYear() + '-' + month + '-' + d.getDate();
};

export { getDateString };
