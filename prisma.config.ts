import { type PrismaConfig } from "prisma/config";

export default {
  datasource: {
    // @ts-expect-error process exists
    url: process.env.DATABASE_URL,
  },
} satisfies PrismaConfig;
