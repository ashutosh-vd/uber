import { Server } from "socket.io";
import { CORS_ORIGIN } from "./config/index.js";

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: CORS_ORIGIN,
  });

  return io;
}

export const getSocket = () => {
  if(!io) {
    throw new Error("io not initialised.")
  }
  return io;
};