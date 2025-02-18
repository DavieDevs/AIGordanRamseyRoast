import { Client, Databases, Storage  } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite endpoint
  .setProject("67b2dff50016125fb06d"); // Replace with your Appwrite Project ID

const databases = new Databases(client);
const storage = new Storage(client);

export { client, databases, storage };
