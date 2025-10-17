/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable('box_tariffs', (table) => {
        table.increments('id').primary();
        table.string('warehouse_name').notNullable();
        table.string('geo_name').notNullable();
        table.date('date').notNullable();

        table.decimal("box_delivery_base");
        table.decimal("box_delivery_coef_expr");
        table.decimal("box_delivery_liter");

        table.decimal("box_delivery_marketplace_base");
        table.decimal("box_delivery_marketplace_coef_expr");
        table.decimal("box_delivery_marketplace_liter");

        table.decimal("box_storage_base");
        table.decimal("box_storage_coef_expr");
        table.decimal("box_storage_liter");

        table.date("dt_next_box");
        table.date("dt_till_max");

        table.timestamp("updated_at").defaultTo(knex.fn.now());

        table.unique(["warehouse_name", "date"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("box_tariffs");
}
