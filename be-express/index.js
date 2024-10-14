const express = require("express");
const { google } = require("googleapis");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(express.json());

const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];
const key = require("./angular-push-notificatio-8abc4-firebase-adminsdk-1ozht-7e2b226620.json");

const getToken = async () => {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );

    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
      } else {
        resolve(tokens.access_token);
      }
    });
  });
};

app.get("/token", async (req, res) => {
  try {
    const token = await getToken();
    res.json({ access_token: token });
  } catch (err) {
    console.error("Error fetching token:", err);
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

app.post("/message", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.token || !message.notification) {
    return res.status(400).json({ error: "Invalid message format" });
  }

  try {
    const accessToken = await getToken();

    const response = await axios.post(
      "https://fcm.googleapis.com/v1/projects/angular-push-notificatio-8abc4/messages:send",
      {
        message: {
          token: message.token,
          notification: message.notification,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
