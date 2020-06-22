export default function createGameController(
  onEnterGame,
  onUpdateGameInfo,
  onGameStarted,
  onGameFinished,
  onRoundStarted,
  onRoundFinished,
  onTrickStarted,
  onTrickFinished,
  onPlayerPlayed
) {
  const socket = io.connect("http://localhost:5000");
  delete localStorage.debug;
  // de alguma forma, todo evento tem que mandar o estado do jogo para fins de conferencia
  const actions = {
    enteredGame: onEnterGame,
    updatedGame: onUpdateGameInfo,
    gameStarted: onGameStarted,
    gameFinished: onGameFinished,
    roundStarted: onRoundStarted,
    roundFinished: onRoundFinished,
    trickStarted: onTrickStarted,
    trickFinished: onTrickFinished,
    playerPlayed: onPlayerPlayed,
  };

  socket.on("entered_game", (data) => {
    console.log("entered_game", data);
    actions.enteredGame();
  });

  socket.on("players_updated", (data) => {
    console.log("players_updated", data);
    actions.updatedGame(data);
  });

  socket.on("game_started", (data) => {
    console.log("game_started", data);
    actions.gameStarted(data);
  });
  socket.on("game_finished", (data) => {
    console.log("game_finished", data);
    actions.gameFinished(data);
  });

  socket.on("round_started", (data) => {
    console.log("round_started", data);
    actions.roundStarted(data);
  });
  socket.on("round_finished", (data) => {
    console.log("round_finished", data);
    actions.roundFinished(data);
  });

  socket.on("trick_started", (data) => {
    console.log("trick_started", data);
    actions.trickStarted(data);
  });
  socket.on("trick_finished", (data) => {
    console.log("trick_finished", data);
    actions.trickFinished(data);
  });

  socket.on("player_played_card", (data) => {
    console.log("player_played_card", data);
    actions.playerPlayed(data);
  });

  function playCard(idx) {
    socket.emit("play_card", {
      cardIdx: idx,
    });
  }

  function startGame(data) {
    socket.emit("start_game");
  }

  function connect(username) {
    socket.emit("enter_game", {
      name: username,
    });
  }

  return {
    connect,
    startGame,
    playCard,
  };
}
