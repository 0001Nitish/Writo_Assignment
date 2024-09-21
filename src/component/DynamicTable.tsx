import React, { useState } from "react";
import "./DynamicTable.css";
interface Column {
  id: string;
  type: "string" | "number";
  title: string;
}

interface Row {
  [key: string]: string[] | number;
}

const DynamicTable: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [numberCondition, setNumberCondition] = useState<string>(">=");
  const [sortValue, setSortValue] = useState<string>("");
  const [sortCondition, setSortCondition] = useState<string>(">=");

  const addColumn = (title: string, type: "string" | "number") => {
    const newColumn = { id: title, type, title };
    setColumns((prev) => [...prev, newColumn]);
  };

  const addRow = (newRow: Row) => {
    setRows((prev) => [...prev, newRow]);
  };

  const deleteRow = (rowIndex: number) => {
    setRows((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const filteredRows = rows.filter((row) => {
    if (selectedColumn) {
      const cellData = row[selectedColumn];

      if (Array.isArray(cellData)) {
        // Filter for string columns
        return cellData.some((item) => item.includes(filterValue.trim()));
      } else if (typeof cellData === "number") {
        // Filter for number columns
        const numericValue = parseFloat(filterValue.trim());
        if (!isNaN(numericValue)) {
          if (numberCondition === ">=") {
            return cellData >= numericValue;
          } else if (numberCondition === "<=") {
            return cellData <= numericValue;
          }
        }
      }
    }
    return true; // If no column selected, show all rows
  });

  const sortedRows = filteredRows.filter((row) => {
    if (
      selectedColumn &&
      columns.find((col) => col.id === selectedColumn)?.type === "number"
    ) {
      const cellData = row[selectedColumn];
      const sortValueNum = parseFloat(sortValue.trim());
      if (!isNaN(sortValueNum)) {
        if (sortCondition === ">=") {
          return cellData >= sortValueNum;
        } else if (sortCondition === "<=") {
          return cellData <= sortValueNum;
        }
      }
    }
    return true; // If no sort condition, return all filtered rows
  });

  return (
    <div>
      {/* Form to add columns */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const title = form.elements.namedItem("title") as HTMLInputElement;
          const type = form.elements.namedItem("type") as HTMLSelectElement;
          addColumn(title.value, type.value as "string" | "number");
          title.value = "";
        }}
      >
        <input type="text" name="title" placeholder="Column Title" required />
        <select name="type" required>
          <option value="string">String</option>
          <option value="number">Number</option>
        </select>
        <button type="submit">Add Column</button>
      </form>

      {/* Form to add rows */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const newRow: Row = {};
          columns.forEach((col) => {
            const input = form.elements.namedItem(col.id) as HTMLInputElement;
            newRow[col.id] = input.value.split(",").map((item) => item.trim());
          });
          addRow(newRow);
        }}
      >
        {columns.map((col) => (
          <input
            key={col.id}
            type="text"
            name={col.id}
            placeholder={`Add ${col.title}`}
            required
          />
        ))}
        <button type="submit">Add Row</button>
      </form>

      {/* Filter Input and Column Selector */}
      <div style={{ margin: "10px 0", display: "flex", alignItems: "center" }}>
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
        >
          <option value="">Select Column for Filter</option>
          {columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter value"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Sorting Section */}
      <div style={{ margin: "10px 0", display: "flex", alignItems: "center" }}>
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
        >
          <option value="">Select Column for Sort</option>
          {columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Sort value"
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        {selectedColumn &&
          columns.find((col) => col.id === selectedColumn)?.type ===
            "number" && (
            <div style={{ marginLeft: "10px" }}>
              <select
                value={sortCondition}
                onChange={(e) => setSortCondition(e.target.value)}
              >
                <option value=">=">{`>=`}</option>
                <option value="<=">{`<=`}</option>
              </select>
            </div>
          )}
      </div>

      {/* Render the table */}
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.id}>{col.title}</th>
            ))}
            <th>Actions</th> {/* Column for actions */}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => {
                const cellData = row[col.id];
                return (
                  <td key={col.id}>
                    {Array.isArray(cellData) ? cellData.join(", ") : cellData}
                  </td>
                );
              })}
              <td>
                <button onClick={() => deleteRow(rowIndex)}>Delete</button>{" "}
                {/* Delete button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
