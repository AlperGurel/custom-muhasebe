const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../config.json").databaseConfig;
const fs = require("fs");
const path = require("path");

router.get("/", (req, res, next) => {
    res.status(200).render("tables");
});



router.get("/test/:table_name", (req, res, next) => {
    const filePath = path.join(__dirname, "../public/data/tables.json");
    const typeFilePath = path.join(__dirname, "../public/data/types.json");
    fs.readFile(filePath, (err, data) => {
        if(err){
            console.log(err)
        }
        else{
            data = JSON.parse(data);
            const table_name = req.params.table_name;
            let tableData = data[table_name];
            fs.readFile(typeFilePath, (err, typeData) => {
                if(err) console.log(err);
                typeData = JSON.parse(typeData);
                let obj = {
                    data: tableData,
                    type: typeData[table_name]
                }
                res.status(200).json(obj);
            })
        }
    })
})

router.get("/gettable/:table_name", (req, res, next) => {
    const table_name = req.params.table_name;
    const query = "select * from " + table_name;
    if(sql){
        sql.close()
    }
    sql.connect(config, err => {
        console.log(err);
        new sql.Request().query(query, (err, result) => {
            if(err)console.log(err);
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

module.exports = router;