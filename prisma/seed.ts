import { PrismaClient } from "@prisma/client";
import * as console from "console";
const prisma = new PrismaClient();
/**
 * The function is responsible for creating Users, Warehouses and Rental data for initial seeding.
 *
 * It creates five users: Kostyantyn, Volodymyr, Alice, Bob, and an Admin user.
 *
 * - Alice rents the Garage from Kostyantyn for 7 days
 * - Bob rents the Postal Office from Volodymyr for 10 days.
 *
 * After these transactions, function creates another three warehouses, ready to be rented out.
 * - "Big food storage" owned by Alice,
 * - "Medical center storage" owned by Bob,
 * - "Amazon storage" owned by the Admin.
 */
async function main() {
  const [kostyantyn, volodymyr, alice, bob, admin] = await Promise.all([
    prisma.user.upsert({
      where: { username: "kostyantyn" },
      update: {},
      create: {
        username: "kostyantyn",
        email: "kostyantyn@example.com",
        password: "kostyantynpassword",
        balance: 1000,
      },
    }),
    prisma.user.upsert({
      where: { username: "volodymyr" },
      update: {},
      create: {
        username: "volodymyr",
        email: "volodymyr@example.com",
        password: "volodymyrpassword",
        balance: 10_000,
      },
    }),
    prisma.user.upsert({
      where: { username: "alice" },
      update: {},
      create: {
        username: "alice",
        email: "alice@example.com",
        password: "alicepassword",
        balance: 200,
      },
    }),
    prisma.user.upsert({
      where: { username: "bob" },
      update: {},
      create: {
        username: "bob",
        email: "bob@example.com",
        password: "bobpassword",
        balance: 1000,
      },
    }),
    prisma.user.upsert({
      where: { username: "root" },
      update: {},
      create: {
        username: "root",
        email: "root@example.com",
        password: "toortoor",
        role: "ADMIN",
        balance: 100_000,
      },
    }),
  ]);

  const [garage, postalOffice] = await Promise.all([
    await prisma.warehouse.upsert({
      where: { id: "clkogrf0u000008mfausr8zfn" },
      update: {},
      create: {
        nameUk: "Гараж",
        nameEn: "Garage",
        addressUk: "Кастетопольська, 9",
        dailyRate: 150,
        status: "RENTED", // will be rented during the seed
        warehouseType: {
          create: {
            nameUk: "Гараж",
            nameEn: "Garage",
          },
        },
        owner: {
          connect: kostyantyn,
        },
        smartLock: {
          create: {
            imei: "104277641444418",
          },
        },
      },
    }),
    prisma.warehouse.upsert({
      where: { id: "clkogrf0u000108mf5q1q1z3a" },
      update: {},
      create: {
        nameUk: "Поштове відділення",
        nameEn: "Postal office",
        addressUk: "Новопоштова, 15",
        dailyRate: 250,
        status: "RENTED", // will be rented during the seed
        warehouseType: {
          create: {
            nameUk: "Розподільний центр",
            nameEn: "Distribution Center",
          },
        },
        owner: {
          connect: volodymyr,
        },
        smartLock: {
          create: {
            imei: "448698377955746",
          },
        },
      },
    }),
  ]);

  await Promise.all([
    prisma.rental.upsert({
      where: { id: 1 },
      update: {},
      create: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        dailyRate: garage.dailyRate,
        balance: garage.dailyRate * 7,
        user: {
          connect: {
            id: alice.id,
          },
        },
        warehouse: {
          connect: {
            id: garage.id,
          },
        },
      },
    }),
    prisma.rental.upsert({
      where: { id: 2 },
      update: {},
      create: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        dailyRate: postalOffice.dailyRate,
        balance: postalOffice.dailyRate * 10,
        user: {
          connect: {
            id: bob.id,
          },
        },
        warehouse: {
          connect: {
            id: postalOffice.id,
          },
        },
      },
    }),
  ]);

  // available warehouses for rent
  await Promise.all([
    prisma.warehouse.upsert({
      where: { id: "clkzkm0jc000008mnao2u3r9d" },
      update: {},
      create: {
        nameUk: "Велике харчове сховище",
        nameEn: "Big food storage",
        addressUk: "Київська, 8",
        dailyRate: 500,
        status: "AVAILABLE",
        warehouseType: {
          create: {
            nameUk: "Харчове сховище",
            nameEn: "Food storage",
          },
        },
        owner: {
          connect: alice,
        },
        smartLock: {
          create: {
            imei: "544997454989997",
          },
        },
      },
    }),
    prisma.warehouse.upsert({
      where: { id: "clkzkmb1n000108mndim77h0e" },
      update: {},
      create: {
        nameUk: "Сховище медичного центру",
        nameEn: "Medical center storage",
        addressUk: "Центральна, 1",
        dailyRate: 200,
        status: "AVAILABLE",
        warehouseType: {
          create: {
            nameUk: "Медичне сховище",
            nameEn: "Medical storage",
          },
        },
        owner: {
          connect: bob,
        },
        smartLock: {
          create: {
            imei: "515015773201930",
          },
        },
      },
    }),
    prisma.warehouse.upsert({
      where: { id: "clkzkmim6000208mnbmvi50aw" },
      update: {},
      create: {
        nameUk: "Сховище Amazon",
        nameEn: "Amazon storage",
        addressUk: "Чарівна, 3",
        dailyRate: 3000,
        status: "AVAILABLE",
        warehouseType: {
          create: {
            nameUk: "Смарт-сховище",
            nameEn: "Smart warehouse",
          },
        },
        owner: {
          connect: admin,
        },
        smartLock: {
          create: {
            imei: "455814076295777",
          },
        },
      },
    }),
  ]);

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
