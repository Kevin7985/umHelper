const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min) ) + min;
}

const generateString = (string_size) => {
  const alphabet = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
  let out = '';

  for (let i = 0; i < string_size; i++) {
    out += alphabet.charAt(getRndInteger(0, alphabet.length));
  }
  
  return out;
};

module.exports = {
  generateString
};