import dotenvConfig from 'dotenv';
dotenvConfig.config();
import axios from 'axios'
import fs from 'fs'
import schedule from 'node-schedule'
import formatTimestamp from './formatTimestamp.js'

// DISCORD_TOKEN = SEPERATE FOR EACH DISCORD USER
// DISCORD_CHANNEL_ID = THE ID OF THE ANNOUNCEMENT CHANNEL IN OUR DISCORD SERVER
// OUTPUT_DIR = THE DIRECTORY WE ARE GOING TO STORE THE ANNOUNCEMENTS
const DISCORD_TOKEN = process.env.DISCORD_API_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const OUTPUT_DIR = './discordAnnouncements';

if (fs.existsSync(OUTPUT_DIR)) // check if the ./discordAnnouncements directory exists
{
    // if it exists delete everything
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
} 
fs.mkdirSync(OUTPUT_DIR)

const fetchAnnouncements = async () => {
    try {
        const response = await axios.get(
            `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`,
            {
                headers: {
                    Authorization: `Bot ${DISCORD_TOKEN}`,
                },
            }
        );
        const messages = response.data;

        const roleToSectionMapping = {
            '1304747907597078569': 'cp',
            '1305879385454280745': 'security',
            '1304745885212868658': 'gamedev',
            '1304751945034108958': 'hackathons',
            '1315678143683493898': 'important',
            '1304763826050302036': 'general'
        };

        const allFileNames = ["cp", "security", "gamedev", "hackathons", "opensource", "important", "general"];
        // Create files for each section
        for (let fileName of allFileNames) {
            const filePath = `${OUTPUT_DIR}/${fileName}.md`;
            fs.writeFileSync(filePath, "", 'utf8');
        }

        for (let msg of messages) {
            let sectionsMentioned = [];
        
            // If the message mentions @everyone, include announcement to general
            if (msg.mention_everyone) {
                sectionsMentioned.push("general");
            }

            // Include respective file name for each mentioned role
            for (let roleId of msg.mention_roles) {
                const sectionName = roleToSectionMapping[roleId];
                if (sectionName) {
                    sectionsMentioned.push(sectionName);
                } 
            }
        
            // Write content to files
            for (let sectionName of sectionsMentioned) {
                const filePath = `${OUTPUT_DIR}/${sectionName}.md`;
                const markdownContent = `\n###${formatTimestamp(msg.timestamp)}\n${msg.content}\n---`;
                fs.appendFileSync(filePath, markdownContent, 'utf8');
            }
        }
    
    } catch (error) {
        console.error('Error fetching announcements:', error.message);
    }
};

// Schedule the task to run every 3 hours
schedule.scheduleJob('0 */3 * * *', fetchAnnouncements);
fetchAnnouncements(); // Run immediately on startup