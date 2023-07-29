import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";

interface HandlerRequest extends NextApiRequest {
  query: {
    imei: string;
  };
}

const handler = async (req: HandlerRequest, res: NextApiResponse) => {
  const { imei } = req.query;
  const warehouse = await prisma.smartLock
    .findUnique({
      where: {
        imei,
      },
    })
    .warehouse();

  const currentDate = new Date();

  let currentRental;
  if (warehouse) {
    currentRental = await prisma.rental.findFirst({
      where: {
        warehouseId: warehouse.id,
        startDate: {
          lte: currentDate,
        },
        endDate: {
          gte: currentDate,
        },
      },
      include: {
        user: true,
      },
    });
  }

  res.json({ warehouse, currentRental });
};

export default handler;
