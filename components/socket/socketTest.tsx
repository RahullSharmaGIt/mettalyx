"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

export default function SocketTest() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      console.log("Connected to Socket.IO:", socket.id);
      setConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from Socket.IO");
      setConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <div>
      Socket status:{" "}
      <strong>
        {connected ? "Connected" : "Disconnected"}
      </strong>
    </div>
  );
}