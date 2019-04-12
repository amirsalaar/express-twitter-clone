
exports.up = function(knex, Promise) {
    return knex.schema.table('clucks', t => {
        t.string('email')
        t.varchar('password_digest');
        t.text('avatar_url');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('clucks', t => {
        t.dropColumn('email')
        t.dropColumn('password_digest');
        t.dropColumn('avatar_url');
    })
};
