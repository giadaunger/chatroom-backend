const knex = require("../db/knex");

async function createRoom(roomname) {
   try {
    await knex("room").insert({roomname})
   }
   catch{}
};

async function deleteRoom(roomname) {
    await knex("room").where("roomname", roomname).del();
    await knex("messages").where("room", roomname).del();
};

function getAllRooms(roomname) {
    knex.select(roomname).from("books")
};

module.exports = { 
    createRoom, 
    deleteRoom,
    getAllRooms
};