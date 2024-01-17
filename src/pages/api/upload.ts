import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';


async function urlToGenerativePart(url: string, mimeType: string) {
  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer'
    });

    console.log(response.data);

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const byteSize = (base64.length * 3) / 4;
    console.log(`Base64 byte size: ${byteSize} bytes`);
    
    return {
      inlineData: {
        data: base64,
        mimeType
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    } else {
      return 'Unknown error occurred'; 
    }
  }
}

export async function getAIOutput(imageurl:string, apikey:string) {
  try {
    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = "You are an AI specialized in OSINT. List all districts, street addresses, postal codes, and landmarks this photo satisfies in a string array in square brackets.";

    // Await the asynchronous function and handle possible null result
    const img = await urlToGenerativePart(imageurl, "image/jpeg");
    if (!img) {
      console.error('Failed to get image data.');
      return null;
    }

    const result = await model.generateContent([prompt, img]);
    const response = await result.response;
    const text = await response.text();

    // Instead of just logging, return the text
    return text;
  } catch (error) {
    if (error instanceof Error) {
      return error.message; // Return the error message as a string
    } else {
      return 'Unknown error occurred'; // Fallback error message
    }
  }
}