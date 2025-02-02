import type { Pass } from "@prisma/client";

export type PassRow = Omit<Pass, "PassID" | "CreatedAt">;
