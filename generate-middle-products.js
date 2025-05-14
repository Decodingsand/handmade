import Replicate from 'replicate';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Middle range products that need images (p4-p10)
const products = [
  {
    id: 'p4',
    title: 'Textured Vase',
    description: 'Large ceramic vase with hand-carved textural patterns.',
    seller: 'seller2', // Marcus Johnson
    views: [
      {
        name: 'front',
        prompt: 'Large ceramic vase with hand-carved organic textural patterns, earth-toned brown and tan glaze, front view, on white background, product photography, studio lighting, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'angle',
        prompt: 'Large ceramic vase with hand-carved organic textural patterns, earth-toned brown and tan glaze, 3/4 angle view, on white background, product photography, studio lighting, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'detail',
        prompt: 'Close-up macro detail of hand-carved organic textural patterns on ceramic vase, earth-toned brown and tan glaze, showing texture and craftsmanship, on white background, product photography, studio lighting, highly detailed photorealistic render'
      },
      {
        name: 'top',
        prompt: 'Top-down view of large ceramic vase with hand-carved organic textural patterns, earth-toned brown and tan glaze, showing opening, on white background, product photography, studio lighting, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Large ceramic vase with hand-carved textural patterns in earth tones displayed in modern living room with dried botanicals inside, warm ambient lighting, interior design setting, lifestyle photography, highly detailed photorealistic render'
      }
    ]
  },
  {
    id: 'p5',
    title: 'Geometric Bowl',
    description: 'Hand-built bowl with geometric texture and earthy glaze.',
    seller: 'seller2', // Marcus Johnson
    views: [
      {
        name: 'front',
        prompt: 'Hand-built ceramic bowl with geometric texture pattern, earthy glaze in warm terra cotta tones, front view, on white background, product photography, studio lighting, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'angle',
        prompt: 'Hand-built ceramic bowl with geometric texture pattern, earthy glaze in warm terra cotta tones, 3/4 angle view showing interior, on white background, product photography, studio lighting, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'detail',
        prompt: 'Close-up macro detail of geometric texture pattern on ceramic bowl, earthy glaze in warm terra cotta tones, showing texture and craftsmanship, on white background, product photography, studio lighting, highly detailed photorealistic render'
      },
      {
        name: 'top',
        prompt: 'Top-down view of hand-built ceramic bowl with geometric texture pattern, earthy glaze in warm terra cotta tones, showing full interior, on white background, product photography, studio lighting, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Hand-built ceramic bowl with geometric texture pattern in earthy tones displayed on wooden dining table with fresh fruit inside, warm ambient lighting, interior design setting, lifestyle photography, highly detailed photorealistic render'
      }
    ]
  },
  {
    id: 'p6',
    title: 'Desert-inspired Plates',
    description: 'Set of 4 plates with textured surfaces reminiscent of desert landscapes.',
    seller: 'seller2', // Marcus Johnson
    views: [
      {
        name: 'front',
        prompt: 'Set of 4 ceramic plates with textured surfaces reminiscent of desert landscapes, sand and rust colored glazes, stacked slightly offset, front view, on white background, product photography, studio lighting, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'angle',
        prompt: 'Set of 4 ceramic plates with textured surfaces reminiscent of desert landscapes, sand and rust colored glazes, arranged in cascade, 3/4 angle view, on white background, product photography, studio lighting, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'detail',
        prompt: 'Close-up macro detail of textured surface on ceramic plate reminiscent of desert landscape, sand and rust colored glazes, showing texture and craftsmanship, on white background, product photography, studio lighting, highly detailed photorealistic render'
      },
      {
        name: 'flat',
        prompt: 'Single ceramic plate with textured surface reminiscent of desert landscape, sand and rust colored glazes, flat lay view from above, on white background, product photography, studio lighting, minimalist aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Set of ceramic plates with textured desert-inspired surfaces in earthy tones, arranged on rustic wooden table with southwestern meal, warm ambient lighting, dining setting, lifestyle photography, highly detailed photorealistic render'
      }
    ]
  },
  {
    id: 'p7',
    title: 'Modern Tea Cups',
    description: 'Set of 2 handleless ceramic tea cups with minimalist design.',
    seller: 'seller1', // Sophia Chen
    views: [
      {
        name: 'front',
        prompt: 'Set of 2 handleless ceramic tea cups with minimalist design, matte white glaze, front view, on white background, product photography, studio lighting, clean aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'angle',
        prompt: 'Set of 2 handleless ceramic tea cups with minimalist design, matte white glaze, 3/4 angle view, on white background, product photography, studio lighting, clean aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of single handleless ceramic tea cup with minimalist design, matte white glaze, showing subtle texture and rim, on white background, product photography, studio lighting, clean aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'top',
        prompt: 'Top-down view of set of 2 handleless ceramic tea cups with minimalist design, matte white glaze, showing opening, on white background, product photography, studio lighting, clean aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Set of 2 handleless ceramic tea cups with minimalist design, steaming tea inside, arranged on simple wooden tray with teapot, natural lighting, minimalist interior setting, lifestyle photography, highly detailed photorealistic render'
      }
    ]
  },
  {
    id: 'p8',
    title: 'Rainbow Mug Collection',
    description: 'Set of 4 hand-thrown mugs in vibrant rainbow glazes.',
    seller: 'seller3', // Emma Rodriguez
    views: [
      {
        name: 'front',
        prompt: 'Set of 4 hand-thrown ceramic mugs in vibrant rainbow glazes (blue, yellow, red, purple), lined up, front view, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'angle',
        prompt: 'Set of 4 hand-thrown ceramic mugs in vibrant rainbow glazes (blue, yellow, red, purple), arranged in semi-circle, 3/4 angle view, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of hand-thrown ceramic mug in vibrant purple glaze, showing handle attachment and glaze details, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'stacked',
        prompt: 'Set of 4 hand-thrown ceramic mugs in vibrant rainbow glazes (blue, yellow, red, purple), stacked carefully, side view, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Set of 4 hand-thrown ceramic mugs in vibrant rainbow glazes arranged on colorful kitchen counter with coffee brewing nearby, bright morning light, contemporary setting, lifestyle photography, highly detailed photorealistic render'
      }
    ]
  },
  {
    id: 'p9',
    title: 'Playful Serving Platters',
    description: 'Set of 3 oval serving platters in complementary bright colors.',
    seller: 'seller3', // Emma Rodriguez
    views: [
      {
        name: 'front',
        prompt: 'Set of 3 oval ceramic serving platters in complementary bright colors (teal, orange, yellow), arranged in cascade, front view, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'angle',
        prompt: 'Set of 3 oval ceramic serving platters in complementary bright colors (teal, orange, yellow), stacked slightly offset, 3/4 angle view, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of bright teal oval ceramic serving platter, showing glaze texture and rim design, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'flat',
        prompt: 'Single bright orange oval ceramic serving platter, flat lay view from above, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Set of 3 oval ceramic serving platters in bright colors arranged on dining table with colorful food, dinner party setting, bright ambient lighting, lifestyle photography, highly detailed photorealistic render'
      }
    ]
  },
  {
    id: 'p10',
    title: 'Whimsical Bud Vases',
    description: 'Set of 5 small bud vases in playful shapes and colors.',
    seller: 'seller3', // Emma Rodriguez
    views: [
      {
        name: 'front',
        prompt: 'Set of 5 small ceramic bud vases in playful shapes and bright colors (pink, blue, green, yellow, purple), arranged in height order, front view, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'angle',
        prompt: 'Set of 5 small ceramic bud vases in playful shapes and bright colors (pink, blue, green, yellow, purple), arranged in semi-circle, 3/4 angle view, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of small bright pink ceramic bud vase with playful twisted shape, showing glaze texture and form, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'grouped',
        prompt: 'Set of 5 small ceramic bud vases in playful shapes and bright colors grouped closely together, showing variety of forms, on white background, product photography, studio lighting, colorful aesthetic, highly detailed photorealistic render'
      },
      {
        name: 'lifestyle',
        prompt: 'Set of 5 small ceramic bud vases in playful shapes and bright colors arranged on window sill with single fresh flowers in each, bright daylight streaming in, contemporary colorful home setting, lifestyle photography, highly detailed photorealistic render'
      }
    ]
  }
];

// Generate images for remaining products
async function generateMiddleProductImages() {
  console.log('Starting middle-range product image generation with Replicate API...');
  
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
    console.log(`Generating images for ${product.title} (${product.id})...`);
    
    // Process each image type concurrently (parallel processing)
    const viewPromises = product.views.map(async (view, viewIndex) => {
      try {
        console.log(`Generating ${view.name} view for ${product.title}...`);
        
        const input = {
          prompt: view.prompt,
          prompt_upsampling: true,
          negative_prompt: "deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation, text, watermark, signature"
        };

        const outputUrl = await replicate.run("black-forest-labs/flux-1.1-pro", { input });
        
        if (outputUrl) {
          console.log(`${view.name} view generated for ${product.title}: ${outputUrl}`);
          
          // Fetch the image data and save locally
          const response = await fetch(outputUrl);
          const buffer = await response.arrayBuffer();
          
          // Save with view name included in filename (e.g., p4_front.jpg)
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
  
  console.log('Middle-range product image generation complete!');
}

// Run the function
generateMiddleProductImages().catch(console.error);
