import { MongoClient, Db } from "mongodb";
import dns from "dns";
import { promises as fs } from "fs";
import path from "path";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

function applyDnsFallback() {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    dns.setDefaultResultOrder("ipv4first");
    console.log("Applied DNS custom servers fallback for MongoDB SRV resolution.");
  } catch (e) {
    console.warn("Failed to set custom DNS servers:", e);
  }
}

async function connectWithLogs(clientInstance: MongoClient) {
  try {
    return await clientInstance.connect();
  } catch (err: any) {
    console.error("Initial MongoDB connection failed. Trying DNS fallback...", err);
    applyDnsFallback();
    try {
      return await clientInstance.connect();
    } catch (retryErr) {
      console.error("MongoDB DNS fallback connection also failed:", retryErr);
      throw err;
    }
  }
}

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = connectWithLogs(client);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = connectWithLogs(client);
}

export default clientPromise;

let didSeed = false;

export async function getDb(): Promise<Db> {
  const connection = await clientPromise;
  const db = connection.db();

  // Run the seeding logic once if database check passes
  if (!didSeed) {
    didSeed = true;
    try {
      const userCount = await db.collection("users").countDocuments();
      if (userCount === 0) {
        console.log("MongoDB is empty. Seeding default synthetic data from demo-store.json...");
        const jsonPath = path.join(process.cwd(), "data", "demo-store.json");
        const raw = await fs.readFile(jsonPath, "utf8");
        const storeData = JSON.parse(raw);

        // Seeding users (inject standard password)
        const seedUsers = (storeData.users || []).map((u: any) => ({
          ...u,
          password: u.password || "demo123"
        }));
        if (seedUsers.length > 0) {
          await db.collection("users").insertMany(seedUsers);
        }

        // Seeding applications (with embedded statusHistory)
        const seedApplications = (storeData.applications || []).map((app: any) => {
          const history = (storeData.statusHistory || []).filter(
            (h: any) => h.applicationId === app.id
          );
          return {
            ...app,
            statusHistory: history
          };
        });
        if (seedApplications.length > 0) {
          await db.collection("applications").insertMany(seedApplications);
        }

        // Seeding documents (with embedded checks)
        const seedDocuments = (storeData.documents || []).map((doc: any) => {
          const checks = (storeData.documentChecks || []).filter(
            (c: any) => c.documentId === doc.id
          );
          return {
            ...doc,
            checks
          };
        });
        if (seedDocuments.length > 0) {
          await db.collection("documents").insertMany(seedDocuments);
        }

        // Seeding payments
        if (storeData.payments && storeData.payments.length > 0) {
          await db.collection("payments").insertMany(storeData.payments);
        }

        // Seeding appointments
        if (storeData.appointments && storeData.appointments.length > 0) {
          await db.collection("appointments").insertMany(storeData.appointments);
        }

        console.log("MongoDB successfully initialized with synthetic demo data.");
      }
    } catch (seedErr) {
      console.error("Failed to check or seed MongoDB data:", seedErr);
    }
  }

  return db;
}
