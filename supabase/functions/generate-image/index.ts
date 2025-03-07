import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { prompt, model } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`Generating image with prompt: "${prompt}" using model: ${model}`);
    
    let imageUrl;
    
    // Choose the appropriate AI service based on the selected model
    if (model === 'GetImg.ai') {
      // Generate image using GetImg.ai
      console.log('Using GetImg.ai API for image generation');
      const apiKey = Deno.env.get('GETIMG_API_KEY');
      
      if (!apiKey) {
        console.error('GETIMG_API_KEY not found in environment variables');
        throw new Error('GetImg.ai API key not configured');
      }
      
      try {
        console.log('Making request to GetImg.ai API...');
        // Updated API endpoint based on latest GetImg.ai documentation
        const getimgResponse = await fetch('https://api.getimg.ai/v1/generation/text-to-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            prompt: prompt,
            negative_prompt: "ugly, deformed, disfigured, poor quality, low quality",
            width: 512,
            height: 768,
            steps: 30,
            guidance: 7.5,
            model_name: "realistic-vision-v5.1",
            scheduler: "dpmsolver++",
          })
        });
        
        if (!getimgResponse.ok) {
          const errorText = await getimgResponse.text();
          console.error(`GetImg.ai API error: Status ${getimgResponse.status}`);
          console.error('Error response:', errorText);
          throw new Error(`GetImg.ai API error: ${getimgResponse.status} ${errorText}`);
        }
        
        const getimgData = await getimgResponse.json();
        console.log('GetImg.ai API response received successfully');
        console.log('GetImg.ai API response structure:', JSON.stringify(getimgData, null, 2));
        
        // Updated response handling for new API structure
        if (!getimgData.output_url) {
          console.error('Invalid response format from GetImg.ai:', getimgData);
          throw new Error('Invalid response format from GetImg.ai');
        }
        
        imageUrl = getimgData.output_url;
        console.log('GetImg.ai generated image URL:', imageUrl);
      } catch (error) {
        console.error('GetImg.ai processing error:', error);
        throw new Error(`GetImg.ai processing error: ${error.message}`);
      }
    } else {
      // Default to DALL-E 3
      console.log('Using DALL-E 3 API for image generation');
      const apiKey = Deno.env.get('OPENAI_API_KEY');
      
      if (!apiKey) {
        console.error('OPENAI_API_KEY not found in environment variables');
        throw new Error('OpenAI API key not configured');
      }
      
      try {
        console.log('Making request to OpenAI API...');
        const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url"
          })
        });
        
        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          console.error(`OpenAI API error: Status ${openaiResponse.status}`);
          console.error('Error response:', errorText);
          throw new Error(`OpenAI API error: ${openaiResponse.status} ${errorText}`);
        }
        
        const openaiData = await openaiResponse.json();
        console.log('OpenAI API response received successfully');
        
        if (!openaiData.data || !openaiData.data[0] || !openaiData.data[0].url) {
          console.error('Invalid response format from OpenAI:', openaiData);
          throw new Error('Invalid response format from OpenAI');
        }
        
        imageUrl = openaiData.data[0].url;
        console.log('DALL-E 3 generated image URL:', imageUrl);
      } catch (error) {
        console.error('OpenAI processing error:', error);
        throw new Error(`OpenAI processing error: ${error.message}`);
      }
    }
    
    // Validate the generated URL
    try {
      new URL(imageUrl);
    } catch (error) {
      console.error('Invalid image URL generated:', imageUrl);
      throw new Error('Generated image URL is invalid');
    }
    
    // Return the image URL to the client
    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Image generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: `Failed to generate image: ${error.message}`,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
