import type { TollStation } from "@prisma/client";


export type TollStationRow = Omit<TollStation, "CreatedAt" | "UpdatedAt">;