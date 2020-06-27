export default class Controller {
  constructor(model, view) {
    this.view = view;
    this.model = model;

    view.bindClickEnterRoom(this.handleEnterRoom.bind(this));
    view.bindClickStartGame(this.handleStartGame.bind(this));
    view.bindClickCard(this.handleClickCard.bind(this));

    this.model.startGameEvent.addListener(() => {
      this.view.startGame();
    });
    this.model.finishGameEvent.addListener(() => {
      this.view.finishGame();
    });
    this.model.startRoundEvent.addListener(() => {
      this.view.startRound();
    });
    this.model.finishRoundEvent.addListener(() => {
      this.view.finishRound();
    });
    this.model.startTrickEvent.addListener(() => {
      this.view.startTrick();
    });
    this.model.finishTrickEvent.addListener(() => {
      this.view.finishTrick();
    });
    this.model.playerPlayEvent.addListener(() => {
      this.view.playerPlay();
    });
    this.model.discardCardEvent.addListener(() => {
      this.view.discardCard();
    });
  }

  handleEnterRoom(playerName) {
    this.model.enterRoom(
      {
        playerName,
      },
      (roomState) => {
        if (roomState) {
          this.model.enteredRoom(roomState);
        } else {
          this.model.enteredRoomError();
        }
      }
    );
  }

  handleStartGame(params) {
    this.model.startGame(
      {
        idx,
      },
      (success) => {
        if (success) {
          this.model.playCardOnTable(idx);
        } else {
          this.model.cardSelectedNotAllowed(idx);
        }
      }
    );
  }

  handleClickCard(idx) {
    this.model.playCard(
      {
        idx,
      },
      (success) => {
        if (success) {
          this.view.playCardOnTable(idx);
        } else {
          this.view.cardSelectedNotAllowed(idx);
        }
      }
    );
  }
}
