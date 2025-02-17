import path from "path";
import fs from "fs";
import XLSX from "xlsx";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const filePath = path.join(process.cwd(), "public", "OANDA_XAUUSD.xlsx");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Excel file not found" });
  }

  const { time, open, high, low, close, volume } = req.body;
  if (!time || !open || !high || !low || !close || !volume) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    rows.push([time, open, high, low, close, volume]);

    const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
    workbook.Sheets[sheetName] = newWorksheet;
    XLSX.writeFile(workbook, filePath);

    res.json({ message: "Row added successfully", fileUrl: `${req.headers.origin}/OANDA_XAUUSD.xlsx` });
  } catch (error) {
    res.status(500).json({ error: "Error writing to Excel file", details: error.message });
  }
}
