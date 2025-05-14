import Replicate from 'replicate';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function generateHeroImage() {
  console.log('Starting hero image generation with Replicate API...');
  
  // Check if API token is properly set
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('ERROR: REPLICATE_API_TOKEN environment variable is not set!');
    return;
  } else {
    console.log(`API token present: ${process.env.REPLICATE_API_TOKEN.substring(0, 5)}...${process.env.REPLICATE_API_TOKEN.substring(process.env.REPLICATE_API_TOKEN.length - 4)}`);
  }
  
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  // Create heroes directory if it doesn't exist
  const heroesDir = path.join(process.cwd(), 'public', 'heroes');
  if (!existsSync(heroesDir)) {
    await mkdir(heroesDir, { recursive: true });
    console.log('Created heroes directory:', heroesDir);
  }

  try {
    console.log('Generating Japanese tea ceremony hero image...');
    
    const prompt = "A beautiful artistic exhibition of a traditional handmade Japanese tea set, featuring a rustic ceramic teapot, two matching tea cups with detailed craftsmanship, all elegantly arranged on a vintage wooden Japanese tea serving tray. Soft natural lighting from a side window, muted earthy tones with hints of blue glazing, shallow depth of field, award-winning product photography, museum quality display, 8k resolution, highly detailed.";
    
    const input = {
      prompt,
      prompt_upsampling: true,
      width: 1024,
      height: 1024,
      guidance_scale: 7.5,
      negative_prompt: "text, watermark, signature, low quality, blurry, distorted, anime, cartoon style, oversaturated colors"
    };

    // Using Flux model for high-quality images
    const outputUrl = await replicate.run("black-forest-labs/flux-1.1-pro", { input });
    
    if (outputUrl) {
      console.log(`Hero image generated: ${outputUrl}`);
      
      // Fetch the image data and save locally
      const response = await fetch(outputUrl);
      const buffer = await response.arrayBuffer();
      
      // Save the image
      const imagePath = path.join(heroesDir, 'japanese_tea_ceremony.jpg');
      await writeFile(imagePath, Buffer.from(buffer));
      
      console.log(`Saved hero image to ${imagePath}`);
      return imagePath;
    } else {
      console.error('Failed to generate hero image: No URL returned');
    }
  } catch (error) {
    console.error('Error generating hero image:', error);
  }
  
  console.log('Hero image generation complete!');
}

// Run the function
generateHeroImage().catch(console.error);
