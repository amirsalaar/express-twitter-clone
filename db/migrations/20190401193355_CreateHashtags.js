exports.up = function (knex) {
    return knex.schema.createTable('hashtags', t => {
        t.bigIncrements('id').primary();
        t.string('tag_name');
        t.integer('count');
        t.timestamps(true, true);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('hashtags');
};
