import React from "react";

function Hamburger() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      width="24"
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden="true"
      className="fill-black dark:fill-white"
      style={{
        pointerEvents: "none",
        display: "inherit",
        width: "100%",
        height: "100%",
      }}
    >
      <path d="M20 5H4a1 1 0 000 2h16a1 1 0 100-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Z" />
    </svg>
  );
}

export default Hamburger;