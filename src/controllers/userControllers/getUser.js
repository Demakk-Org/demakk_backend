import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const MONGODB_ULI = dotenv.config(process.cwd, ".env").parsed.MONGODB_URI;
const client = new MongoClient(MONGODB_ULI);

async function getUser(req, res) {
  try {
    await client.connect();
    const database = client.db("demakk");
    const userCollection = database.collection("users");
    const cursor = userCollection.find({ name: "Melka" });

    if ((await userCollection.countDocuments({ name: "Melka" })) === 0) {
      console.log("No documents found!");
      res.status(400).send({ message: "User doesn't exist!" });
    }

    for await (const doc of cursor) {
      console.log(doc);
      res.json({ data: doc });
    }
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

export default getUser;
