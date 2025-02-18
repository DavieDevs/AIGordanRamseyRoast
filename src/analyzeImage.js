const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const API_KEY =
  "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";

async function analyzeImage(imagePath) {
  const formData = new FormData();
  formData.append("model", "gpt-4-vision-preview"); // Use GPT-4 with Vision
  formData.append(
    "messages",
    JSON.stringify([{ role: "user", content: "Describe this image." }])
  );
  formData.append("file", fs.createReadStream(imagePath));

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log("AI Response:", response.data.choices[0].message.content);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

// Call function with an image file
analyzeImage("dish.jpg"); // Replace with your image path
