import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import conversationsService from "../services/conversations-service";
import { IConversation } from "../services/conversations-service"; // Ensure you have this type defined

const ConversationsPage = () => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
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

  return (
    <div className="container mt-3">
      <h2>All Conversations</h2>
      {loading ? (
        <p>Loading conversations...</p>
      ) : conversations.length === 0 ? (
        <p>No conversations found</p>
      ) : (
        <div
          className="list-group"
          style={{
            maxHeight: "400px", // Set max height for scrollable container
            overflowY: "auto", // Enable vertical scrolling
            marginBottom: "20px", // Add space below the scrollable container
          }}
        >
          {conversations.map((conversation) => (
            <Link
              key={conversation._id}
              to={`/chat/${conversation._id}`}
              className="list-group-item list-group-item-action"
            >
              <h5>{conversation.participants.join(", ")}</h5>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationsPage;
