import express from "express";
import addRow from "./api/addRow.js";
import getSheet from "./api/getSheet.js";

const app = express();
app.use(express.json());

app.post("/api/addRow", addRow);
app.get("/api/getSheet", getSheet);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
