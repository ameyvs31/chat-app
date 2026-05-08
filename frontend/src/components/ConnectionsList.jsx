const ConnectionsList = ({ connections, selectedConnection, onSelect }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <p className="text-xs text-gray-500 dark:text-gray-400 px-4 pt-4 pb-2 font-semibold uppercase tracking-wide">
        Connected Users
      </p>

      {connections.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 px-4">
          No connections yet. Enter a chat key above!
        </p>
      )}

      {connections.map((conn) => (
        <div
          key={conn.connectionId}
          onClick={() => onSelect(conn)}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
            hover:bg-gray-100 dark:hover:bg-gray-800
            ${selectedConnection?.connectionId === conn.connectionId
              ? "bg-blue-50 dark:bg-gray-700 border-r-4 border-blue-500"
              : ""
            }`}
        >
          {/* Avatar with online indicator */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
              {conn.user.name.charAt(0).toUpperCase()}
            </div>
            {conn.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
            )}
          </div>

          {/* Name + status */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-white text-sm">
              {conn.user.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {conn.isOnline ? (
                <span className="text-green-500">● Online</span>
              ) : conn.lastSeen ? (
                `Last seen: ${new Date(conn.lastSeen).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              ) : (
                <span>Offline</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectionsList;