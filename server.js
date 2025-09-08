const express = require("express");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/submit", (req, res) => {
  const filePath = "applications.xlsx";

  // Load or create workbook
  let workbook;
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([
      ["Name", "Email", "Phone", "Position", "Experience", "Resume"]
    ]), "Applications");
  }

  const worksheet = workbook.Sheets["Applications"];
  const data = [
    req.body.fullname,
    req.body.email,
    req.body.phone,
    req.body.position,
    req.body.experience,
    req.body.resume
  ];

  XLSX.utils.sheet_add_aoa(worksheet, [data], { origin: -1 });
  XLSX.writeFile(workbook, filePath);

  res.json({ message: "Saved to Excel ✅" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
