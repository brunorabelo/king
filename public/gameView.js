import createGameController from "./gameController.js";
const gameController = createGameController(OnEnterGame, onUpdateGameInfo);

const error = $("#error");
const statusBar = $(".topbar");
statusBar.css("background-color", "red").text("desconectado");
const enterGameBtn = $("#enterGameBtn");
const gameDiv = $("#game");
const startGameBtn = $("#startGameBtn");

function displayPlayers(players) {
  const text = "jogadores na sala: " + players.map((x) => x.name).join(", ");
  console.log(text);
}

function OnEnterGame(players) {
  $("#connection").hide();
  statusBar.css("background-color", "green").text("conectado");
  gameDiv.show();
}

function onUpdateGameInfo(gameInfo) {}

enterGameBtn.click(() => {
  error.hide();
  const username = $("#username").val();
  if (!username || username === "") {
    error.show();
    error.text("Erro no usuário");
    return;
  }
  gameController.connect(username);
});
startGameBtn.click(() => {
  gameController.startGame();
});
