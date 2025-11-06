import cron from "node-cron";
import { getBoxTariffs } from "#services/wb_api.js";
import { saveBoxTariffs } from '#postgres/services/box_tariffs.js'

async function updateTariffs(fn: () => Promise<void>) {
    try {
        const data = await getBoxTariffs();
        if (!data) {
            console.error("WB Tariffs updating error: data is empty");
            return;
        }

        await saveBoxTariffs(data);
        await fn();
        console.log(`WB Tariffs Updated at ${new Date().toISOString()}`);
    } catch (e) {
        console.error("WB Tariffs updating error: ", e);
    }
}

function startCronJobs(processSheetsFn: () => Promise<void>) {
    const hourlyCron = cron.schedule("0 * * * *", () => updateTariffs(processSheetsFn));
    hourlyCron.start();
}

export default startCronJobs;