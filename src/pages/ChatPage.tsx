import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import conversationsService, { IMessage } from "../services/conversations-service";
import BaseContainer from "../components/BaseContainer";

const socket = io(import.meta.env.VITE_BASE_URL);

const ChatPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await conversationsService.getConversationById(conversationId!).request;
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (conversationId) {
      fetchMessages();
      socket.emit("joinRoom", conversationId);
    }

    return () => {
      socket.emit("leaveRoom", conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    socket.on("message", (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await conversationsService.sendMessage(conversationId!, newMessage).request;
      setNewMessage("");
      socket.emit("sendMessage", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <BaseContainer>
      <h4>Chat</h4>
      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg._id} className={`chat-message ${msg.sender._id === localStorage.getItem('userId') ? 'my-message' : 'other-message'}`}>
            <strong>{msg.sender.userName}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </BaseContainer>
  );
};

export default ChatPage;