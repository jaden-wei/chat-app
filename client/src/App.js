import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import { IoMdSend } from "react-icons/io";

const socket = io("http://192.168.86.177:5000", {
  withCredentials: true,
});

function App() {
  const clientId = socket.io.engine.id;

  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [name, setName] = useState();

  const reqName = () => {
    const n = prompt("What is your name?");

    if (!n) {
      reqName();
    } else setName(n);
  };

  useEffect(() => {
    reqName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("chat message", ({ id, name, msg }) => {
      setChat([{ id, name, msg }, ...chat]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  const onMessageSubmit = (e) => {
    e.preventDefault();
    socket.emit("chat message", { clientId, name, msg });
    setMsg("");
  };

  const renderChat = () => {
    console.log(chat);
    return chat.map(({ id, name, msg }, index) => (
      <div
        key={index}
        className={`message ${id === clientId ? "client-message" : ""}`}
      >
        <div className="msg-box">
          <p>{id === clientId ? msg : `${name}: ${msg}`}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="App">
      <div className="chat-box">{chat.length > 0 ? renderChat() : ""}</div>

      <div className="text-box">
        <form onSubmit={onMessageSubmit}>
          <input
            name="msg"
            onChange={(e) => {
              setMsg(e.target.value);
            }}
            value={msg}
            placeholder="message"
          />
          <button className="send-msg-btn">
            <IoMdSend size="30" color="rgb(30, 82, 250)" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;