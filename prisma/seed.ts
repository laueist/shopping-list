import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "l@uei.st";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("remixruns", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const sections = [
    {
      name: "Baking ingredients",
    },
    {
      name: "Dairy products",
    },
    {
      name: "Frozen food",
    },
    {
      name: "Fruit and vegetables",
    },
  ];

  for (const section of sections) {
    await prisma.section.upsert({
      where: { name: section.name },
      update: section,
      create: section,
    });
  }

  const shoppingListItems = [
    {
      name: "Cheese",
      need_to_buy: true,
    },
    {
      name: "Milk",
      need_to_buy: true,
    },
    {
      name: "French fries",
      need_to_buy: true,
    },
    {
      name: "Bananas",
      need_to_buy: true,
    },
  ];

  for (const shoppingListItem of shoppingListItems) {
    await prisma.shoppingListItem.upsert({
      where: { name: shoppingListItem.name },
      update: shoppingListItem,
      create: shoppingListItem,
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
