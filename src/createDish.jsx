import { useState } from "react";
import { databases } from "../src/appwrite.js";
import { storage } from "../src/appwrite";
import axios from "axios";

const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;
const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;
const BUCKET_ID = import.meta.env.VITE_BUCKET_ID;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

console.log("COLLECTION_ID:", import.meta.env.VITE_COLLECTION_ID);
console.log("DATABASE_ID:", import.meta.env.VITE_DATABASE_ID);
console.log("BUCKET_ID:", import.meta.env.VITE_BUCKET_ID);
console.log("OPENAI_API_KEY:", import.meta.env.VITE_OPENAI_API_KEY);

const CreateDish = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        "unique()",
        { name, category, imageUrl, aiResponse }
      );

      console.log("Document Created:", response);
      setName("");
      setCategory("");
      setImageUrl("");
      setAiResponse("");
      alert("Document created successfully!");
    } catch (err) {
      console.error("Error creating document", err);
      setError("Failed to create document.");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setAiResponse("");

    try {
      // Upload file to Appwrite Storage
      const fileResponse = await storage.createFile(
        BUCKET_ID,
        "unique()",
        file
      );

      // Get public file URL
      const fileUrl = storage.getFilePreview(BUCKET_ID, fileResponse.$id);
      setImageUrl(fileUrl);

      console.log("Image uploaded successfully:", fileUrl);

      // 🔥 Send image to OpenAI Vision API
      await analyzeImageWithAI(fileUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      setError("Failed to upload image.");
    }

    setLoading(false);
  };

  const analyzeImageWithAI = async (fileUrl) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions", // ✅ Correct Endpoint
        {
          model: "gpt-4o", // ✅ Update to latest model
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Roast this food like Gordon Ramsay would.",
                },
                { type: "image_url", image_url: { url: fileUrl } }, // ✅ Correct Image Input Format
              ],
            },
          ],
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiText = response.data.choices[0].message.content;
      setAiResponse(aiText);
      console.log("AI Response:", aiText);
    } catch (error) {
      console.error("AI analysis failed:", error);
      setError("Failed to analyze image.");
    }
  };

  return (
    <div className="m-4 p-6 w-full max-w-3xl mx-auto bg-gray-300">
      <h2 className="text-xl  font-bold text-center">Create a New Dish</h2>
      <p className=" text-center ">
        Upload a photo of your dish, and let AI Gordon Ramsay unleash a fiery
        roast on your cooking skills. Brace yourself for some brutally honest
        (and hilarious) feedback! 🔥🍽️
      </p>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} className="p-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="w-72 h-72 object-cover rounded-lg shadow-md mx-auto m-4"
          />
        )}

        <label className="flex justify-center max-w-sm items-center m-auto cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        <div className="bg-gray-300 p-4 m-4 rounded-md">
          {aiResponse && (
            <div className="m-4 p-4 ">
              <h2>🔥 Gordon Ramsay Says: 🔥</h2>
              <p>{aiResponse}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center max-w-sm items-center m-auto cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            {loading ? "Generating Response..." : "Save Response"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDish;
