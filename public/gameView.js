import createGameController from "./gameController.js";
const gameController = createGameController(
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
);

const error = $("#error");
const statusBar = $(".topbar");
statusBar.css("background-color", "red").text("desconectado");
const enterGameBtn = $("#enterGameBtn");
const gameDiv = $("#game");
const startGameDiv = $("#startGame");
const startGameBtn = $("#startGameBtn");

const state = {
  players: null,
  myHand: null,
  tableCards: [],
  playerTurn: null,
  roundInfo: null,
};

function render() {
  displayMyHand();
  displayPlayers();
  displayRoundInfo();
  displayTrickInfo();
  displayPlayersPontuation();
  displayTableCards();
}

function displayTableCards() {
  if (!state.tableCards) {
    return;
  }
  const mesaDiv = $("#mesa");
  mesaDiv.empty();
  mesaDiv.text("mesa:");
  const cardsDiv = $("<ul></ul>");

  for (let i = 0; i < state.tableCards.length; i++) {
    const cardInfo = state.tableCards[i];
    const card = cardInfo.card;
    const player = cardInfo.player;
    const cardDiv = $("<li></li>");
    cardDiv.text(player.name + ": " + [card.suit, card.rank].join(" - "));
    cardsDiv.append(cardDiv);
  }
  mesaDiv.append(cardsDiv);
}
function displayPlayers() {
  if (!state.players) {
    return;
  }
  const jogadoresDiv = $("#jogadores").show();
  jogadoresDiv.empty();
  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    const playerDiv = $("<div></div>");
    playerDiv.text(player.name);
    if (state.playerTurn === i) {
      playerDiv.addClass("playerTurn");
    }
    jogadoresDiv.append(playerDiv);
  }
}

function displayRoundInfo(roundInfo) {
  if (!roundInfo) {
    return;
  }
  const rodadaDiv = $("#rodada");
  const text = roundInfo.name + " (" + roundInfo.number + ")";
  rodadaDiv.text(text);
}

function displayPlayersPontuation() {
  if (
    !state.players ||
    state.players.filter((x) => x.point !== undefined).length > 0
  ) {
    return;
  }
  const tableDiv = $("#pontuation");
  const table = $("<table></table>");
  const header = $("<tr></tr>");
  const name = $("<th></th>").text("name");
  const points = $("<th></th>").text("points");
  tableDiv.empty();
  header.append(name);
  header.append(points);
  table.append(header);

  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    const row = $("<tr></tr>");
    const name = $("<td></td>").text(player.name);
    const points = $("<td></td>").text(player.points);
    row.append(name);
    row.append(points);
    table.append(row);
  }
  tableDiv.append(table);
}

function displayMyHand() {
  if (!state.myHand) {
    return;
  }

  const handDiv = $("#myHand");
  handDiv.empty();
  for (let i = 0; i < state.myHand.length; i++) {
    const card = state.myHand[i];
    const cardLi = $("<li></li>");
    cardLi.text([card.suit, card.rank].join(" - "));
    const btn = $("<button></button>");
    btn.click(function () {
      playCardClick(i);
    });
    btn.text("+");
    cardLi.append(btn);
    handDiv.append(cardLi);
  }
}

function onEnterGame(players) {
  $("#connection").hide();
  statusBar.css("background-color", "green").text("conectado");
  gameDiv.show();
}

function onUpdateGameInfo(players) {
  state.players = players;
  render();
}

function onGameStarted(data) {
  startGameDiv.hide();
  state.players = data;
  render();
}

function onGameFinished() {}
function onRoundStarted(data) {
  const { playerHand, players, roundInfo } = data;
  state.players = players;
  state.myHand = playerHand;
  state.roundInfo = roundInfo;
  render();
}
function onRoundFinished(data) {
}

function onNextPlayerTurn(playerIdx){
  state.playerTurn = playerIdx
  render()
}

function displayTrickInfo(trickNumber) {
  const trickDiv = $("#trick");
  trickDiv.text("Vaza " + trickNumber);
}

function onTrickStarted(data) {
  const { starterPlayerIdx, trickNumber } = data;
  displayTrickInfo(trickNumber);
  state.playerTurn = starterPlayerIdx;
  render();
}

function onTrickFinished() {
  state.tableCards = [];
}
function onPlayerPlayed(data) {
  state.tableCards.push({
    card: data.card,
    player: data.player,
  });
  state.playerTurn = (state.playerTurn + 1) % 4;
  render();
}

function playCardClick(idx) {
  gameController.playCard(idx);
}

function onWrongMove(result){
  console.error(result)
}
function onSuccessMove(idx){
  state.myHand.splice(idx, 1);
  render();
}

function onReceiveGameState(data){


  // render();
}

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
