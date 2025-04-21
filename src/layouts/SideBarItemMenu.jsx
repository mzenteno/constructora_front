import React from "react";

export const SideBarItemMenu = ({ id, children }) => {
  return (
    <div className="collapse" id={id}>
      <ul className="nav flex-column sub-menu">
        {children}
      </ul>
    </div>
  );
};
