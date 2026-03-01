import React from "react";

const FullScreenButton = () => {
  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <button
      onClick={handleFullScreen}
      style={{ padding: "10px", fontSize: "16px" }}
      className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode"
    >
      <i className="bx bx-fullscreen fs-22" />
    </button>
  );
};

export default FullScreenButton;
