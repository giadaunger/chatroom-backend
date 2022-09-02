/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.up = async function (knex) {
    await knex.schema.createTable("room", (table) => {
        table.increments("id");
        table.string("roomname").notNullable();
    });
    await knex.schema.createTable("messages", (table) => {
        table.increments("id");
        table.text("text").notNullable();
        table.string("roomname").notNullable();
        table.string("time");
    });
};
/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = async function (knex) {
    await knex.schema.dropTable("messages");

    await knex.schema.dropTable("rooms");
};