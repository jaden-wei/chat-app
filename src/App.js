import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io.connect("http://localhost:5000");

function App() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [name, setName] = useState();

  const reqName = () => {
    const n = prompt("What is your name?");
    if (!n) {
      reqName();
    }
    setName(n);
  };

  useEffect(() => {
    reqName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("chat message", ({ name, msg }) => {
      setChat([...chat, { name, msg }]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  const onMessageSubmit = (e) => {
    e.preventDefault();
    socket.emit("chat message", { name, msg });
    setMsg("");
  };

  const renderChat = () => {
    return chat.map(({ name, msg }, index) => (
      <div key={index}>
        <p>
          {name}: {msg}
        </p>
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
          />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
