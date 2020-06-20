const deck = createDeck()
const gameState = {
  rounds: [],
  players: new Array(4)
}


function updateScreen () {
  const playerTurnName = getCurrentPlayer().name
  const boardPlayCards = Object.values(getCurrentTrick().cardPlays)
  const players = getPlayersWithHands()
  renderScreen(getCurrentRound().number, playerTurnName, boardPlayCards, players)
}

function startGame () {
  gameState.players = createPlayers()
  playRound(1)
}

function createPlayers () {
  let players = new Array(4)
  for (let i = 0; i < players.length; i++) {
    players[i] = {
      id: i + 10,
      name: 'jogador ' + (i + 1).toString(),
      points: 0
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
  gameState.rounds.push(round)
  nextTrick(round, (roundNumber * 1 - 1) % 4)
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

function updatePontuation (round) {
  listCards = function (tricks) {
    let cards = (tricks.map(x => Object.values(x.cardPlays)))
    let cardList = cards.reduce((a, b) => a.concat(b), [])
    return cardList
  }
  let playersTricks = [[], [], [], []]
  function test (acc, curr){
    return acc + curr.filter(x => x.suit === 'heart').length
  }
  const roundPontuationRules = {
    1: x => x.length * (-20),
    2: x => x.reduce((acc, curr)=> acc + curr.filter(x => x.suit === 'heart').length, 0) * (-20),
    3: x => x.reduce((acc, curr) => acc + curr.filter(x => x.rank === 'j' || x.rank === 'k').length, 0) * (-30),
    4: x => x.reduce((acc, curr) => acc + curr.filter(x => x.rank === 'q').length, 0) * (-50),
    5: x => x.length * (-90),
    6: x => x.reduce((acc, curr) => acc + curr.filter(x => x.rank === 'k' && x.suit === 'heart').length, 0) * (-160),
    7: x => x.length * (+20),
    8: x => x.length * (+20),
    9: x => x.length * (+20),
    10: x => x.length * (+20),
  }
  function fillPlayerTricks (tricks) {
    for (let i = round.number === 5 ? 11 : 0; i < tricks.length; i++) {
      const trick = tricks[i]
      const winnerId = checkTrickWinnerPlayerId(trick)
      playersTricks[winnerId].push(listCards([trick]))
    }
  }
  fillPlayerTricks(round.tricks)
  for (let i = 0; i < playersTricks.length;i++){
    const rule = roundPontuationRules[round.number]
    const res = rule(playersTricks[i])
    gameState.players[i].points += res

    console.log({id:i,points:res})
  }
}

function nextTrick (round, startPlayerIdx) {
  if (checkRoundIsFinished(round)) {
    updatePontuation(round)
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
  return Object.keys(trick.cardPlays).length >= 4
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
    console.log({
      error: 'index inválido'
    })
    return
  }
  const card = playerHand[index]
  if (!checkValidCard(currentTrick, playerHand, card)) {
    console.log({
      error: 'carta não permitida'
    })
    return
  }
  playerHand.splice(index, 1)
  currentTrick.cardPlays[playerTurnIdx] = card

  nextPlayerTurn(currentTrick)
  updateScreen()
  autoPlay()

}

function autoPlay(){
  const currentRound = getCurrentRound()
  const player = getCurrentPlayer().idx
  const trick = getCurrentTrick()
  if (player===0){
    return
  }
  const hand = currentRound.playerHands[player]
  const cardIdx = hand.findIndex(x=>checkValidCard(trick, hand, x))
  playCard(cardIdx)

}
function satisfyRoundRestriction (roundNumber, playerHand, card) {
  const noRestricition = x => true
  const cantPlayHeart = x => x.suit !== 'heart'
  const roundRestrictions = {
    2: cantPlayHeart,
    6: cantPlayHeart
    //restante não possuem restrições
  }
  const roundRestriction = roundRestrictions[roundNumber] || noRestricition
  const res = roundRestriction(card) || !playerHand.find(roundRestriction)
  return res
}

function checkValidCard (currentTrick, playerHand, card) {
  const firstCardPlayed = currentTrick.cardPlays[currentTrick.startPlayerIdx]
  if (!firstCardPlayed && satisfyRoundRestriction(currentTrick.round.number, playerHand, card)) {
    // Não está certo, falta checar se o naipe pode naquela rodada
    return true
  }
  else if (!firstCardPlayed) {
    console.log({
      error: 'não pode jogar esse naipe na primeira rodada, pois ainda tem outros'
    })
    return false
  }
  const startedSuit = firstCardPlayed.suit
  if (startedSuit === card.suit) {
    return true
  }

  if (playerHand.find(x => x.suit === startedSuit)) {
    return false
  }
  return true
}

function checkRoundIsFinished (round) {
  listCards = function (tricks) {
    let cards = (tricks.map(x => Object.values(x.cardPlays)))
    let cardList = cards.reduce((a, b) => a.concat(b), [])
    return cardList
  }
  const cardList = listCards(round.tricks)
  const defaultRule = x => x.length >= 52
  const roundFInishedRules = {
    1: defaultRule,
    2: x => x.filter(x => x.suit === 'heart').length >= 13,
    3: x => x.filter(x => x.rank === 'j' || x.rank === 'k').length >= 8,
    4: x => x.filter(x => x.rank === 'q').length >= 4,
    5: defaultRule,
    6: x => x.filter(x => x.rank === 'k' && x.suit === 'heart').length >= 1
    //7,8,9,10 são default
  }
  const roundRule = roundFInishedRules[round.number] || defaultRule
  return roundRule(cardList)
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

