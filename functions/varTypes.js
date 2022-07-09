const getType = (input) => {
  let regex = new RegExp(/^\[object (\S+?)\]$/);
  let matches = Object.prototype.toString.call(input).match(regex) || [];
  return (matches[1] || 'undefined').toLowerCase();
};

module.exports = {
  getType
}