import { google } from 'googleapis';
import env from '#config/env/env.js';
import { getSheetIds } from '#postgres/services/spreadsheets.js';
import {getBoxTariffsFromDb} from '#postgres/services/box_tariffs.js';

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: env.GOOGLE_CLIENT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const RANGE = 'stocks_coefs';

export async function processAllSheets() {
    const rows = await getBoxTariffsFromDb();
    const ids = (await getSheetIds())?.map(id => id.trim()).filter(Boolean);
    if (!rows || !ids) return;

    for (const id of ids) {
        try {
            await writeToSheet(rows, id);
        } catch (e) {
            console.error('Sheets processing error: ', e)
        }
    }
}

async function writeToSheet(rows: Record<string, string | number | Date>[], spreadsheetId: string) {
    try {
        const headers = [
            'Название склада',
            'Страна (округ)',
            'Логистика, первый литр, ₽',
            'Коэффициент Логистика, %.',
            'Логистика, доп. литр',
            'Логистика FBS, первый литр, ₽',
            'Коэффициент FBS, %',
            'Логистика FBS, доп. литр, ₽',
            'Хранение в день, первый литр, ₽',
            'Коэффициент Хранение, %',
            'Хранение в день, доп. литр, ₽',
            'Начало следующего тарифа',
            'Окончание последнего тарифа'
        ];

        const values = [
            headers,
            ...rows.map((r) => [
                r.warehouse_name,
                r.box_delivery_base,
                r.box_delivery_coef_expr,
                r.box_delivery_liter,
                r.box_delivery_marketplace_base,
                r.box_delivery_marketplace_coef_expr,
                r.box_delivery_marketplace_liter,
                r.box_storage_base,
                r.box_storage_coef_expr,
                r.box_storage_liter,
                (r.dt_next_box as Date)?.toISOString().split('.')[0],
                (r.dt_till_max as Date)?.toISOString().split('.')[0]
            ])
        ];

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: RANGE,
            valueInputOption: 'RAW',
            requestBody: { values },
        });

        console.log(`Data recorded to sheet ${spreadsheetId}`);
    } catch (e) {
        console.error('Data write error: ', e);
    }
}
