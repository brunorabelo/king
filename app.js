const deck = createDeck()
const gameState = {
  rounds: [],
  players: new Array(4)
}



function updateScreen () {
  const playerTurnName = getCurrentPlayer().name
  const boardPlayCards = Object.values(getCurrentTrick().cardPlays)
  const players = getPlayersWithHands()
  renderScreen(playerTurnName, boardPlayCards, players)
}

function startGame () {
  gameState.players = createPlayers()
  playRound()
}

function createPlayers () {
  let players = new Array(4)
  for (let i = 0; i < players.length; i++) {
    players[i] = {
      id: i + 10,
      name: 'jogador ' + (i + 1).toString()
    }
  }
  return players
}

function createDeck () {
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

function playRound (roundNumber = 1) {
  const round = createRound(roundNumber)
  let shuffledDeck = shuffle(deck)
  round.playerHands = distributeCards(gameState.players.length, shuffledDeck)
  nextTrick(round, (roundNumber * 1 - 1) % 4)
  gameState.rounds.push(round)
}


function createRound (roundNumber) {
  return {
    number: roundNumber,
    playerHands: [],
    tricks: []
  }
}

function distributeCards (nPlayers, shuffledDeck) {
  let playerHands = new Object()
  const q = 13 //cards
  for (let i = 0; i < nPlayers; i++) {
    playerHands[i] = shuffledDeck.splice(0, q)
  }
  return playerHands
}


function nextTrick (round, startPlayerIdx) {
  debugger
  if (checkRoundIsFinished(round)) {
    playRound(round.number + 1)
  }
  const trick = {
    round: round,
    startPlayerIdx: startPlayerIdx,
    cardPlays: new Object(),
    playerTurnIdx: startPlayerIdx - 1 //acertado depois
  }
  round.tricks.push(trick)
  nextPlayerTurn(trick)
  updateScreen()
}

function nextPlayerTurn (trick) {
  if (checkTrickIsFinished(trick)) {
    updateScreen()
    setTimeout(function () {
      console.log('sleep')
    }, (3 * 1000));
    nextTrick(trick.round, checkTrickWinnerPlayerId(trick))
  }
  else {
    trick.playerTurnIdx = (trick.playerTurnIdx + 1) % 4
  }
}

function checkTrickIsFinished (trick) {
  return Object.keys(trick.cardPlays).length >= 4 || checkRoundIsFinished(trick.round)
}

function checkTrickWinnerPlayerId (trick) {
  const trickSuit = trick.cardPlays[trick.startPlayerIdx].suit
  let winner = trick.startPlayerIdx
  for (let i = 0; i < Object.keys(trick.cardPlays).length; i++) {
    const currentCard = trick.cardPlays[i]
    const currentSuit = currentCard.suit
    const currentValue = currentCard.value
    if (currentSuit === trickSuit && currentValue > trick.cardPlays[winner].value) {
      winner = i
    }
  }
  console.log('fim da rodada:')
  console.log(trick)
  return winner
}

function getCurrentRound () {
  const rounds = gameState.rounds
  return rounds[rounds.length - 1]
}

function getCurrentTrick () {
  const currentRound = getCurrentRound()
  const tricks = currentRound.tricks
  return tricks[tricks.length - 1]
}

function getCurrentPlayer () {
  const currentTrick = getCurrentTrick()
  const playerTurnIdx = currentTrick.playerTurnIdx
  const round = currentTrick.round
  return { ...gameState.players[playerTurnIdx], idx: playerTurnIdx, hand: round.playerHands[playerTurnIdx] }
}

function getPlayersWithHands () {
  const round = getCurrentRound()
  let players = gameState.players.map(
    function (player, idx) {
      return { ...player, hand: round.playerHands[idx] }
    }
  )
  return players
}
function playCard (index) {
  const currentTrick = getCurrentTrick()
  const playerTurnIdx = getCurrentPlayer().idx
  let playerHand = getCurrentPlayer().hand
  if (!playerHand[index]) {
    return {
      error: 'index inválido'
    }
  }
  const card = playerHand[index]
  if (!checkValidCard(currentTrick, playerHand, card)) {
    return {
      error: 'carta não permitida'
    }
  }
  playerHand.splice(index, 1)
  currentTrick.cardPlays[playerTurnIdx] = card

  nextPlayerTurn(currentTrick)
  updateScreen()
}

function checkValidCard (currentTrick, playerHand, card) {
  const firstPlay = currentTrick.cardPlays[currentTrick.startPlayerIdx]
  if (!firstPlay) {
    // Não está certo, falta checar se o naipe pode naquela rodada
    return true
  }
  const startedSuit = firstPlay.suit
  if (startedSuit === card.suit) {
    return true
  }

  if (playerHand.find(x => x.suit === startedSuit)) {
    return false
  }
  return true
}

function checkRoundIsFinished (round) {
  const roundRules = {
    1: x => x.length >= 13
  }
  return roundRules[round.number](round.tricks)
}


function shuffle (array) {
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

