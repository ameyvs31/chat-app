import { useAuth } from "../context/AuthContext";

const MessageBubble = ({ message, isTyping = false }) => {
  const { user } = useAuth();
  const isMe = message.sender._id === user._id;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-sm
          ${isMe
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600"
          }`}
      >
        <p>{message.text}</p>
        <p className={`text-xs mt-1 text-right
          ${isMe ? "text-blue-100" : "text-gray-400 dark:text-gray-400"}`}>
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;