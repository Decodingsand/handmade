require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const Replicate = require('replicate');
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generatePortrait(name, outputPath) {
  console.log(`Generating portrait for ${name}...`);
  
  const modelPrompt = `Photo portrait of ${name}, professional headshot, ceramic artist customer, neutral background, natural lighting, mid 30s, warm expression.`;
  
  const input = {
    prompt: modelPrompt,
    prompt_upsampling: true,
    width: 768,
    height: 768,
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
        console.log(`Portrait saved to ${outputPath}`);
        resolve(outputPath);
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error generating portrait for ${name}:`, error);
    throw error;
  }
}

async function main() {
  // Ensure we have the API token
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('REPLICATE_API_TOKEN is not set in the .env file');
    process.exit(1);
  }
  
  // Generate buyer portraits
  try {
    await generatePortrait('Alex Taylor', './public/buyers/alex_taylor.jpg');
    await generatePortrait('Jamie Wong', './public/buyers/jamie_wong.jpg');
    console.log('All portraits generated successfully!');
  } catch (error) {
    console.error('Failed to generate portraits:', error);
    process.exit(1);
  }
}

main();
