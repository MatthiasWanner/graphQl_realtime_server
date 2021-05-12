interface Player {
  id: number;
  name: string;
}

type Args = { id: number };
type CreateUserInput = { name: string };

const players: Player[] = [
  {
    id: 1,
    name: "Basile",
  },
  {
    id: 2,
    name: "Matthias",
  },
];

export const playerQueries = {
  players: () => {
    return players;
  },
  player: (_parent: any, args: Args, _context: any) => {
    return players.find((player) => player.id === +args.id);
  },
};

export const playerMutations = {
  createPlayer: (_parent: any, args: CreateUserInput, _context: any) => {
    players.push({ id: [...players].pop()?.id! + 1, name: args.name });
    return players[players.length - 1];
  },
};
