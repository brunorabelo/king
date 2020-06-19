
const { Machine, actions, interpret } = XState;

const createPlayerMachine = (name, cards) => {
  return Machine({
    id: 'player',
    initial: 'waiting',
    context: {
      name,
      cards
    },
    states: {
      waiting: {
        on: {
          turn: {
            target: 'playing'
          }
        }
      },
      playing: {
        on: {
          play: {
            target: 'waiting'
          }
        }
      }
    }
  });
};
