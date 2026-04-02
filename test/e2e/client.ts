import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
export default new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
