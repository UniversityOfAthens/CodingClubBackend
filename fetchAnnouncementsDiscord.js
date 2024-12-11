import { promises as fs } from 'fs';
import axios from 'axios';
import schedule from 'node-schedule';
import dotenvConfig from 'dotenv';
import { randomUUID } from 'crypto';
dotenvConfig.config();

const DISCORD_TOKEN = process.env.DISCORD_API_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const OUTPUT_DIR = './discordAnnouncements';

const roleToSectionMapping = {
  '1304747907597078569': 'cp',
  '1305879385454280745': 'security',
  '1304745885212868658': 'gamedev',
  '1304751945034108958': 'hackathons',
  '1315678143683493898': 'important',
  '1304763826050302036': 'general'
};

const allFileNames = ["cp", "security", "gamedev", "hackathons", "opensource", "important", "general"];

// Initialize files once
async function initFiles() {
  if (await fs.stat(OUTPUT_DIR).catch(() => false)) {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  }
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  for (let fileName of allFileNames) {
    const filePath = `${OUTPUT_DIR}/${fileName}.json`;
    await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

async function fetchAnnouncements() {
  try {
    const response = await axios.get(
      `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`,
      {
        headers: { Authorization: `Bot ${DISCORD_TOKEN}` }
      }
    );

    const messages = response.data;

    // Read all section files once into memory
    const dataMap = {};
    for (let fileName of allFileNames) {
      const filePath = `${OUTPUT_DIR}/${fileName}.json`;
      const content = await fs.readFile(filePath, 'utf-8');
      dataMap[fileName] = JSON.parse(content);
    }

    for (const msg of messages) {
      let sectionsMentioned = [];
      // If the message mentions everyone, it goes to "general"
      if (msg.mention_everyone) {
        sectionsMentioned.push("general");
      }

      // Map roles to sections
      for (let roleId of msg.mention_roles) {
        const sectionName = roleToSectionMapping[roleId];
        if (sectionName) {
          sectionsMentioned.push(sectionName);
        } 
      }

      for (let sectionName of sectionsMentioned) {
        // Append new object to in-memory array
        const jsonArray = dataMap[sectionName];
        const date = new Date(msg.timestamp);
        const readableDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const discordAttachmentUrls = msg.attachments.map(attachment => attachment.url);
        const newObject = { id: randomUUID(), title: `Ανακοίνωση ${readableDate}`, content: msg.content, date: readableDate,discordAttachmentUrls };
        jsonArray.push(newObject);
      }
    }

    // Write all changes back to files once
    for (let sectionName of allFileNames) {
      const filePath = `${OUTPUT_DIR}/${sectionName}.json`;
      await fs.writeFile(filePath, JSON.stringify(dataMap[sectionName], null, 2), 'utf-8');
    }

    console.log('Announcements updated successfully!');
  } catch (error) {
    console.error('Error fetching announcements:', error.message);
  }
}

// Initialize files and start the schedule
initFiles().then(() => {
  schedule.scheduleJob('0 */3 * * *', fetchAnnouncements);
  fetchAnnouncements(); // run on startup
});
