import express from 'express'
import http from 'http'
import createGame from './game.js'
import socketIo from 'socket.io'

const app = express();
const server = http.Server(app);
const io = socketIo(server);

server.listen(5000);
app.use(express.static('public'))

const game = createGame(onUpdatedGameState, onGameFinished)

io.on('connection', (socket) => {
  const playerId = socket.id
  console.log(`> Player connected: ${playerId}`)
  socket.emit('ds', game.gameState);

  socket.on('enter_game', (data) => {
    console.log('entrou no jogo')
    console.log(data);
    game.addPlayer(socket.id, data.name)
    socket.emit('update_screen', game)
  });
});

function sendInfoStatePlayer(playerIdx){
  const playerInfo = game.state.players[playerIdx]
  const playerWithHand = game.getCurrentPlayer()
  return {
    player: playerWithHand
  }
}

function onGameFinished () {

}
function onClientPlayedCard (clientId, cardIdx) {

}


function onUpdatedGameState () {

}
