import { useEffect, useState } from "react";
import { databases } from "../src/appwrite.js";

import CreateDish from "./createDish.jsx";

const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;
const DATABASE_ID = import.meta.env.VITE_DATABASE_ID;

function App() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID
        );
        setData(response.documents);
        console.log(response.documents);
      } catch (error) {
        console.log(error("Error fetching data", error));
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-4 justify-center items-center w-full bg-gray-400">
      <h1 className="text-2xl md:text-3xl font-bold text-center">AI Gordan Ramsey Roast</h1>

      <CreateDish />
      <div>
        <h2 className="text-xl  font-bold text-center">
          Check Out these Hilarious Roasts! 🔥🍽️
        </h2>
        <div className="bg-gray-300 p-4 m-4 rounded-md">
          <ul>
            {data.map((doc) => (
              <li
                key={doc.$id}
                className="block sm:flex justify-center items-center "
              >
                {" "}
                {doc.name} {doc.category}
                <img
                  src={doc.imageUrl}
                  alt=""
                  className="w-72 h-72 object-cover rounded-lg shadow-md mx-auto m-4"
                />
                <p className="max-w-200 p-4">{doc.aiResponse}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
