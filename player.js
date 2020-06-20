
export function createPlayer (playerId, name, robot = false) {
  const player = {
    id: playerId,
    name: name,
    points: 0,
    robot: robot
  }
  return player
}
