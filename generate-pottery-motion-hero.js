import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateHeroImage() {
  console.log("Generating pottery in motion hero image...");
  
  const prompt = "Cinematic wide shot of hands crafting a ceramic bowl on a pottery wheel, clay being shaped, water and clay in motion, soft natural light from window, studio environment, artisan workshop, high detail, earthy tones, professional photography";
  
  const input = {
    prompt,
    prompt_upsampling: true,
    width: 1200,
    height: 600,
    guidance_scale: 7.5,
  };

  try {
    const outputUrl = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      { input }
    );
    
    if (!outputUrl) {
      throw new Error('No output URL received from Replicate');
    }
    
    console.log(`Downloading image from ${outputUrl}...`);
    
    const response = await axios({
      method: 'GET',
      url: outputUrl,
      responseType: 'stream'
    });
    
    // Define output path
    const outputPath = './public/heroes/pottery_in_motion.jpg';
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save the image
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Hero image saved to ${outputPath}`);
        resolve(outputPath);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error generating hero image:', error);
    throw error;
  }
}

// Main execution
(async function() {
  // Ensure we have the API token
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('REPLICATE_API_TOKEN is not set in the .env file');
    process.exit(1);
  }
  
  try {
    await generateHeroImage();
    console.log('Hero image generation complete!');
  } catch (error) {
    console.error('Failed to generate hero image:', error);
    process.exit(1);
  }
})();
