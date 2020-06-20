import { shuffleAndDistribute } from './deck.js'

export function createRound (deck, roundNumber, listenerRoundFinished) {
  const numberOfPlayers = 4
  const round = {
    number: roundNumber,
    playersHands: shuffleAndDistribute(deck, numberOfPlayers),
    tricks: [],
    roundFinished: listenerRoundFinished
  }

  function onTrickFinishedListener (trick) {
    startNextTrick(trick.winnerIdx)
  }

  function start () {
    const starterRoundPlayerIdx = (roundNumber * 1 - 1) % 4
    startNextTrick(starterRoundPlayerIdx)
  }

  function startNextTrick (starterPlayerIdx) {
    if (checkRoundIsFinished()) {
      round.roundFinished()
      return
    }
    const trick = createTrick(round, starterPlayerIdx, onTrickFinishedListener)
    round.tricks.push(trick)
    trick.start()
  }

  function checkRoundIsFinished () {
    listCards = function (tricks) {
      let cards = (tricks.map(x => Object.values(x.cardPlays)))
      let cardList = cards.reduce((a, b) => a.concat(b), [])
      return cardList
    }
    const cardList = listCards(round.tricks)
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


  function updatePontuation (players) {
    listCards = function (tricks) {
      let cards = (tricks.map(x => Object.values(x.cardPlays)))
      let cardList = cards.reduce((a, b) => a.concat(b), [])
      return cardList
    }
    let playersTricks = [[], [], [], []]
    const roundPontuationRules = {
      1: x => x.length * (-20),
      2: x => x.reduce((acc, curr) => acc + curr.filter(x => x.suit === 'heart').length, 0) * (-20),
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
        const winnerIdx = checkTrickWinnerPlayerId(trick)
        playersTricks[winnerIdx].push(listCards([trick]))
      }
    }
    fillPlayerTricks(round.tricks)
    for (let i = 0; i < playersTricks.length; i++) {
      const rule = roundPontuationRules[round.number]
      const res = rule(playersTricks[i])
      players[i].points += res
    }
  }



  function roundFirstTrickPlayRestriction (playerHand, card) {
    const noRestricition = x => true
    const cantPlayHeart = x => x.suit !== 'heart'
    const roundRestrictions = {
      2: cantPlayHeart,
      6: cantPlayHeart
      //restante não possuem restrições
    }
    const roundRestriction = roundRestrictions[round.number] || noRestricition
    const res = roundRestriction(card) || !playerHand.find(roundRestriction)
    return res
  }

  function playCard (playerIdx, index) {
    const playerHand = playersHands[playerIdx]
    playerHand.splice(index, 1)
    getCurrentTrick().playCard(playerIdx, index)
  }

  function getCurrentTrick () {
    const tricks = round.tricks
    return tricks[tricks.length - 1]
  }

  function getValidPlayOrError (cardIdx) {
    const currentTrick = getCurrentTrick()
    const playerIdx = currentTrick.playerTurnIdx
    let playerHand = playersHands[playerIdx].hand
    if (!playerHand[cardIdx]) {
      const error = {
        error: 'index inválido'
      }
      return error
    }
    return currentTrick.getValidPlayOrError(playerHand, playerHand[cardIdx], roundFirstTrickPlayRestriction)
  }

  return {
    round: state,
    updatePontuation,
    start,
    getValidPlayOrError,
    playCard,
    getCurrentTrick
  }

}
