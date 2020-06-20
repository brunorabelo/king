export function createDeck () {
  const cards = new Array(52)
  const suits = 'spade heart club diamond'.split(' ');
  const ranks = '2 3 4 5 6 7 8 9 10 j q k a'.split(' ');
  for (let i = 0; i < cards.length; i++) {
    const suit = suits[Math.floor(i / 13)];
    const value = i % 13;
    const rank = i < 52 ? ranks[i % 13] : ranks[13];
    const card = {
      i,
      suit,
      value,
      rank
    };
    cards[i] = card;
  }
  return cards
}


export function shuffle (array) {
  let shuffledArray = array.slice()
  var i = 0
    , j = 0
    , temp = null

  for (i = shuffledArray.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = shuffledArray[i]
    shuffledArray[i] = shuffledArray[j]
    shuffledArray[j] = temp
  }
  return shuffledArray
}


export function shuffleAndDistribute (deck, nPlayers) {
  let shuffledDeck = shuffle(deck)
  let playersHands = new Object()
  const q = 13
  for (let i = 0; i < nPlayers; i++) {
    playersHands[i] = shuffledDeck.splice(0, q)
  }
  return playersHands
}

