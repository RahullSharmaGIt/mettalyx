import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@metallyx.com" },
    update: {},
    create: {
      email: "admin@metallyx.com",
      password: adminPassword,
      name: "Admin User",
      role: UserRole.ADMIN,
    },
  });

  console.log("✅ Admin user created:");
  console.log("   Email: admin@metallyx.com");
  console.log("   Password: admin123");
  console.log("");
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
