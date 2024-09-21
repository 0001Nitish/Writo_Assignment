import React from "react";
import DynamicTable from "./component/DynamicTable";

const App: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dynamic Table</h1>
      <DynamicTable />
    </div>
  );
};

export default App;
