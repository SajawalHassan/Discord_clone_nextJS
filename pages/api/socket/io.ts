import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";
import { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, { path, addTrailingSlash: false });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
