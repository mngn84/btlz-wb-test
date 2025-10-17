import { z } from "zod";

const warehouseSchema = z.object({
    boxDeliveryBase: z.string(),
    boxDeliveryCoefExpr: z.string(),
    boxDeliveryLiter: z.string(),
    boxDeliveryMarketplaceBase: z.string(),
    boxDeliveryMarketplaceCoefExpr: z.string(),
    boxDeliveryMarketplaceLiter: z.string(),
    boxStorageBase: z.string(),
    boxStorageCoefExpr: z.string(),
    boxStorageLiter: z.string(),
    geoName: z.string(),
    warehouseName: z.string(),
});

export const tariffsSchema = z.object({
    dtNextBox: z.string(),
    dtTillMax: z.string(),
    warehouseList: z.array(warehouseSchema),
});
