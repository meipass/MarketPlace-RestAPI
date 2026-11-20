import { db } from "#app/db/db";

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
