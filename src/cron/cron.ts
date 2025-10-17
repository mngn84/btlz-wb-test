import cron from "node-cron";
import { getBoxTariffs } from "#services/wb_api.js";
import { saveBoxTariffs } from '#postgres/services/box_tariffs.js'

async function updateTariffs() {
    try {
        const today = new Date().toISOString().split("T")[0]
        const data = await getBoxTariffs(today);
        if (!data) {
            console.error("WB Tariffs updating error: data is empty");
            return;
        }

        await saveBoxTariffs(data, today);
        console.log(`WB Tariffs Updated at ${new Date().toISOString()}`);
    } catch (e) {
        console.error("WB Tariffs updating error: ", e);
    }
}

const hourlyCron = cron.schedule("0 * * * *", updateTariffs);
const dailyCron = cron.schedule("0 0 * * *", updateTariffs);

function startCronJobs() {
    hourlyCron.start();
    dailyCron.start();
}

export default startCronJobs;