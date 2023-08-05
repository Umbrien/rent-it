import { PrismaClient } from "@prisma/client";
import * as console from "console";
const prisma = new PrismaClient();
async function main() {
  const garageOwner = await prisma.user.upsert({
    where: { username: "kostyantyn" },
    update: {},
    create: {
      username: "kostyantyn",
      email: "kostyantyn@example.com",
      password: "kostyantynpassword",
      balance: 1000,
    },
  });

  const postalOfficeOwner = await prisma.user.upsert({
    where: { username: "volodymyr" },
    update: {},
    create: {
      username: "volodymyr",
      email: "volodymyr@example.com",
      password: "volodymyrpassword",
      balance: 10000,
    },
  });

  const garage = await prisma.warehouse.upsert({
    where: { id: "clkogrf0u000008mfausr8zfn" },
    update: {},
    create: {
      name: "Kastet's Garage",
      address: "Kastetopolska, 9",
      dailyRate: 150,
      warehouseType: {
        create: {
          type: "Garage",
        },
      },
      owner: {
        connect: garageOwner,
      },
      smartLock: {
        create: {
          imei: "104277641444418",
        },
      },
    },
  });

  const postalOffice = await prisma.warehouse.upsert({
    where: { id: "clkogrf0u000108mf5q1q1z3a" },
    update: {},
    create: {
      name: "Postal Office",
      address: "Novoposhtova, 15",
      dailyRate: 250,
      warehouseType: {
        create: {
          type: "Distribution Center",
        },
      },
      owner: {
        connect: postalOfficeOwner,
      },
      smartLock: {
        create: {
          imei: "448698377955746",
        },
      },
    },
  });

  const garageUser = await prisma.user.upsert({
    where: { username: "alice" },
    update: {},
    create: {
      username: "alice",
      email: "alice@example.com",
      password: "alicepassword",
      balance: 200,
    },
  });

  const postalOfficeUser = await prisma.user.upsert({
    where: { username: "bob" },
    update: {},
    create: {
      username: "bob",
      email: "bob@example.com",
      password: "bobpassword",
      balance: 1000,
    },
  });

  await prisma.rental.upsert({
    where: { id: 1 },
    update: {},
    create: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      balance: garage.dailyRate * 7,
      user: {
        connect: {
          id: garageUser.id,
        },
      },
      warehouse: {
        connect: {
          id: garage.id,
        },
      },
    },
  });

  await prisma.rental.upsert({
    where: { id: 2 },
    update: {},
    create: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      balance: postalOffice.dailyRate * 10,
      user: {
        connect: {
          id: postalOfficeUser.id,
        },
      },
      warehouse: {
        connect: {
          id: postalOffice.id,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { username: "root" },
    update: {},
    create: {
      username: "root",
      email: "root@example.com",
      password: "toortoor",
      role: "ADMIN",
    },
  });

  console.log("Seeded 🌱");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
