import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const productsData = [
  { name: 'Pro Book X1', category: 'Laptop', price: 899.99, inStock: true, description: 'High performance business laptop.' },
  { name: 'Apex Elite 15', category: 'Gaming Laptop', price: 1499.99, inStock: true, description: 'RTX graphics card with 144Hz screen.' },
  { name: 'MacBook Air M3', category: 'MacBook', price: 1099.00, inStock: true, description: 'Apple M3 chip, thin and light design.' },
  { name: 'Clicky Pro RGB', category: 'Mechanical Keyboard', price: 129.99, inStock: true, description: 'Hot-swappable mechanical switches.' },
  { name: 'Precision Glide X', category: 'Mouse', price: 79.99, inStock: true, description: 'Wireless ergonomic productivity mouse.' },
  { name: 'UltraWide 34"', category: 'Monitor', price: 449.99, inStock: false, description: 'Curved 34-inch display for multitasking.' },
  { name: 'Tab S Pro', category: 'Tablet', price: 649.99, inStock: true, description: '12-inch AMOLED display with stylus included.' },
  { name: 'Phonex Ultra 5G', category: 'Phone', price: 999.99, inStock: true, description: 'Flagship smartphone with 200MP camera.' },
  { name: 'ErgoFit Pro', category: 'Chair', price: 349.99, inStock: true, description: 'High-back ergonomic chair with lumbar support.' },
  { name: 'LiftMaster Electric', category: 'Desk', price: 499.99, inStock: true, description: 'Dual-motor motorized standing desk.' },
];



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

  console.log("🔄 Cleaning up existing products...");
  await prisma.product.deleteMany({});

  console.log("📦 Seeding products...");
  for (const product of productsData) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("🎉 Seeding completed!");


  // console.log("✅ Admin user created:");
  // console.log("   Email: admin@metallyx.com");
  // console.log("   Password: admin123");
  // console.log("");
  // console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  