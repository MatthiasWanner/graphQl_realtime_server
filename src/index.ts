import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import typeDefs from "./typeDefs";

import { playerMutations, playerQueries } from "./resolvers/players";
import {
  gameMutations,
  gameQueries,
  gamesSubscriptions,
} from "./resolvers/games";

dotenv.config();

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: {
        ...playerQueries,
        ...gameQueries,
      },
      Mutation: {
        ...playerMutations,
        ...gameMutations,
      },
      Subscription: {
        ...gamesSubscriptions,
      },
    },
    subscriptions: {
      path: "/subscriptions",
      onConnect: () => {
        console.log("Client connected for subscriptions");
      },
      onDisconnect: () => {
        console.log("Client disconnected from subscriptions");
      },
    },
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(process.env.PORT, () => {
    console.log(
      `Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
    console.log(
      `Subscriptions ready at ws://localhost:${process.env.PORT}${apolloServer.subscriptionsPath}`
    );
  });
};

main().catch((err) => {
  console.log(err);
});
