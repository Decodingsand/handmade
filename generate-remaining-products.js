import Replicate from 'replicate';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Remaining products that need images
const products = [
  {
    id: 'p11',
    title: 'Stoneware Teapot',
    description: 'Elegant stoneware teapot with bamboo handle and built-in strainer.',
    views: [
      {
        name: 'front',
        prompt: 'Elegant stoneware teapot with bamboo handle, celadon green glaze, front view on white background, product photography, studio lighting, no shadows, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'angle',
        prompt: 'Elegant stoneware teapot with bamboo handle, celadon green glaze, 3/4 angle view showing spout and handle, on white background, product photography, studio lighting, no shadows, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'top',
        prompt: 'Top view of elegant stoneware teapot with bamboo handle, celadon green glaze, lid removed showing built-in strainer, on white background, product photography, studio lighting, no shadows, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of spout and bamboo handle connection on celadon green glazed stoneware teapot, on white background, product photography, studio lighting, no shadows, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Elegant celadon green stoneware teapot with steam rising, surrounded by matching cups on wooden table, warm ambient lighting, cozy setting, shallow depth of field, lifestyle photography, highly detailed photorealistic render'
      }
    ]
  },
  {
    id: 'p12',
    title: 'Ceramic Soap Dish',
    description: 'Hand-built ceramic soap dish with drainage ridges.',
    views: [
      {
        name: 'top',
        prompt: 'Hand-built ceramic soap dish with drainage ridges, soft matte white glaze with subtle speckles, top-down view showing ridges, on white background, product photography, studio lighting, no shadows, highly detailed photorealistic render'
      },
      {
        name: 'angle',
        prompt: 'Hand-built ceramic soap dish with drainage ridges, soft matte white glaze with subtle speckles, 3/4 angle view, on white background, product photography, studio lighting, no shadows, highly detailed photorealistic render'
      },
      {
        name: 'side',
        prompt: 'Side profile view of hand-built ceramic soap dish showing height and drainage design, soft matte white glaze with subtle speckles, on white background, product photography, studio lighting, no shadows, highly detailed photorealistic render'
      },
      {
        name: 'with-soap',
        prompt: 'Hand-built ceramic soap dish with natural handmade soap bar resting on it, soft matte white glaze with subtle speckles, water droplets visible on dish surface, on white background, product photography, studio lighting, no shadows, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Ceramic soap dish with handmade soap in minimalist bathroom setting, marble counter, soft natural lighting from window, lifestyle photography, shallow depth of field, highly detailed photorealistic render'
      }
    ]
  },
  {
    id: 'p13',
    title: 'Decorative Ceramic Lantern',
    description: 'Intricately carved ceramic lantern that casts beautiful shadow patterns when lit.',
    views: [
      {
        name: 'unlit',
        prompt: 'Intricately carved white ceramic lantern with geometric patterns, unlit, front view, on white background, product photography, studio lighting, no shadows, highly detailed photorealistic render'
      },
      {
        name: 'lit',
        prompt: 'Intricately carved white ceramic lantern with warm candle light glowing from within, highlighting the geometric patterns, dark background, dramatic lighting, shadows cast on nearby surface, product photography, highly detailed photorealistic render'
      },
      {
        name: 'detail',
        prompt: 'Close-up macro detail of intricate geometric carving pattern on white ceramic lantern surface, showing texture and craftsmanship, on white background, product photography, studio lighting, highly detailed photorealistic render'
      },
      {
        name: 'top',
        prompt: 'Top-down view of intricately carved white ceramic lantern with lid removed showing candle holder area inside, on white background, product photography, studio lighting, no shadows, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Intricately carved ceramic lantern glowing in evening setting on wooden side table, casting beautiful geometric shadow patterns on nearby wall, warm ambient lighting, cozy interior setting, lifestyle photography, highly detailed photorealistic render'
      }
    ]
  }
];

// Generate images for remaining products
async function generateRemainingImages() {
  console.log('Starting remaining product image generation with Replicate API...');
  
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

  // Create images directory if it doesn't exist
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  if (!existsSync(imagesDir)) {
    await mkdir(imagesDir, { recursive: true });
    console.log('Created images directory:', imagesDir);
  }

  // Process each product
  for (const product of products) {
    console.log(`Generating images for ${product.title}...`);
    
    // Process each image type concurrently (parallel processing)
    const viewPromises = product.views.map(async (view, viewIndex) => {
      try {
        console.log(`Generating ${view.name} view for ${product.title}...`);
        
        const input = {
          prompt: view.prompt,
          prompt_upsampling: true,
          negative_prompt: "deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation"
        };

        const outputUrl = await replicate.run("black-forest-labs/flux-1.1-pro", { input });
        
        if (outputUrl) {
          console.log(`${view.name} view generated for ${product.title}: ${outputUrl}`);
          
          // Fetch the image data and save locally
          const response = await fetch(outputUrl);
          const buffer = await response.arrayBuffer();
          
          // Save with view name included in filename (e.g., p11_front.jpg)
          const imagePath = path.join(imagesDir, `${product.id}_${view.name}.jpg`);
          await writeFile(imagePath, Buffer.from(buffer));
          
          console.log(`Saved ${product.title} ${view.name} view to ${imagePath}`);
          return { success: true, view: view.name, path: imagePath };
        }
        return { success: false, view: view.name, error: 'No URL returned' };
      } catch (error) {
        console.error(`Error generating ${view.name} view for ${product.title}:`, error);
        return { success: false, view: view.name, error };
      }
    });
    
    // Wait for all views of this product to complete before moving to next product
    const results = await Promise.all(viewPromises);
    const successCount = results.filter(r => r.success).length;
    console.log(`Generated ${successCount}/${product.views.length} views for ${product.title}`);
  }
  
  console.log('Remaining product image generation complete!');
}

// Run the function
generateRemainingImages().catch(console.error);
