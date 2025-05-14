import Replicate from 'replicate';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Product descriptions from mockData.ts with multiple views
const products = [
  // EXISTING PRODUCTS
  {
    id: 'p1',
    title: 'Minimalist Ceramic Mug',
    description: 'Hand-thrown mug with a clean silhouette and matte finish. Perfect for morning coffee or tea.',
    views: [
      {
        name: 'front',
        prompt: 'A minimalist ceramic mug with clean silhouette and matte finish, front view, professional product photography, white background, highly detailed'
      },
      {
        name: 'angle',
        prompt: 'A minimalist ceramic mug with clean silhouette and matte finish, 3/4 angle view, professional product photography, white background, highly detailed'
      },
      {
        name: 'top',
        prompt: 'A minimalist ceramic mug with clean silhouette and matte finish, top-down view, professional product photography, white background, highly detailed' 
      },
      {
        name: 'handle',
        prompt: 'A minimalist ceramic mug with clean silhouette and matte finish, close-up of handle, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'A minimalist ceramic mug with clean silhouette and matte finish on a wooden table with coffee inside, lifestyle photography, soft natural lighting'
      }
    ]
  },
  {
    id: 'p2',
    title: 'Speckled Bowl Set',
    description: 'Set of three nesting bowls with speckled glaze. Each bowl is slightly different.',
    views: [
      {
        name: 'set',
        prompt: 'Set of three nesting ceramic bowls with speckled glaze displayed together, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'single',
        prompt: 'Single ceramic bowl with speckled glaze, medium size, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'angle',
        prompt: 'Set of three nesting ceramic bowls with speckled glaze, 3/4 angle view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'stacked',
        prompt: 'Set of three nesting ceramic bowls with speckled glaze stacked inside each other, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Speckled ceramic bowl holding salad or food, lifestyle photography, rustic table setting, soft natural lighting'
      }
    ]
  },
  {
    id: 'p3',
    title: 'Ceramic Planter',
    description: 'Modern ceramic planter with drainage hole and saucer. The perfect home for your favorite plant.',
    views: [
      {
        name: 'front',
        prompt: 'Modern ceramic planter with drainage hole and saucer, holding a small plant, front view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'empty',
        prompt: 'Empty modern ceramic planter with drainage hole and saucer, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'angle',
        prompt: 'Modern ceramic planter with drainage hole and saucer, holding a small plant, 3/4 angle view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'top',
        prompt: 'Top-down view of modern ceramic planter with small plant, showing soil and plant arrangement, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Modern ceramic planter with small plant on windowsill with natural lighting, lifestyle photography, home interior setting'
      }
    ]
  },
  {
    id: 'p4',
    title: 'Textured Vase',
    description: 'Handcrafted vase with organic texture inspired by natural landscapes. Each piece has unique variations in the glazing process.',
    views: [
      {
        name: 'front',
        prompt: 'Handcrafted ceramic vase with organic texture inspired by natural landscapes, front view, unique glaze variations, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'angle',
        prompt: 'Handcrafted ceramic vase with organic texture inspired by natural landscapes, 3/4 angle view, unique glaze variations, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'detail',
        prompt: 'Close-up of organic texture on handcrafted ceramic vase, showing glazing variations and detail, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'top',
        prompt: 'Top-down view of handcrafted ceramic vase with organic texture, showing opening and rim detail, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Handcrafted ceramic vase with organic texture displayed on wooden shelf with dried flowers, lifestyle photography, interior setting with soft natural lighting'
      }
    ]
  },
  {
    id: 'p5',
    title: 'Serving Platter',
    description: 'Large oval serving platter with raised edges. Perfect for entertaining or as a statement piece.',
    views: [
      {
        name: 'top',
        prompt: 'Large oval ceramic serving platter with raised edges, top-down view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'angle',
        prompt: 'Large oval ceramic serving platter with raised edges, 3/4 angle view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'side',
        prompt: 'Side profile view of large oval ceramic serving platter with raised edges, showing height and edge detail, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of ceramic texture and glaze on large oval serving platter, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Large oval ceramic serving platter with food arrangement on dining table, lifestyle photography, entertaining setting, soft natural lighting'
      }
    ]
  },
  {
    id: 'p6',
    title: 'Ceramic Wall Tiles',
    description: 'Set of 4 decorative wall tiles with relief patterns. Can be arranged in various configurations.',
    views: [
      {
        name: 'grid',
        prompt: 'Set of 4 decorative ceramic wall tiles with relief patterns, arranged in a square formation, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'single',
        prompt: 'Single decorative ceramic wall tile with relief pattern, front view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'row',
        prompt: 'Set of 4 decorative ceramic wall tiles with relief patterns, arranged in a horizontal row, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of relief pattern on decorative ceramic wall tile, showing texture and glaze, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Decorative ceramic wall tiles with relief patterns installed on interior wall, lifestyle photography, home interior setting with ambient lighting'
      }
    ]
  },
  {
    id: 'p7',
    title: 'Ceramic Pour-Over Coffee Set',
    description: 'Hand-thrown ceramic pour-over coffee dripper with matching mug.',
    views: [
      {
        name: 'set',
        prompt: 'Hand-thrown ceramic pour-over coffee dripper with matching mug, full set view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'dripper',
        prompt: 'Hand-thrown ceramic pour-over coffee dripper only, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'mug',
        prompt: 'Hand-thrown ceramic mug from pour-over coffee set, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'angle',
        prompt: 'Hand-thrown ceramic pour-over coffee dripper with matching mug, 3/4 angle view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Hand-thrown ceramic pour-over coffee dripper with matching mug in use brewing coffee, lifestyle photography, kitchen setting with morning light'
      }
    ]
  },
  {
    id: 'p8',
    title: 'Colorful Dessert Plates',
    description: 'Set of 4 hand-painted dessert plates in vibrant colors.',
    views: [
      {
        name: 'set',
        prompt: 'Set of 4 hand-painted ceramic dessert plates in vibrant colors arranged together, each with unique patterns, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'single',
        prompt: 'Single hand-painted ceramic dessert plate in vibrant color with unique pattern, top view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'stack',
        prompt: 'Stack of hand-painted ceramic dessert plates in vibrant colors, side view showing profiles, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of hand-painted pattern on vibrant ceramic dessert plate, showing brush strokes and glaze, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Hand-painted ceramic dessert plates in vibrant colors with desserts served on them, lifestyle photography, dining table setting with soft lighting'
      }
    ]
  },
  {
    id: 'p9',
    title: 'Ceramic Jewelry Dish',
    description: 'Small hand-pinched dish perfect for holding rings, earrings, and small treasures.',
    views: [
      {
        name: 'top',
        prompt: 'Small hand-pinched ceramic jewelry dish with vibrant turquoise glaze and gold accents, top-down view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'angle',
        prompt: 'Small hand-pinched ceramic jewelry dish with vibrant turquoise glaze and gold accents, 3/4 angle view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'side',
        prompt: 'Small hand-pinched ceramic jewelry dish with vibrant turquoise glaze and gold accents, side profile view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of gold accents and turquoise glaze on hand-pinched ceramic jewelry dish, showing texture and finish, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Small hand-pinched ceramic jewelry dish with vibrant turquoise glaze and gold accents holding rings and earrings on dresser, lifestyle photography, bedroom setting with soft lighting'
      }
    ]
  },
  {
    id: 'p10',
    title: 'Ceramic Wind Chimes',
    description: 'Handcrafted ceramic wind chimes that create a gentle, soothing sound.',
    views: [
      {
        name: 'full',
        prompt: 'Handcrafted ceramic wind chimes with individually shaped pieces in complementary glazed colors, full view, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'hanging',
        prompt: 'Handcrafted ceramic wind chimes hanging, showing full length and arrangement of pieces, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'pieces',
        prompt: 'Close-up of individually shaped ceramic pieces of wind chimes in complementary glazed colors, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'detail',
        prompt: 'Detailed view of connection method and top assembly of handcrafted ceramic wind chimes, artisan pottery, professional product photography, white background, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Handcrafted ceramic wind chimes hanging on porch or garden area, lifestyle photography, outdoor setting with natural lighting and slight motion blur suggesting movement'
      }
    ]
  },
  
  // NEW PRODUCTS
  {
    id: 'p11',
    title: 'Stoneware Teapot',
    description: 'Elegant stoneware teapot with bamboo handle and built-in strainer.',
    views: [
      {
        name: 'full',
        prompt: 'Elegant stoneware teapot with bamboo handle, celadon green glaze, front view on white background, product photography, highly detailed'
      },
      {
        name: 'side',
        prompt: 'Elegant stoneware teapot with bamboo handle, celadon green glaze, side view showing spout profile, on white background, product photography, highly detailed'
      },
      {
        name: 'top',
        prompt: 'Elegant stoneware teapot with bamboo handle, celadon green glaze, top view with lid removed showing built-in strainer, on white background, product photography, highly detailed'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of spout and bamboo handle on celadon green glazed stoneware teapot, on white background, product photography, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Elegant celadon green stoneware teapot being used to pour tea into a matching cup, steam rising, warm lighting, lifestyle photography in cozy setting'
      }
    ]
  },
  {
    id: 'p12',
    title: 'Ceramic Soap Dish',
    description: 'Hand-built ceramic soap dish with drainage ridges to keep your soap dry.',
    views: [
      {
        name: 'full',
        prompt: 'Hand-built ceramic soap dish with drainage ridges, soft matte glaze with subtle speckles, top-down view, on white background, product photography, highly detailed'
      },
      {
        name: 'angle',
        prompt: 'Hand-built ceramic soap dish with drainage ridges, soft matte glaze with subtle speckles, 3/4 angle view, on white background, product photography, highly detailed'
      },
      {
        name: 'top',
        prompt: 'Close-up top view of hand-built ceramic soap dish showing drainage ridge pattern, soft matte glaze with subtle speckles, on white background, product photography, highly detailed'
      },
      {
        name: 'with-soap',
        prompt: 'Hand-built ceramic soap dish with a bar of handmade soap resting on it, soft matte glaze with subtle speckles, on white background, product photography, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Hand-built ceramic soap dish with soap bar in bathroom setting on marble counter next to sink, soft natural lighting, lifestyle photography'
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
        prompt: 'Intricately carved white ceramic lantern with geometric patterns, unlit, full view, on white background, product photography, highly detailed'
      },
      {
        name: 'lit',
        prompt: 'Intricately carved white ceramic lantern with soft light glowing from within, highlighting the geometric patterns, on dark background, product photography, highly detailed'
      },
      {
        name: 'detail',
        prompt: 'Close-up detail of intricate geometric carving pattern on white ceramic lantern surface, showing craftsmanship, on white background, product photography, highly detailed'
      },
      {
        name: 'top',
        prompt: 'Top view of intricately carved white ceramic lantern with lid removed showing candle holder area inside, on white background, product photography, highly detailed'
      },
      {
        name: 'lifestyle',
        prompt: 'Intricately carved ceramic lantern glowing in evening setting, casting beautiful geometric shadow patterns on nearby wall and surfaces, warm ambient lighting, lifestyle photography'
      }
    ]
  }
];

async function generateImages() {
  console.log('Starting image generation with Replicate API...');
  
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

  // Process all products
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`Generating images for ${product.title}...`);
    
    // Process each view concurrently (parallel processing)
    const viewPromises = product.views.map(async (view, viewIndex) => {
      try {
        console.log(`Generating ${view.name} view for ${product.title}...`);
        
        const input = {
          prompt: view.prompt,
          prompt_upsampling: true,
        };

        const outputUrl = await replicate.run("black-forest-labs/flux-1.1-pro", { input });
        
        if (outputUrl) {
          console.log(`${view.name} view generated for ${product.title}: ${outputUrl}`);
          
          // Fetch the image data and save locally
          const response = await fetch(outputUrl);
          const buffer = await response.arrayBuffer();
          
          // Save with index in the filename (e.g., p1_1.jpg, p1_2.jpg)
          const imagePath = path.join(imagesDir, `${product.id}_${viewIndex + 1}.jpg`);
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
  
  console.log('Image generation complete!');
}

generateImages().catch(console.error);
