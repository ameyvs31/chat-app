import themes from "../config/themes";

const swatches = {
  default:  { bg: "#378ADD", accent: "#ffffff" },
  amoled:   { bg: "#000000", accent: "#0066cc" },
  cream:    { bg: "#faf8f4", accent: "#2c2c2a" },
  violet:   { bg: "#12082a", accent: "#6633cc" },
  frost:    { bg: "#dde6f5", accent: "#185FA5" },
  sand:     { bg: "#f7f3ec", accent: "#0F6E56" },
  charcoal: { bg: "#1a1a1a", accent: "#993556" },
};

const ThemePicker = ({ currentTheme, onSelect, onClose }) => {
  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        paddingTop: "60px",
        paddingRight: "16px",
      }}
    >
      {/* Picker panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1e1e1e",
          border: "0.5px solid #333",
          borderRadius: "12px",
          padding: "12px",
          width: "200px",
          zIndex: 51,
        }}
      >
        <p style={{
          fontSize: "10px",
          color: "#888",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}>
          Chat Theme
        </p>

        {/* Theme options */}
        {Object.entries(themes).map(([key, theme]) => (
          <div
            key={key}
            onClick={() => onSelect(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "7px 8px",
              borderRadius: "8px",
              cursor: "pointer",
              background: currentTheme === key ? "#2a2a2a" : "transparent",
              marginBottom: "2px",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#2a2a2a"}
            onMouseLeave={(e) => e.currentTarget.style.background = currentTheme === key ? "#2a2a2a" : "transparent"}
          >
            {/* Color swatch */}
            <div style={{
              width: "28px",
              height: "20px",
              borderRadius: "5px",
              background: swatches[key].bg,
              border: "0.5px solid #444",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "12px",
                height: "12px",
                background: swatches[key].accent,
                borderRadius: "3px 0 5px 0",
              }} />
            </div>

            {/* Name */}
            <span style={{
              fontSize: "11px",
              color: currentTheme === key ? "#fff" : "#aaa",
              fontWeight: currentTheme === key ? 500 : 400,
            }}>
              {theme.name}
            </span>

            {/* Active checkmark */}
            {currentTheme === key && (
              <span style={{ marginLeft: "auto", fontSize: "10px", color: "#1D9E75" }}>✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemePicker;