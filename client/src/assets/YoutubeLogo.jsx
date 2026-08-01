import React from "react";

function WatchTubeLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="yt-ringo2-svg_yt107"
      width="135"
      height="20"
      viewBox="0 0 135 20"
      focusable="false"
      aria-hidden="true"
      className="w-full h-full pointer-events-none"
    >
      {/* The original YouTube red play button */}
      <g>
        <path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033" />
        <path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white" />
      </g>

      {/* Replaced vector paths with a text element for "WatchTube" */}
      <text
        x="33"
        y="16"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="bold"
        fontSize="16.5"
        letterSpacing="-0.5"
        className="fill-black dark:fill-white"
      >
        WatchTube
      </text>
    </svg>
  );
}

export default WatchTubeLogo;