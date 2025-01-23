import React from "react";

const Sidebar = ({ selectedField, setSelectedField }) => {
  const fields = ["전체", "FRONTEND", "BACKEND", "게임 개발", "인공지능", "데이터", "보안, 네트워크"];

  return (
      <div className="sidebar">
        <h3>분야</h3>
        <ul>
          {fields.map((field) => (
              <li
                  key={field}
                  className={selectedField === field ? "active" : ""}
                  onClick={() => setSelectedField(field)}
              >
                {field}
              </li>
          ))}
        </ul>
      </div>
  );
};

export default Sidebar;
