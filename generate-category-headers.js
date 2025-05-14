import Replicate from 'replicate';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Category descriptions with prompts for header images
const categories = [
  {
    id: 'kitchen',
    title: 'Kitchen',
    prompt: 'A warm artisan kitchen with beautiful handmade ceramic pottery, including mugs, plates, and bowls arranged on wooden shelves and countertops. Soft natural lighting, earthy tones, minimalist aesthetic, high-quality product photography, wide angle scene.'
  },
  {
    id: 'home',
    title: 'Home',
    prompt: 'A cozy living space decorated with handmade ceramic decor items, including vases with dried flowers, decorative bowls, and sculptural pieces on shelves and tables. Soft natural lighting, earthy tones, minimalist aesthetic, high-quality interior photography, wide angle scene.'
  },
  {
    id: 'garden',
    title: 'Garden',
    prompt: 'A serene outdoor garden space with handmade ceramic planters, bird baths, and decorative garden elements among lush greenery. Morning light, earthy tones, peaceful aesthetic, high-quality outdoor photography, wide angle scene.'
  }
];

async function generateCategoryHeaders() {
  console.log('Starting category header image generation with Replicate API...');
  
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

  // Create headers directory if it doesn't exist
  const headersDir = path.join(process.cwd(), 'public', 'headers');
  if (!existsSync(headersDir)) {
    await mkdir(headersDir, { recursive: true });
    console.log('Created headers directory:', headersDir);
  }

  // Process each category
  for (const category of categories) {
    try {
      console.log(`Generating header image for ${category.title} category...`);
      
      const input = {
        prompt: category.prompt,
        prompt_upsampling: true,
        width: 1200,
        height: 400,
        guidance_scale: 8.0,
        negative_prompt: "text, watermark, signature, low quality, blurry, distorted"
      };

      // Using Flux model for high-quality images
      const outputUrl = await replicate.run("black-forest-labs/flux-1.1-pro", { input });
      
      if (outputUrl) {
        console.log(`Header image generated for ${category.title}: ${outputUrl}`);
        
        // Fetch the image data and save locally
        const response = await fetch(outputUrl);
        const buffer = await response.arrayBuffer();
        
        // Save the image with category ID as filename
        const imagePath = path.join(headersDir, `${category.id}_header.jpg`);
        await writeFile(imagePath, Buffer.from(buffer));
        
        console.log(`Saved ${category.title} header to ${imagePath}`);
      } else {
        console.error(`Failed to generate header for ${category.title} category: No URL returned`);
      }
    } catch (error) {
      console.error(`Error generating header for ${category.title} category:`, error);
    }
  }
  
  console.log('Category header image generation complete!');
}

// Run the function
generateCategoryHeaders().catch(console.error);
