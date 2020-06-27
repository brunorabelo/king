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

    this.api.updatedPlayersEvent.addListener(this.updatedPlayers.bind(this));
    this.api.gameStartedEvent.addListener(this.gameStarted.bind(this));
    this.api.gameFinishedEvent.addListener(this.gameFinished.bind(this));
    this.api.roundStartedEvent.addListener(this.roundStarted.bind(this));
    this.api.roundFinishedEvent.addListener(this.roundFinished.bind(this));
    this.api.trickStartedEvent.addListener(this.trickStarted.bind(this));
    this.api.trickFinished.addListener(this.trickFinished.bind(this));
    this.api.playerPlayedEvent.addListener(this.playerPlayed.bind(this));
    this.api.receivedGameStateEvent.addListener(
      this.gameStateReceived.bind(this)
    );

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

  updatedPlayers(paras) {}
  gameStarted(paras) {}
  gameFinished(paras) {}
  roundStarted(paras) {}
  roundFinished(paras) {}
  trickStarted(paras) {}
  trickFinished(paras) {}
  playerPlayed(paras) {}
  gameStateReceived(paras) {}

  setGameState(gameState) {}
  gameStateReceived(gameState) {
    //verificar estado salvo e estado recebido
    const different = false;
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
        const error = result?.error || "Erro desconhecido";
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
