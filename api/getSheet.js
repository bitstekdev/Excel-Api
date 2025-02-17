import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function handler(req, res) {
  // Define the destination directory where the file will be saved
  const destinationDir = path.join("C:", "Users", "shaik", "Desktop", "Test-Experiment", "Excel-API", "Downloaded");

  // Ensure the directory exists
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  // Define the file path
  const filePath = path.join(__dirname, "../public", "OANDA_XAUUSD.xlsx");
  const destinationPath = path.join(destinationDir, "OANDA_XAUUSD.xlsx");

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Excel file not found" });
  }

  // Copy the file to the new location
  fs.copyFileSync(filePath, destinationPath);

  // Set headers to trigger file download in Postman
  res.setHeader("Content-Disposition", "attachment; filename=OANDA_XAUUSD.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

  // Stream the file to the client
  const fileStream = fs.createReadStream(destinationPath);
  fileStream.pipe(res);

  // You can also log the saved file location
  console.log(`File saved to: ${destinationPath}`);
}
