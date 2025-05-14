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

async function generateImage(prompt, outputPath, width = 1200, height = 600) {
  console.log(`Generating image for: ${prompt.substring(0, 50)}...`);
  
  const input = {
    prompt,
    prompt_upsampling: true,
    width,
    height,
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
        console.log(`Image saved to ${outputPath}`);
        resolve(outputPath);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error generating image for ${prompt.substring(0, 30)}:`, error);
    throw error;
  }
}

async function generateCategoryHeaders() {
  const categories = [
    {
      name: 'kitchen',
      prompt: 'Close-up detailed view of hands forming a ceramic mug on a pottery wheel, clay being shaped with fingers, wet clay texture visible, earthy tones, artistic process, studio lighting'
    },
    {
      name: 'home',
      prompt: 'Close-up of artisan hands carving intricate patterns into a ceramic vase, mid-range view, detail of handcrafted pottery, decorative home decor piece being crafted, warm studio lighting'
    },
    {
      name: 'garden',
      prompt: 'Detailed view of hands glazing a terracotta planter, showing paint brush techniques and texture, garden pottery being crafted, earthy clay materials, artisan workshop background'
    }
  ];

  for (const category of categories) {
    await generateImage(
      category.prompt,
      `./public/headers/${category.name}_header_new.jpg`,
      1200,
      600
    );
  }
}

async function generateArtisanImages() {
  const artisans = [
    {
      id: 'seller1',
      name: 'Sophia Chen',
      images: [
        {
          type: 'portrait',
          prompt: 'Female ceramic artist in her 30s standing proudly next to her finished minimalist pottery collection, natural light studio, modern ceramics on display shelves, simple elegant pottery in earthy tones'
        },
        {
          type: 'working',
          prompt: 'Close-up of female potter with Asian features working at wheel, hands shaping a minimalist bowl, focused expression, artistic process, modern studio with natural light'
        },
        {
          type: 'display',
          prompt: 'Professional display of minimal ceramic collection by female artisan, elegant arrangement of mugs, bowls and vases in muted earth tones, gallery lighting, modern pottery exhibition'
        }
      ]
    },
    {
      id: 'seller2',
      name: 'Marcus Johnson',
      images: [
        {
          type: 'portrait',
          prompt: 'Black male ceramic artist in his 40s sitting beside his textured ceramic vessels, urban studio environment, architectural pottery with organic textures, industrial modern workspace'
        },
        {
          type: 'working',
          prompt: 'African American male potter hand-building a textured ceramic piece, adding organic patterns by hand, focused on detailed work, Brooklyn studio with industrial aesthetic'
        },
        {
          type: 'display',
          prompt: 'Collection of textured ceramic vessels by male artisan, architectural forms with organic textures, professional gallery display, modern urban pottery exhibition'
        }
      ]
    },
    {
      id: 'seller3',
      name: 'Emma Rodriguez',
      images: [
        {
          type: 'portrait',
          prompt: 'Latina female artist with colorful ceramics, standing in bright studio space, vibrant pottery collection with playful designs, Austin studio with contemporary feel'
        },
        {
          type: 'working',
          prompt: 'Close-up of Latina potter applying colorful glazes to ceramic pieces, paintbrush in hand, vibrant color palette, artistic process, sunlit modern studio'
        },
        {
          type: 'display',
          prompt: 'Vibrant collection of colorful contemporary ceramics by female artisan, playful pottery forms with bright glazes, modern gallery display, artistic pottery arrangement'
        }
      ]
    }
  ];

  for (const artisan of artisans) {
    for (const image of artisan.images) {
      await generateImage(
        image.prompt,
        `./public/artisans/${artisan.id}_${image.type}_new.jpg`,
        800,
        800
      );
    }
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
    console.log('Generating new category header images...');
    await generateCategoryHeaders();
    
    console.log('Generating new artisan images...');
    await generateArtisanImages();
    
    console.log('All images generated successfully!');
  } catch (error) {
    console.error('Failed to generate images:', error);
    process.exit(1);
  }
})();
