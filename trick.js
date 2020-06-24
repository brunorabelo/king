export default function createTrick(
  round,
  trickNumber,
  starterPlayerIdx,
  onPlayerPlayed,
  onTrickStarted,
  onTrickFinished,
  onNextPlayerTurn
) {
  const actions = {
    trickStarted: onTrickStarted,
    trickFinished: onTrickFinished,
    playerPlayed: onPlayerPlayed,
    nextPlayerTurn: onNextPlayerTurn
  };
  const trick = {
    round: round,
    number: trickNumber,
    starterPlayerIdx: starterPlayerIdx,
    cardPlays: new Object(),
    playerTurnIdx: starterPlayerIdx - 1,
    winnerIdx: -1,
  };

  function start() {
    nextPlayerTurn();
    actions.trickStarted(trick)
  }

  function nextPlayerTurn() {
    if (checkTrickIsFinished()) {
      trick.winnerIdx = checkTrickWinnerPlayerId();
      actions.trickFinished(trick);
      return;
    }
    trick.playerTurnIdx = (trick.playerTurnIdx + 1) % 4;
    actions.nextPlayerTurn(trick.playerTurnIdx)
  }

  function checkTrickIsFinished() {
    return Object.keys(trick.cardPlays).length >= 4;
  }

  function checkTrickWinnerPlayerId() {
    const trickSuit = trick.cardPlays[trick.starterPlayerIdx].suit;
    let winner = trick.starterPlayerIdx;
    for (let i = 0; i < Object.keys(trick.cardPlays).length; i++) {
      const currentCard = trick.cardPlays[i];
      const currentSuit = currentCard.suit;
      const currentValue = currentCard.value;
      if (
        currentSuit === trickSuit &&
        currentValue > trick.cardPlays[winner].value
      ) {
        winner = i;
      }
    }
    return winner;
  }

  function getValidPlayOrError(playerHand, card, roundRestriction) {
    const firstCardAlreadyPlayed = trick.cardPlays[trick.starterPlayerIdx];
    if (!firstCardAlreadyPlayed && roundRestriction(playerHand, card)) {
      return true;
    } else if (!firstCardAlreadyPlayed) {
      const error = {
        error:
          "Esse naipe não pode ser jogado na abertura de uma vaza nessa rodada enquanto houver outro naipe disponível",
      };
      return error;
    }
    const startedSuit = firstCardAlreadyPlayed.suit;
    if (startedSuit === card.suit) {
      return true;
    }
    if (playerHand.find((x) => x.suit === startedSuit)) {
      const error = {
        error: "Naipe inválido",
      };
      return error;
    }
    return true;
  }

  function playCard(card) {
    trick.cardPlays[trick.playerTurnIdx] = card;
    actions.playerPlayed(trick.playerTurnIdx, card);
    nextPlayerTurn();
  }

  return {
    trick,
    start,
    getValidPlayOrError,
    checkTrickWinnerPlayerId,
    playCard,
  };
}
