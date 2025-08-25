import React from "react";

export const Spinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <div className="spinner" />
    <style jsx>{`
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #fff;
        border-top: 4px solid rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);
