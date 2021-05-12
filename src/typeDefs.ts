import { gql } from "apollo-server-core";

export default gql`
  type Player {
    id: ID
    name: String
  }

  type PlayerInGame {
    name: String
    score: Int
  }

  type Game {
    id: ID
    player1: PlayerInGame
    player2: PlayerInGame
    winner: String
  }

  type Query {
    players: [Player]
    player(id: ID): Player

    games: [Game]
    game(id: ID): Game
  }

  type Mutation {
    createPlayer(name: String): Player
    createGame(name: String): Game
    joinGame(id: ID, name: String): Game
  }

  type Subscription {
    joinGame: Game
    knowResult: Game
  }
`;
