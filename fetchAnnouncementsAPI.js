import express from 'express'
import fs from 'fs'
import cors from "cors"

const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());

function fetchAnnouncements(localFile, localDiscordFile, res) {
    let idCounter = 0;
    // Fetch from local file
    const localFetch = new Promise((resolve, reject) => {
      fs.readFile(localFile, "utf-8", (err, data) => {
        if (err) { // check errors
          console.error("Error reading local file:", err);
          return resolve([]);
        }
  
        const localAnnouncements = data
          .split("---")
          .filter(item => item.length > 3)
          .map((item, index) => {
            idCounter++;
            return (
            {
              id: idCounter,
              content: item.trim(),
            });
          });
        resolve(localAnnouncements);
      });
    });
  
    // Fetch from remote file
    const localDiscordFetch = new Promise((resolve, reject) => {
      fs.readFile(localDiscordFile, "utf-8", (err, data) => {
        if (err) {
          console.error("Error reading local discord file:", err);
          return resolve([]); // Resolve with an empty array on error
        }
  
        const localDiscordAnnouncements = data
          .split("---")
          .filter(item => item.length > 3)
          .map((item, index) => {
            idCounter++;
            return (
            {
              id: idCounter,
              content: item.trim(),
            });
          });

        resolve(localDiscordAnnouncements);
      });
    });
  
    // Wait for both fetches to complete
    Promise.all([localFetch, localDiscordFetch])
      .then((results) => {
        const announcements = [];
        results.forEach((result) => announcements.push(...result));
  
        // Send combined announcements as the response
        res.json(announcements);
      })
      .catch((error) => {
        console.error("Error resolving promises:", error);
        res.status(500).json({ error: "Failed to load announcements" });
    });
  }
  
//Routes to get the announcements
app.get('/api/announcements/general', (req, res) => {
  const localFile = './localAnnouncements/general.md';
  const localDiscordFiles = './discordAnnouncements/general.md';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/gamedev', (req, res) => {
  const localFile = './localAnnouncements/gamedev.md';
  const localDiscordFiles = './discordAnnouncements/gamedev.md';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/cp', (req, res) => {
  const localFile = './localAnnouncements/cp.md';
  const localDiscordFiles = './discordAnnouncements/cp.md';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/security', (req, res) => {
  const localFile = './localAnnouncements/security.md';
  const localDiscordFiles = './discordAnnouncements/security.md';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/hackathons', (req, res) => {
  const localFile = './localAnnouncements/hackathons.md';
  const localDiscordFiles = './discordAnnouncements/hackathons.md';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/opensource', (req, res) => {
  const localFile = './localAnnouncements/opensource.md';
  const localDiscordFiles = './discordAnnouncements/opensource.md';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/important', (req, res) => {
  const localFile = './localAnnouncements/important.md';
  const localDiscordFiles = './discordAnnouncements/important.md';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
