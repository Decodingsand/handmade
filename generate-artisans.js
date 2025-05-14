import Replicate from 'replicate';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Artisan data with detailed prompts
const artisans = [
  {
    id: 'seller1',
    name: 'Sophia Chen',
    bio: 'I create functional ceramics with clean lines and muted colors. Each piece is hand-thrown and designed to bring simple elegance to everyday moments.',
    location: 'Portland, OR',
    style: 'Modern Minimalist',
    images: [
      {
        name: 'portrait',
        prompt: 'Portrait photograph of Asian American woman named Sophia Chen in her 30s with shoulder-length dark hair, holding a minimalist ceramic mug she created, wearing simple linen clothing, standing in modern pottery studio in Portland, warm natural lighting, white walls, photorealistic, high quality'
      },
      {
        name: 'working',
        prompt: 'Sophia Chen, Asian American woman potter in her 30s with shoulder-length dark hair, working at pottery wheel in Portland studio, throwing a clean-lined minimalist white ceramic vessel, focused expression, modern studio with large windows, natural light, photorealistic, high quality'
      },
      {
        name: 'display',
        prompt: 'Sophia Chen, Asian American woman ceramic artist, arranging her minimalist pottery collection on clean white shelves, simple elegant ceramic pieces in muted tones, Portland Oregon studio with natural light, wearing simple clothing, documentary photography style, photorealistic, high quality'
      }
    ]
  },
  {
    id: 'seller2',
    name: 'Marcus Johnson',
    bio: 'My work explores the relationship between natural textures and geometric forms. I find inspiration in landscapes and translate those elements into tactile ceramics.',
    location: 'Brooklyn, NY',
    style: 'Organic Textures',
    images: [
      {
        name: 'portrait',
        prompt: 'Portrait photograph of Black man named Marcus Johnson in his 40s with short hair and beard, holding a textured ceramic vase he created, wearing earth-toned linen shirt, inside Brooklyn studio with exposed brick walls, warm lighting, photorealistic, high quality'
      },
      {
        name: 'working',
        prompt: 'Marcus Johnson, Black male ceramic artist in his 40s, applying organic textural elements to a large geometric ceramic vessel, focused concentration, using carving tools, inside industrial Brooklyn studio with brick walls, dust in sunbeams through windows, photorealistic, high quality'
      },
      {
        name: 'display',
        prompt: 'Marcus Johnson, Black male ceramicist, proudly displaying collection of his organically textured ceramic pieces on wooden shelving, earth-toned vessels with geometric patterns, Brooklyn studio with industrial aesthetic, documentary photography style, photorealistic, high quality'
      }
    ]
  },
  {
    id: 'seller3',
    name: 'Emma Rodriguez',
    bio: 'I love experimenting with vibrant glazes and playful forms. My ceramics aim to bring joy and a pop of color to any space.',
    location: 'Austin, TX',
    style: 'Colorful Contemporary',
    images: [
      {
        name: 'portrait',
        prompt: 'Portrait photograph of Latina woman named Emma Rodriguez in her late 20s with curly shoulder-length hair, holding a brightly colored ceramic bowl she created, wearing vibrant clothing, inside colorful Austin Texas studio, cheerful expression, photorealistic, high quality'
      },
      {
        name: 'working',
        prompt: 'Emma Rodriguez, Latina ceramic artist in her late 20s with curly hair, applying colorful vibrant glazes to ceramic pieces, joyful concentration, bright airy Austin studio with colorful works in progress surrounding her, documentary photography style, photorealistic, high quality'
      },
      {
        name: 'display',
        prompt: 'Emma Rodriguez, young Latina potter, arranging her collection of contemporary colorful ceramic pieces for display, vibrant glazed pottery in various playful forms, Austin studio with colorful decor elements, bright natural lighting, documentary photography style, photorealistic, high quality'
      }
    ]
  }
];

// Generate images for artisans
async function generateArtisanImages() {
  console.log('Starting artisan image generation with Replicate API...');
  
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

  // Create artisans directory if it doesn't exist
  const artisansDir = path.join(process.cwd(), 'public', 'artisans');
  if (!existsSync(artisansDir)) {
    await mkdir(artisansDir, { recursive: true });
    console.log('Created artisans directory:', artisansDir);
  }

  // Process each artisan
  for (const artisan of artisans) {
    console.log(`Generating images for ${artisan.name}...`);
    
    // Process each image type concurrently (parallel processing)
    const imagePromises = artisan.images.map(async (image, imageIndex) => {
      try {
        console.log(`Generating ${image.name} image for ${artisan.name}...`);
        
        const input = {
          prompt: image.prompt,
          prompt_upsampling: true,
          negative_prompt: "deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, unrealistic, fake, amateur, blurry, old person, multiple ethnicities"
        };

        const outputUrl = await replicate.run("black-forest-labs/flux-1.1-pro", { input });
        
        if (outputUrl) {
          console.log(`${image.name} image generated for ${artisan.name}: ${outputUrl}`);
          
          // Fetch the image data and save locally
          const response = await fetch(outputUrl);
          const buffer = await response.arrayBuffer();
          
          // Save with descriptive filename (e.g., seller1_portrait.jpg)
          const imagePath = path.join(artisansDir, `${artisan.id}_${image.name}.jpg`);
          await writeFile(imagePath, Buffer.from(buffer));
          
          console.log(`Saved ${artisan.name} ${image.name} image to ${imagePath}`);
          return { success: true, image: image.name, path: imagePath };
        }
        return { success: false, image: image.name, error: 'No URL returned' };
      } catch (error) {
        console.error(`Error generating ${image.name} image for ${artisan.name}:`, error);
        return { success: false, image: image.name, error };
      }
    });
    
    // Wait for all images of this artisan to complete before moving to next artisan
    const results = await Promise.all(imagePromises);
    const successCount = results.filter(r => r.success).length;
    console.log(`Generated ${successCount}/${artisan.images.length} images for ${artisan.name}`);
  }
  
  console.log('Artisan image generation complete!');
}

// Run the function
generateArtisanImages().catch(console.error);
