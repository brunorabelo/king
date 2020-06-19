
const { Machine, actions, interpret } = XState;

// Action to increment the context amount
const nextHand = assign({
  hand: (context, event) => context.hand + 1
});

// Guard to check if the glass is full
function roundIsFinished (context, event) {
  return context.hand >= 13;
}

const roundMachine = Machine(
  {
    id: 'negativeHandMachine',
    // the initial context (extended state) of the statechart
    context: {
      hand: 0
    },
    initial: 'idle',
    states: {
      idle: {
        play: 'playing'
      },
      playing: {
        on: {
          // Transient transition
          '': {
            target: 'finished',
            cond: 'roundIsFinished'
          },
          play: {
            target: 'playing',
            actions: 'nextRound'
          }
        }
      },
      finished: {}
    }
  },
  {
    actions: { nextRound },
    guards: { roundIsFinished }
  }
);