const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./database/db.json');
const db = low(adapter);

db.defaults({ machine_1_info: [] },{ machine_2_info: [] },{ machine_3_info: [] }, { users: [] })
    .write()

module.exports = db;