import { migrate, seed } from "#postgres/knex.js";
import startCronJobs from "#cron/cron.js";
import { processAllSheets } from "#services/spreadsheets.js";

await migrate.latest();
await seed.run();

console.log("All migrations and seeds have been run");

await processAllSheets();

startCronJobs(processAllSheets);