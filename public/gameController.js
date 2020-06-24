export default function createGameController(
                 onEnterGame,
                 onUpdateGameInfo,
                 onGameStarted,
                 onGameFinished,
                 onRoundStarted,
                 onRoundFinished,
                 onTrickStarted,
                 onTrickFinished,
                 onPlayerPlayed,
                 onWrongMove,
                 onSuccessMove,
                 onNextPlayerTurn,
                 onReceiveGameState
               ) {
                 const socket = io.connect("http://localhost:5000");
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
                   wrongMove: onWrongMove,
                   successMove: onSuccessMove,
                   nextPlayerTurn: onNextPlayerTurn,
                   receivedGameState: onReceiveGameState,
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

                 socket.on("next_player_turn", (data) => {
                   console.log("next_player_turn", data);
                   actions.nextPlayerTurn(data);
                 });

                 socket.on("game_state", (data) => {
                   console.log("game_state", data);
                   actions.receivedGameState(data);
                 });

                 function playCard(idx) {
                   socket.emit(
                     "play_card",
                     {
                       cardIdx: idx,
                     },
                     (result) => {
                       if (result === true) {
                         actions.successMove(idx);
                       } else {
                         actions.wrongMove(result);
                       }
                     }
                   );
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
