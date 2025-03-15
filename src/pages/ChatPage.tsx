import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import conversationsService, { IMessage } from "../services/conversations-service";
import BaseContainer from "../components/BaseContainer";
import avatar from "../assets/avatar.png";
import userService from "../services/user-service";
import { IUser } from "../services/user-service";

const socket = io(import.meta.env.VITE_BASE_URL);

const ChatPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipient, setRecipient] = useState<{ userName: string; profile_picture_uri?: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userService.getCurrentUser().request;
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!conversationId || !currentUser) return;

    const fetchConversation = async () => {
      try {
        const response = await conversationsService.getConversationById(conversationId).request;
        setMessages(response.data.messages || []);

        const otherUser = response.data.participants.find((user) => user._id !== currentUser?._id);
        setRecipient(otherUser || null);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();

    socket.emit("join", conversationId);
    console.log("Joined room:", conversationId);

    return () => {
      socket.emit("leaveRoom", conversationId);
      console.log("Left room:", conversationId);
    };
  }, [conversationId, currentUser]);

  useEffect(() => {
    socket.on("receiveMessage", (message: IMessage) => {
      console.log("New message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser?._id) return;

    try {
      // await conversationsService.sendMessage(conversationId!, currentUser?._id, newMessage).request;
      
      setNewMessage("");
      socket.emit("sendMessage", {
        conversationId,
        senderId: currentUser._id,
        text: newMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <BaseContainer className="chat-container">
      {/* Chat Header */}
      <div className="chat-header d-flex align-items-center p-3 border-bottom">
        <img
          src={recipient?.profile_picture_uri || avatar}
          alt="User"
          className="rounded-circle me-3"
          style={{ width: "50px", height: "50px" }}
        />
        <div>
          <h6 className="mb-1">{recipient?.userName || "Unknown User"}</h6>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-box flex-grow-1 p-3">
        {messages.map((msg, index) => (
          <div
            key={msg._id || `${msg.senderId}-${index}-${Date.now()}-${Math.random()}`}
            className={`chat-message ${msg.senderId === currentUser?._id ? "my-message" : "other-message"}`}
          >
            {/* Show current user's name as "You" */}
            <strong>{msg.senderId === currentUser?._id ? "You" : recipient?.userName}:</strong> {msg.text}
          </div>
        ))}
      </div>



      {/* Chat Input */}
      <div className="chat-input p-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </BaseContainer>
  );
};

export default ChatPage;
