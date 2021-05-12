interface Game {
  id: number;
  player1: Player;
  player2: Player;
  winner?: Player;
}

interface Player {
  id: number;
  name: string;
}
