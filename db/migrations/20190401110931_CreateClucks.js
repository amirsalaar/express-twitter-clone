exports.up = function (knex) {
    return knex.schema.createTable('clucks', t => {
        t.bigIncrements('id').primary();
        t.string('username');
        t.text('image_url');
        t.text('content');
        t.timestamps(true, true);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('clucks');
};
