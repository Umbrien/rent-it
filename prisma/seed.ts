import { PrismaClient } from "@prisma/client";
import * as console from "console";
const prisma = new PrismaClient();
async function main() {
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
    },
  });

  await prisma.smartLock.upsert({
    where: { imei: "104277641444418" },
    update: {},
    create: {
      imei: "104277641444418",
      warehouse: {
        connect: {
          id: garage.id,
        },
      },
    },
  });

  await prisma.smartLock.upsert({
    where: { imei: "448698377955746" },
    update: {},
    create: {
      imei: "448698377955746",
      warehouse: {
        connect: {
          id: postalOffice.id,
        },
      },
    },
  });

  const garageUser = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: "alice@example.com",
      password: "$2a$10$",
    },
  });

  const postalOfficeUser = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      email: "bob@example.com",
      password: "$3a$20$",
    },
  });

  await prisma.rental.upsert({
    where: { id: 1 },
    update: {},
    create: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
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
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
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
    where: { id: 3 },
    update: {},
    create: {
      email: "root@example.com",
      password: "toor",
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
