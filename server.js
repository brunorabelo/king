import express from "express";
import http from "http";
import createGame from "./game.js";
import socketIo from "socket.io";
const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use(express.static("public"));
app.use("/jquery", express.static("./node_modules/jquery/dist/"));
server.listen(5000);
const game = createGame(
  onGameStarted,
  onGameFinished,
  onPlayersUpdated,
  onRoundStarted,
  onRoundFinished,
  onTrickStarted,
  onTrickFinished,
  onPlayerPlayed,
  onNextPlayerTurn
);

const socketMap = {};

io.on("connection", (socket) => {
  const userId = socket.id;
  console.log(`> User connected: ${userId}`);

  socket.on("enter_game", (data) => {
    const playerName = data.name;
    socketMap[socket.id] = socket;
    console.log(data, "entrou no jogo");
    const res = game.addPlayer(socket.id, data.name);
    if (res.error) {
      return;
    }
    socket.emit("entered_game");
    socket.on("disconnect", (data) => {
      delete socketMap[socket.id];
      game.removePlayer(socket.id);
      console.log(playerName, "saiu do jogo");
    });
  });

  socket.on("start_game", (data) => {
    if (game.state.started) return;
    game.start();
  });

  socket.on("play_card", (data, callback) => {
    const result = game.playCard(socket.id, data.cardIdx);
    callback(result)
  });
});

function onPlayersUpdated() {
  for (let i = 0; i < game.state.players.length; i++) {
    const sendingPlayer = game.state.players[i];
    if (sendingPlayer.robot) {
      continue;
    }
    io.sockets.emit("players_updated", game.state.players);
  }
}

function onGameStarted() {
  for (let i = 0; i < game.state.players.length; i++) {
    const sendingPlayer = game.state.players[i];
    if (sendingPlayer.robot) {
      continue;
    }
    socketMap[sendingPlayer.id].emit("game_started", game.state.players);
  }
  setInterval(()=>{sendGameState()}, 3000)
}

function sendGameState(){
  const  currentState = game.getCurrentState()
  for (let i = 0; i < game.state.players.length; i++) {
    const sendingPlayer = game.state.players[i];
    if (sendingPlayer.robot) {
      continue;
    }
    socketMap[sendingPlayer.id].emit("game_state", currentState);
  }
}

function onRoundStarted(round) {
  for (let i = 0; i < game.state.players.length; i++) {
    const player = game.state.players[i];
    if (player.robot) {
      continue;
    }
    const roundNumber = round.number;
    const players = game.state.players.map((x, idx) => ({
      ...x,
      cards: round.playersHands[idx].length,
    }));
    const playerHand = round.playersHands[i];
    socketMap[player.id].emit("round_started", {
      roundInfo: {
        number: roundNumber,
        name: round.name || "Rodada " + roundNumber,
      },
      playerHand,
      players,
    });
  }
}

function onRoundFinished(round) {
  for (let i = 0; i < game.state.players.length; i++) {
    const player = game.state.players[i];
    if (player.robot) {
      continue;
    }
    const roundNumber = round.number;
    const players = game.state.players.map((x, idx) => ({
      ...x,
      cards: round.playersHands[idx].length,
    }));
    const playerHand = round.playersHands[i];
    socketMap[player.id].emit("round_finished", {
      roundInfo: {
        number: roundNumber,
        name: round.name || "Rodada " + roundNumber,
      },
      playerHand,
      players,
    });
  }
}

function onTrickStarted(trick) {
  for (let i = 0; i < game.state.players.length; i++) {
    const player = game.state.players[i];
    if (player.robot) {
      continue;
    }
    const trickNumber = trick.number;
    const starterPlayerIdx = trick.starterPlayerIdx;
    socketMap[player.id].emit("trick_started", {
      trickNumber,
      starterPlayerIdx,
    });
  }
}

function onTrickFinished(trick) {
  for (let i = 0; i < game.state.players.length; i++) {
    const player = game.state.players[i];
    if (player.robot) {
      continue;
    }
    const trickNumber = trick.number;
    const winnerPlayerIdx = trick.winnerIdx;
    socketMap[player.id].emit("trick_finished", {
      trickNumber,
      winnerPlayerIdx,
    });
  }
}

function onPlayerPlayed(player, card) {
  for (let i = 0; i < game.state.players.length; i++) {
    const sendingPlayer = game.state.players[i];
    if (sendingPlayer.robot) {
      continue;
    }
    socketMap[sendingPlayer.id].emit("player_played_card", {
      player,
      card,
    });
  }
}

function onNextPlayerTurn(playerIdx){
  for (let i = 0; i < game.state.players.length; i++) {
    const sendingPlayer = game.state.players[i];
    if (sendingPlayer.robot) {
      continue;
    }
    socketMap[sendingPlayer.id].emit("next_player_turn", {
      playerIdx,
    });
  }
  game.autoPlayIfBot();
}

function onGameFinished() {
  const result = {
    players: game.state.players,
    pontuation: game.state.players.map(
      (x) => new { name: x.name, points: x.points }()
    ),
  };
  for (let i = 0; i < game.state.players.length; i++) {
    const sendingPlayer = game.state.players[i];
    if (sendingPlayer.robot) {
      continue;
    }
    socketMap[sendingPlayer.id].emit("game_finished", result);
  }
}
