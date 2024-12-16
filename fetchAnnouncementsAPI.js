import express from 'express'
import fs from 'fs'
import cors from "cors"
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

function fetchAnnouncements(localFile, localDiscordFile, res) {  
  const localFileData = JSON.parse(fs.readFileSync(localFile, 'utf-8'));
  const discordFileData = JSON.parse(fs.readFileSync(localDiscordFile, 'utf-8'));
  
  const appendedData = Array.isArray(localFileData) && Array.isArray(discordFileData)
      ? [...localFileData]
      : { ...localFileData };
      // ? [...localFileData, ...discordFileData]
      // : { ...localFileData, ...discordFileData };
  
  res.json(appendedData);
}
  
//Routes to get the announcements
app.get('/api/announcements/general', (req, res) => {
  const localFile = './localAnnouncements/general.json';
  const localDiscordFiles = './discordAnnouncements/general.json';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/gamedev', (req, res) => {
  const localFile = './localAnnouncements/gamedev.json';
  const localDiscordFiles = './discordAnnouncements/gamedev.json';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/cp', (req, res) => {
  const localFile = './localAnnouncements/cp.json';
  const localDiscordFiles = './discordAnnouncements/cp.json';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/security', (req, res) => {
  const localFile = './localAnnouncements/security.json';
  const localDiscordFiles = './discordAnnouncements/security.json';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/hackathons', (req, res) => {
  const localFile = './localAnnouncements/hackathons.json';
  const localDiscordFiles = './discordAnnouncements/hackathons.json';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/opensource', (req, res) => {
  const localFile = './localAnnouncements/opensource.json';
  const localDiscordFiles = './discordAnnouncements/opensource.json';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/announcements/important', (req, res) => {
  const localFile = './localAnnouncements/important.json';
  const localDiscordFiles = './discordAnnouncements/important.json';
  fetchAnnouncements(localFile, localDiscordFiles, res);
});

app.get('/api/talks', (req, res) => {
  const talksData = JSON.parse(fs.readFileSync('./talks/talks.json', 'utf-8'))
  res.json(talksData)
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
