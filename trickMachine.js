
const { Machine, actions, interpret, assign } = XState;


// Action to increment the context amount
const nextPlayer = assign({
  turn: (context, event) => (context.turn + 1)
});

// Guard to check if the glass is full
function trickIsFinished (context, event) {
  return context.turn === 4
}
function checkWinner (context, event) {
  const tablePlays = context.tablePlays
  context.winner = 0
}



const trickMachine = Machine({
  initial: 'playing',
  context: {
    turn: 0,
    tablePlays: new Array(4),
    winner: undefined
  },
  states: {
    playing: {
      on: {
        '': {
          target: 'finished',
          cond: 'trickIsFinished'
        },
        play: {
          target: 'playing',
          actions: 'nextPlayer'
        }
      }
    },
    finished: {
      entry: ['checkWinner'],
      type: 'final',
      data: {
        winner: (context, event) => context.winner,
        tablePlays: (context, event) => context.tablePlays
      }
    }
  }
},
  {
    actions: { checkWinner, nextPlayer },
    guards: { trickIsFinished }
  }

);