function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRoundNumber(min, max) {
  const range = max - min + 1;
  const randomOffset = Math.floor(Math.random() * range);
  const roundedNumber = Math.floor((min + randomOffset) / 5) * 5;
  return roundedNumber;
}

module.exports = { getRandomNumber, getRandomRoundNumber };
