const knex = require("../db/knex");

async function createMessage(roomname, time, text) {
    try {
     await knex("messages").insert({roomname});
     await knex("messages").insert({time});
     await knex("messages").insert({text});
    }
    catch{}
 };

/* const moment = require("moment");

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format("h:mm a")
    }
} */

module.exports = createMessage;