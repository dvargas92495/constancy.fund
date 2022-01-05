import { PrismaClient } from "@prisma/client";
console.log('load prisma', new Date())
const prismaClient = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL || "" },
  },
});
console.log('loaded prisma', new Date())
export default prismaClient;
