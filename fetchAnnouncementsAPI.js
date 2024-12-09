import express from 'express'
import fs from 'fs'

const app = express();
const PORT = 3001;
function fetchAnnouncements(localFile, fileUrl, res) {
    const announcements = []; // Main announcements array
  
    // Fetch from local file
    const localFetch = new Promise((resolve, reject) => {
      fs.readFile(localFile, "utf-8", (err, data) => {
        if (err) {
          console.error("Error reading local file:", err);
          return resolve([]); // Resolve with an empty array on error
        }
  
        const localAnnouncements = data
          .split("---")
          .map((item, index) => ({
            id: announcements.length + index + 1,
            content: item.trim(),
          }));
        resolve(localAnnouncements);
      });
    });
  
    // Fetch from remote file
    const remoteFetch = fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch remote file: ${response.statusText}`);
        }
        return response.text();
      })
      .then((data) => {
        const remoteAnnouncements = data
          .split("---")
          .map((item, index) => ({
            id: announcements.length + index + 1,
            content: item.trim(),
          }));
        return remoteAnnouncements;
      })
      .catch((error) => {
        console.error("Error fetching remote file:", error);
        return []; // Return an empty array on error
      });
  
    // Wait for both fetches to complete
    Promise.all([localFetch, remoteFetch])
      .then((results) => {
        // Combine results from both fetches
        results.forEach((result) => announcements.push(...result));
  
        // Send combined announcements as the response
        res.json(announcements);
      })
      .catch((error) => {
        console.error("Error resolving promises:", error);
        res.status(500).json({ error: "Failed to load announcements" });
      });
  }
  
// Route to get the announcements
app.get('/api/announcements/announcements', (req, res) => {
const localFile = './assets/announcements/announcements.md';
const fileUrl = 'https://codingclub-4bvs.onrender.com/announcements/announcements.md';

fetchAnnouncements(localFile, fileUrl, res);
});

app.get('/api/announcements/gamedev', (req, res) => {
    const localFile = './assets/announcements/gamedev.md';
    const fileUrl = 'https://codingclub-4bvs.onrender.com/announcements/gamedev.md';
    
fetchAnnouncements(localFile, fileUrl, res);
});

app.get('/api/announcements/cp', (req, res) => {
    const localFile = './assets/announcements/cp.md';
    const fileUrl = 'https://codingclub-4bvs.onrender.com/announcements/cp.md';
    
fetchAnnouncements(localFile, fileUrl, res);
});

app.get('/api/announcements/security', (req, res) => {
    const localFile = './assets/announcements/security.md';
    const fileUrl = 'https://codingclub-4bvs.onrender.com/announcements/security.md';
    
fetchAnnouncements(localFile, fileUrl, res);
});

app.get('/api/announcements/hackathons', (req, res) => {
    const localFile = './assets/announcements/hackathons.md';
    const fileUrl = 'https://codingclub-4bvs.onrender.com/announcements/hackathons.md';
    
fetchAnnouncements(localFile, fileUrl, res);
});

app.get('/api/announcements/opensource', (req, res) => {
    const localFile = './assets/announcements/opensource.md';
    const fileUrl = 'https://codingclub-4bvs.onrender.com/announcements/opensource.md';
    
fetchAnnouncements(localFile, fileUrl, res);
});

app.get('/api/announcements/important', (req, res) => {
    const localFile = './assets/announcements/important.md';
    const fileUrl = 'https://codingclub-4bvs.onrender.com/announcements/important.md';
    
fetchAnnouncements(localFile, fileUrl, res);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
