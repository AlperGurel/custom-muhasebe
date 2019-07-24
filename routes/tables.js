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
    res.status(200).render("tables");
});


router.get("/gettable/:table_name", (req, res, next) => {
    const table_name = req.params.table_name;
    const query = "select * from " + table_name;
    sql.connect(config, err => {
        console.log(err);
        new sql.Request().query(query, (err, result) => {
            console.log(err);
            const type_query = `select [DATA_TYPE] FROM [MikroDB_V15_00].[INFORMATION_SCHEMA].[COLUMNS] 
            WHERE [TABLE_NAME] = '${table_name}'`;
            
            new sql.Request().query(type_query, (err, type_result) => {
                console.log(err);
                result.data_types = type_result;
                sql.close();
                res.status(200).json(result);
            })

        })

    })
    sql.on("error", err => {
        console.log(err);
    })
})



router.get("/test/:tablename", (req, res, next) => {
    console.log("testing")
    const tablename = req.params.tablename;
    const query = `SELECT [TABLE_NAME]
    ,[COLUMN_NAME]
    ,[DATA_TYPE]
FROM [MikroDB_V15_00].[INFORMATION_SCHEMA].[COLUMNS] where [TABLE_NAME] = '${tablename}'`;
    sql.connect(config, err => {
        new sql.Request().query(query, (err, result) => {
            console.log(err);
            res.status(200).json(result);
            sql.close();
        })
    })
})

module.exports = router;