import Event from './event.js'
class Model {
  constructor() {
    this.players = null;
    this.myHand = null;
    this.tableCards = [];
    this.playerTurn = null;
    this.roundInfo = null;

    this.gameStartedEvent = new Event()
    this.onGame
  }

}
