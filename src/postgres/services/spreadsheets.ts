import knex from '../knex.js';

export async function getSheetIds(): Promise<string[] | undefined> {
    try {
        const rows = await knex('spreadsheets')
            .select('*');

        return rows.map(r => r.spreadsheet_id);
    } catch (e) {
        console.error('Getting spreadsheet_ids from db error: ', e);
        return undefined;
    }
}
