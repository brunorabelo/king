export default function createGameController(onEnterGame, onUpdateGameInfo) {
  const socket = io.connect("http://localhost:5000");
  // de alguma forma, todo evento tem que mandar o estado do jogo para fins de conferencia
  const actions = {
    enteredGame: onEnterGame,
    updatedGame: onUpdateGameInfo,
  };

  socket.on("entered_game", (data) => {
    actions.enteredGame();
  });

  socket.on("players_updated", (data) => {
    console.log("players_updated", data);
  });

  socket.on("game_started", (data) => {
    console.log("game_started", data);
  });
  socket.on("game_finished", (data) => {
    console.log("game_finished", data);
  });

  socket.on("round_started", (data) => {
    console.log("round_started", data);
  });
  socket.on("round_finished", (data) => {
    console.log("round_finished", data);
  });

  socket.on("trick_started", (data) => {
    console.log("trick_started", data);
  });
  socket.on("trick_finished", (data) => {
    console.log("trick_finished", data);
  });

  socket.on("player_played_card", (data) => {
    console.log("player_played_card", data);
  });

  function startGame() {
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
  };
}
