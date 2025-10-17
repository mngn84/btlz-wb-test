import { tariffsSchema } from '#schemas/wb_api_schema.js'
import knex from '../knex.js';
import type { z, SafeParseReturnType } from "zod";
type Tariffs = z.infer<typeof tariffsSchema>;

export async function saveBoxTariffs(data: SafeParseReturnType<unknown, Tariffs>, date: string) {
    if (!data.success) {
        console.error('Invalid data', data.error);
        return;
    }

    const { dtNextBox, dtTillMax, warehouseList } = data.data;

    const parseFloat = (s: string) => {
        if (!s) return null;

        const normalized = String(s).replace(",", ".").replace(/[^\d.-]/g, "");
        const n = Number(normalized);

        return Number.isFinite(n) ? n : null;
    };

    try {
        const rows = warehouseList.map((w: { warehouseName: any; geoName: any; boxDeliveryBase: string; boxDeliveryCoefExpr: string; boxDeliveryLiter: string; boxDeliveryMarketplaceBase: string; boxDeliveryMarketplaceCoefExpr: string; boxDeliveryMarketplaceLiter: string; boxStorageBase: string; boxStorageCoefExpr: string; boxStorageLiter: string; }) => ({
            warehouse_name: w.warehouseName,
            geo_name: w.geoName,
            date: date,
            box_delivery_base: parseFloat(w.boxDeliveryBase),
            box_delivery_coef_expr: parseFloat(w.boxDeliveryCoefExpr),
            box_delivery_liter: parseFloat(w.boxDeliveryLiter),
            box_delivery_marketplace_base: parseFloat(w.boxDeliveryMarketplaceBase),
            box_delivery_marketplace_coef_expr: parseFloat(w.boxDeliveryMarketplaceCoefExpr),
            box_delivery_marketplace_liter: parseFloat(w.boxDeliveryMarketplaceLiter),
            box_storage_base: parseFloat(w.boxStorageBase),
            box_storage_coef_expr: parseFloat(w.boxStorageCoefExpr),
            box_storage_liter: parseFloat(w.boxStorageLiter),
            dt_next_box: dtNextBox || null,
            dt_till_max: dtTillMax || null,
            updated_at: knex.fn.now(),
        }));

        await knex("box_tariffs")
            .insert(rows)
            .onConflict(["warehouse_name", "date"])
            .merge([
                "geo_name",
                "box_delivery_base",
                "box_delivery_coef_expr",
                "box_delivery_liter",
                "box_delivery_marketplace_base",
                "box_delivery_marketplace_coef_expr",
                "box_delivery_marketplace_liter",
                "box_storage_base",
                "box_storage_coef_expr",
                "box_storage_liter",
                "dt_next_box",
                "dt_till_max",
                "updated_at"
            ]);
    } catch (e) {
        console.error('Tariffs saving error: ', e);
    }
}