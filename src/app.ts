import knex, { migrate, seed } from "#postgres/knex.js";
import { getBoxTariffs } from "#services/wb_api.js";
import startCronJobs from "#cron/cron.js";

await migrate.latest();
await seed.run();
startCronJobs();

console.log("All migrations and seeds have been run");