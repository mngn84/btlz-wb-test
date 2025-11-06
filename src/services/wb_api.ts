import { tariffsSchema } from '#schemas/wb_api_schema.js'
import env from '#config/env/env.js';

export async function getBoxTariffs() {
    const today = new Date().toISOString().split("T")[0]

    try {
        const url = `https://common-api.wildberries.ru/api/v1/tariffs/box?date=${today}`;
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': env.WB_TOKEN,
            }
        }
        )
        if (!res.ok) {
            console.error(`WB API error: ${res.status} ${res.statusText}`);
            return;
        }

        const json = await res.json();
        const data = await json.response?.data;
        const result = tariffsSchema.safeParse(data);
        if (!result.success) {
            console.error('Resonse type error: ', result.error);
        }

        return result;
    } catch (e) {
        console.error('WB API error: ', e);
    }
}
