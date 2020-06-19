

// Guard to check if the glass is full
function roundIsFinished (context, event) {
  return context.trick >= 13;
}

const roundMachine = Machine(
  {
    id: 'round',
    context: {
      trick: 0,
      params: undefined,
      historicTablePlays: new Array(13)
    },
    initial: 'playing',
    states: {
      playing: {
        entry: (context, event) => { context.turn = 0 },
        invoke: {
          id: 'trick',
          src: trickMachine,
          data: {
            turn: 0,
            tablePlays: new Array(4)
          },
          onDone: {
            target: 'playing',
            actions: [(context, event) => {context.historicTablePlays.push(event.data.tablePlays)},
              assign({
                trick: (context, event) => { context.trick + 1 }
              })]
          }
        },
        on: {
          // Transient transition
          '': {
            target: 'finished',
            cond: 'roundIsFinished'
          }
        }
      },
      finished: {
        type: 'final'
      }
    }
  },
  {
    guards: { roundIsFinished }
  }
);