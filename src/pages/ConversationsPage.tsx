import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import conversationsService, { IConversation } from "../services/conversations-service";
import userService, { IUser } from "../services/user-service";
import { getCurrentUser } from "../services/user-service";
import noMessagesImage from "../assets/no-messages.png";
import avatar from "../assets/avatar.png";

const ConversationsPage = () => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const userResponse = await getCurrentUser().request;
        setCurrentUser(userResponse.data);

        const response = await conversationsService.getConversations().request;
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleDelete = async (conversationId: string) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) return;
    
    try {
      await conversationsService.deleteConversation(conversationId).request;
      setConversations((prev) => prev.filter((c) => c._id !== conversationId));
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Your Conversations</h2>

      {loading ? (
        <p className="text-center text-muted">Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <div className="text-center mt-5">
          <img
            src={noMessagesImage}
            alt="No Conversations"
            style={{ width: "200px", marginBottom: "10px" }}
          />
          <p className="text-muted">You have no active conversations.</p>
          <p>Start a chat by messaging a friend!</p>
        </div>
      ) : (
        <div
          className="list-group"
          style={{
            maxHeight: "450px",
            overflowY: "auto",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {conversations.map((conversation) => {
            const recipient = conversation.participants.find((p) => p._id !== currentUser?._id);
            return (
              <div
                key={conversation._id}
                className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3"
                style={{ borderBottom: "1px solid #ddd" }}
              >
                <Link
                  to={`/chat/${conversation._id}`}
                  className="d-flex align-items-center"
                  style={{ textDecoration: "none", flexGrow: 1 }}
                >
                <img
                  src={recipient?.profile_picture_uri || avatar}
                  alt="User"
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1">{recipient?.userName || "Unknown User"}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                      {conversation.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(conversation._id)}
                >
                  🗑 
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;
