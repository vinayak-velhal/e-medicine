import React from "react";
import "../OrderStatusTracker.css";

export default function OrderStatusTracker({ status }) {
  const steps = ["Pending", "Dispatched", "Shipped", "Delivered"];

  const isCancelled = status === "Cancelled";
  const currentIndex = isCancelled ? steps.length - 1 : steps.indexOf(status);

  const getActiveColor = () => {
    switch (status) {
      case "Pending": return "#777";
      case "Dispatched": return "#0066ff";
      case "Shipped": return "#ff8c00";
      case "Delivered": return "#28a745";
      case "Cancelled": return "#d00000";
      default: return "#777";
    }
  };

  const activeColor = getActiveColor();

  return (
    <div className="tracker-container m-0 p-0 d-flex justify-content-center">
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;

        const circleColor = isCancelled
          ? activeColor
          : isActive
          ? activeColor
          : "#ddd"; // inactive circle

        const lineColor = isCancelled
          ? activeColor
          : isActive
          ? activeColor
          : "#ccc"; // inactive line

        return (
          <div key={index} className="tracker-step">

            {index > 0 && (
              <div
                className="tracker-line"
                style={{ background: lineColor }}
              ></div>
            )}

            <div
              className="tracker-circle"
              style={{
                background: circleColor,
                borderColor: circleColor, // FIXED HERE
              }}
            ></div>

          </div>
        );
      })}
    </div>
  );
}