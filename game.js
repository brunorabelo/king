import { createPlayer } from "./player.js";
import { createDeck, shuffle } from "./deck.js";
import { createRound } from "./round.js";

export default function createGame(
  onGameStarted,
  onGameFinished,
  onPlayersUpdated,
  onRoundStarted,
  onRoundFinished,
  onTrickStarted,
  onTrickFinished,
  onPlayerPlayed
) {
  const numberOfPlayers = 4;
  const deck = createDeck();
  const actions = {
    gameStarted: function () {
      state.started = true;
      onGameStarted();
    },
    gameFinished: function () {
      onGameFinished();
    },
    playersUpdated: function () {
      onPlayersUpdated();
    },
  };

  const listeners = {
    onRoundFinished: function (round) {
      onRoundFinished(round);
      startNextRound();
    },
    onRoundStarted: function (round) {
      onRoundStarted(round);
    },
    onTrickStarted: function (trick) {
      onTrickStarted(trick);
      autoPlayIfBot();
    },
    onTrickFinished: function (trick) {
      onTrickFinished(trick);
    },
    onPlayerPlayed: function (playerIdx, card) {
      const player = state.players[playerIdx];
      onPlayerPlayed(player, card);
    },
  };

  const state = {
    rounds: [],
    players: [],
    started: false,
  };

  function addPlayer(id, name) {
    if (
      state.players.length >= 4 ||
      state.players.filter((x) => x.id === id).length > 0
    ) {
      return {
        error: "Erro ao inserir jogador. Sala cheia",
      };
    }
    const player = createPlayer(id, name);
    state.players.push(player);
    actions.playersUpdated();
    return true;
  }
  function removePlayer(id) {
    const playerIdx = state.players.findIndex((x) => x.id === id);
    if (playerIdx < 0) {
      return;
    }
    if (state.rounds.length > 0) {
      state.players[playerIdx].robot = true;
      state.players[playerIdx].name = "BOT " + playerIdx;
    } else {
      state.players.splice(playerIdx, 1);
    }
    actions.playersUpdated();
  }

  function fillMissingPlayersWithBots(players) {
    for (let i = players.length, j = 1; i < numberOfPlayers; i++) {
      players[i] = createPlayer(i, "BOT " + j++, true);
    }
  }

  function start() {
    fillMissingPlayersWithBots(state.players);
    // state.players = shuffle(state.players);
    actions.gameStarted();
    startNextRound();
  }

  function checkGameFinished() {
    return state.rounds.length >= 13;
  }

  function startNextRound() {
    if (checkGameFinished()) {
      gameFinished();
      return;
    }
    const roundNumber = state.rounds.length + 1;
    const round = createRound(
      deck,
      state,
      roundNumber,
      listeners.onPlayerPlayed,
      listeners.onRoundStarted,
      listeners.onRoundFinished,
      listeners.onTrickStarted,
      listeners.onTrickFinished
    );
    state.rounds.push(round);
    round.start();
  }

  function getCurrentRound() {
    const rounds = state.rounds;
    return rounds[rounds.length - 1];
  }

  function getCurrentPlayer() {
    const currentTrick = getCurrentRound().getCurrentTrick().trick;
    const playerTurnIdx = currentTrick.playerTurnIdx;
    const round = currentTrick.round;
    return {
      ...state.players[playerTurnIdx],
      idx: playerTurnIdx,
      hand: round.playersHands[playerTurnIdx],
    };
  }

  function getValidPlayOrError(playerId, cardIdx) {
    const currentPlayer = getCurrentPlayer();
    if (currentPlayer.id !== playerId) {
      const error = {
        error: "não é a sua vez de jogar",
      };
      console.log(error);
      return error;
    }

    const currentRound = getCurrentRound();
    return currentRound.getValidPlayOrError(currentPlayer.idx, cardIdx);
  }

  function playCard(playerId, index) {
    const error = getValidPlayOrError(playerId, index);
    if (error !== true) {
      console.error(error);
      return error;
    }
    const currentRound = getCurrentRound();
    const playerIdx = getCurrentPlayer().idx;
    currentRound.playCard(playerIdx, index);
    autoPlayIfBot();
  }

  function autoPlayIfBot() {
    const currentRound = getCurrentRound();
    const player = getCurrentPlayer();
    if (!player.robot) {
      return;
    }
    const hand = currentRound.round.playersHands[player.idx];
    const numberCardsInHand = hand.length;
    const handIdxs = [...Array(numberCardsInHand).keys()];
    const shuffledIdxs = shuffle(handIdxs);
    const cardIdx = shuffledIdxs.find(
      (idx) => currentRound.getValidPlayOrError(player.idx, idx) === true
    );
    playCard(player.id, cardIdx);
  }

  return {
    state,
    addPlayer,
    removePlayer,
    start,
    playCard,
  };
}
