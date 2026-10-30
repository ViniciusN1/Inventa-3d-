import { MongoClient } from "mongodb";

/**
 * Conexão com o MongoDB.
 * Se MONGODB_URI não estiver definida (ex.: durante o `npm run build` sem .env),
 * a promise é rejeitada de forma controlada: as rotas tratam o erro e o build não quebra.
 */
const uri = process.env.MONGODB_URI;

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  if (!uri) {
    const missing = Promise.reject(
      new Error("MONGODB_URI não configurada. Copie .env.example para .env.local e preencha.")
    );
    // evita "unhandled rejection" quando ninguém usa o banco (ex.: build)
    missing.catch(() => {});
    return missing;
  }

  return new MongoClient(uri, options).connect();
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = createClientPromise();
}

export default clientPromise;

/** Nome do banco no MongoDB. Defina MONGODB_DB nas variáveis de ambiente. */
export const DB_NAME = process.env.MONGODB_DB || "inventta3d";
