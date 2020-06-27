import Event from "../helpers/event.js";

class ServerAPI {
  constructor() {
    this.socket = io.connect("http://localhost:5000");

    this.updatedPlayersEvent = new Event();
    this.gameStartedEvent = new Event();
    this.gameFinishedEvent = new Event();
    this.roundStartedEvent = new Event();
    this.roundFinishedEvent = new Event();
    this.trickStartedEvent = new Event();
    this.trickFinished = new Event();
    this.playerPlayedEvent = new Event();
    this.nextPlayerTurnEvent = new Event();
    this.receveidGameStateEvent = new Event();

    this.listen();
  }

  listen() {
    socket.on("players_updated", (data) => {
      console.log("players_updated", data);
      this.gameStartedEvent.trigger(data);
    });

    socket.on("game_started", (data) => {
      console.log("game_started", data);
      this.gameStartedEvent.trigger(data);
    });
    socket.on("game_finished", (data) => {
      console.log("game_finished", data);
      this.gameFinishedEvent.trigger(data);
    });

    socket.on("round_started", (data) => {
      console.log("round_started", data);
      this.roundStartedEvent.trigger(data);
    });
    socket.on("round_finished", (data) => {
      console.log("round_finished", data);
      this.roundFinishedEvent.trigger(data);
    });

    socket.on("trick_started", (data) => {
      console.log("trick_started", data);
      this.trickStartedEvent.trigger(data);
    });
    socket.on("trick_finished", (data) => {
      console.log("trick_finished", data);
      this.trickFinished.trigger(data);
    });

    socket.on("player_played_card", (data) => {
      console.log("player_played_card", data);
      this.playerPlayedEvent.trigger(data);
    });

    socket.on("next_player_turn", (data) => {
      console.log("next_player_turn", data);
      this.nextPlayerTurnEvent.trigger(data);
    });

    socket.on("game_state", (data) => {
      console.log("game_state", data);
      this.receveidGameStateEvent.trigger(data);
    });
  }

  playCard(idx, callback) {
    if (!callback) {
      callback = () => {};
    }
    socket.emit(
      "play_card",
      {
        cardIdx: idx,
      },
      (result) => {
        callback(result);
      }
    );
  }

  startGame(params, callback) {
    if (!callback) {
      callback = () => {};
    }
    socket.emit("start_game", callback);
  }

  connect(playerName, callback) {
    if (!callback) {
      callback = () => {};
    }
    socket.emit(
      "enter_game",
      {
        name: playerName,
      },
      callback
    );
  }
}

export default ServerAPI;
