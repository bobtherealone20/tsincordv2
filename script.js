import config from 'config';

const { useState, useEffect, useRef } = React;
const root = ReactDOM.createRoot(document.getElementById('root'));

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const newRoom = new WebsimSocket();

    newRoom.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'chat') {
        setMessages(prevMessages => [...prevMessages, data]);
      }
    };

    setRoom(newRoom);

    return () => {
      newRoom.close();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && room) {
      room.send({ type: 'chat', text: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Realtime Chat</h1>
      </div>
      <div className="message-container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className="message">
            <span className="message-sender">{message.username}:</span>
            <span className="message-text">{message.text}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

root.render(<ChatApp />);

