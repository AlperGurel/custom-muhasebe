const express = require("express");
const router = express.Router();
const sql = require("mssql");

const config = {
    user: 'alpergurel',
    password: 'alperalper',
    server: '192.168.10.250\\MIKROSQL',
    database: 'MikroDB_V15_00',
    port: 49234,
    options: {
        encrypt: true 
    }
}

router.get("/", (req, res, next) => {
    res.status(200).render("veri");
})

module.exports = router;