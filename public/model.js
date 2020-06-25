class Model {
  constructor(api) {
    this.api = api;

    this.state = null;

    this.players = null;
    this.myHand = null;
    this.tableCards = [];
    this.playerTurn = null;
    this.trickNumber = null;
    this.roundInfo = null;

    // this.startGameEvent = new Event();
    // this.finishGameEvent = new Event();
    // this.startRoundEvent = new Event();
    // this.finishRoundEvent = new Event();
    // this.startTrickEvent = new Event();
    // this.finishTrickEvent = new Event();
    // this.playerPlayEvent = new Event();
    this.cardPlayedEvent = new Event(); //user, card
    this.discardCardEvent = new Event(); //idx
    this.nextPlayerTurnEvent = new Event(); //playerTurn
    this.renderAllAgain = new Event();
    this.finishTrickEvent = new Event();
    this.startTrickEvent = new Event(); //setInterval(trigger, 3000) dar tempo de ver as cartas
    this.startRoundEvent = new Event(); //setInterval... dar tempo de ver a pontuação
    this.finishRoundEvent = new Event();
    this.showPontuationEvent = new Event(); //tablePontuation
    this.closePontuationEvent = new Event(); //setInterval
    this.finishGameEvent = new Event();

    this.api.bindGameStarted(this.gameStarted.bind(this));
    this.api.bindGameFinished(this.gameFinished.bind(this));
    this.api.bindRoundStarted(this.roundStarted.bind(this));
    this.api.bindRoundFinished(this.roundFinished.bind(this));
    this.api.bindTrickStarted(this.trickStarted.bind(this));
    this.api.bindTrickFinished(this.trickFinished.bind(this));
    this.api.bindPlayerPlayed(this.playerPlayed.bind(this));
    this.api.bindGameStateReceived(this.gameStateReceived.bind(this));
    // Object.defineProperty(this, "players", {
    //   get: function () {
    //     return players;
    //   },
    //   set: function (value) {
    //     if (players === value) return;
    //     players = value;
    //     console.log(listeners)
    //     // this.notifyAll();
    //   },
    // });
  }
  setGameState(gameState) {}
  gameStateReceived(gameState) {
    //verificar estado salvo e estado recebido
    if (different) {
      this.setGameState(gameState);
      this.renderAllAgain.trigger(gameState);
    }
  }

  playCard(idx) {
    this.api.playCard(idx, (result) => {
      if (result === true) {
        this.discardCardEvent.trigger(idx);
        this.myHand.splice(idx);
      } else {
      }
    });
  }
}

class PlayerState {
  constructor(idx) {
    this.state = new IdleState(this);
    this.playerIdx = idx;
  }

  changeState() {
    this.state = this.state.next();
  }

  getName() {
    return this.state.name;
  }
}

class IdleState {
  constructor(container) {
    this.name = "idle";
    this.container = container;
  }

  next(nextPlayerIdx) {
    if (nextPlayerIdx === this.container.playerIdx) {
      return new PlayerTurnState(this.container);
    }
  }
}

class PlayerTurnState {
  constructor(container) {
    this.name = "playerTurnState";
    this.container = container;
  }

  next(nextPlayerIdx) {
    if (nextPlayerIdx !== this.container.playerIdx) {
      return new IdleState(this.container);
    }
    return this;
  }
}
