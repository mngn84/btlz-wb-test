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

        table.decimal("box_delivery_base").notNullable();
        table.decimal("box_delivery_coef_expr").notNullable();
        table.decimal("box_delivery_liter").notNullable();

        table.decimal("box_delivery_marketplace_base").notNullable();
        table.decimal("box_delivery_marketplace_coef_expr").notNullable();
        table.decimal("box_delivery_marketplace_liter").notNullable();

        table.decimal("box_storage_base").notNullable();
        table.decimal("box_storage_coef_expr").notNullable();
        table.decimal("box_storage_liter").notNullable();

        table.date("dt_next_box").notNullable();
        table.date("dt_till_max").notNullable();

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("box_tariffs");
}
