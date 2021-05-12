import { PubSub } from "apollo-server-express";
import { resolve } from "path";

const pubsub = new PubSub();

interface Game {
  id: number;
  player1: {
    name: string;
    score: number;
  };
  player2?: {
    name: string;
    score: number;
  };
  winner?: string;
}

type Args = { id: string };
type CreateGame = { name: string };
type JoinGame = { id: string; name: string };
type GameJoined = { name: string };
type Response = { id: string; name: string; response: string };

const games: Game[] = [
  {
    id: 1,
    player1: {
      name: "Basile",
      score: 0,
    },
    player2: {
      name: "Matthias",
      score: 3,
    },
    winner: "Matthias",
  },
];

export const gameQueries = {
  games: () => {
    return games;
  },
  game: (_parent: any, args: Args, _context: any) => {
    return games.find((game) => game.id === +args.id);
  },
};

export const gameMutations = {
  createGame: (_parent: any, args: CreateGame, _context: any) => {
    games.push({
      id: [...games].pop()?.id! + 1,
      player1: { name: args.name, score: 0 },
    });
    console.log("Game created");
    return games[games.length - 1];
  },
  joinGame: (_parent: any, args: JoinGame, _context: any) => {
    games.forEach((game) => {
      if (game.id === +args.id) {
        game.player2 = {
          name: args.name,
          score: 0,
        };
      }
    });
    const gameJoined = games.find((game) => game.id === +args.id);
    pubsub.publish("JOIN_GAME", gameJoined);
    return gameJoined;
  },
};

export const gamesSubscriptions = {
  joinGame: {
    subscribe: () => pubsub.asyncIterator("JOIN_GAME"),
    resolve: (payload: GameJoined) => {
      return payload;
    },
  },
  knowResult: {
    subscribe: () => pubsub.asyncIterator("KNOW_RESULT"),
    resolve: (payload: Response) => {
      return payload;
    },
  },
};
