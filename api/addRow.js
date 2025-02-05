import path from "path";
import fs from "fs";
import XLSX from "xlsx";

export default function handler(req, res) {
  const method = req.method;
  const filePath = path.join(process.cwd(), "public", "OANDA_XAUUSD.xlsx");
  const tempPath = path.join(process.cwd(), "public", "OANDA_XAUUSD_temp.xlsx");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Excel file not found" });
  }

  if (method === "POST") {
    const { time, open, high, low, close, volume } = req.body;

    if (!time || !open || !high || !low || !close || !volume) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      // Read the existing Excel file
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Append the new row
      const newRow = [time, open, high, low, close, volume];
      rows.push(newRow);

      // Write to a temporary file first
      const updatedWorksheet = XLSX.utils.aoa_to_sheet(rows);
      workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet;
      XLSX.writeFile(workbook, tempPath);

      // Replace the old file with the new one (prevents locking issues)
      fs.renameSync(tempPath, filePath);

      res.json({
        message: "Row added successfully",
        fileUrl: `${req.headers.origin}/OANDA_XAUUSD.xlsx`,
      });
    } catch (error) {
      res.status(500).json({ error: "Error writing to Excel file", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
