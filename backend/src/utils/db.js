import mongoose from "mongoose";

const buildMongoUri = () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  // Atlas SRV can be converted to a direct connection for this local setup.
  // Set MONGO_DIRECT_HOST to the Atlas node that is reachable from your network.
  // This avoids SRV discovery timing out on unreachable nodes.
  const directHost = process.env.MONGO_DIRECT_HOST;

  if (directHost && uri.startsWith("mongodb+srv://")) {
    const parsed = new URL(uri);
    parsed.protocol = "mongodb:";
    parsed.hostname = directHost;
    parsed.port = "27017";
    parsed.searchParams.set("tls", "true");
    parsed.searchParams.set("directConnection", "true");
    parsed.searchParams.delete("appName");
    return parsed.toString();
  }

  return uri;
};

const connectDB = async () => {
  const mongoUri = buildMongoUri();

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 20000,
    connectTimeoutMS: 15000,
    family: 4,
  });

  console.log("MongoDB connected successfully");
};

export default connectDB;
