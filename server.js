const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const config = require("./config.json").databaseConfig;
const query = require("./queries.json").queries;
const tableQuery = require("./queries.json").tableQueries;
const typeQuery = require("./queries.json").typeQueries;
const sql = require("mssql");
const fs = require("fs");

server.listen(port);



//CUSTOM FUNCTIONS
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

//make a list from queries to spread
const queryList = Object.values(query);
const queryKeyList = Object.keys(query)
let combinedQuery = ""; 
queryList.forEach(element => {
    combinedQuery += element
})
//FOR TABLES TOO
const tableQueryList = Object.values(tableQuery);
const tableQueryKeyList = Object.keys(tableQuery);
let combinedTableQuery = "";
tableQueryList.forEach(element => {
    combinedTableQuery += element;
})
//for types TOO
const typeQueryList = Object.values(typeQuery);
const typeQueryKeyList = Object.keys(typeQuery);
let combinedTypeQuery = "";
typeQueryList.forEach(element => {
    combinedTypeQuery += element
})


updateData();

function updateData(){
    sql.close();
    console.log("Updating data...");
    logTime();
    sql.connect(config, err => {
        if(err){
            console.log(err);
            updateData();
        }
        else{
            console.log("Connection successful for data updating..")
            console.log("Requesting query");
            new sql.Request().query(combinedQuery, (err, result) => {
                if(err){
                    console.log(err);
                    updateData();
                }
                else{
                    console.log("Query successfull for data. Writing to file...")
                    //recordsetin içindeki her veri için queryden isim çekip obje içinde 
                    //girdi oluştur.
                    let data = {};
                    result.recordsets.forEach((element, index) => {
                        data[queryKeyList[index]] = element;
                    })
                    fs.writeFile("./public/data/veri.json", JSON.stringify(data), () => {
                        console.log("veri.json is updated")
                        sql.close();
                        updateTables();
                    });

                }
            })

        }
    
    })
}

function updateTypes(){
    console.log("Updating types...");
    sql.connect(config, err => {

        if(err){
            console.log(err);
            updateData();
        } 
        else{
            console.log("Connection successfull for type update")
            console.log("Requesting query")
            new sql.Request().query(combinedTypeQuery, (err, result) => {
                if(err){
                    console.log(err);
                    updateData();
                }
                else{
                    console.log("Query successfull for types. Writing to file...")
                    let data = {};
                    result.recordsets.forEach((element, index) => {
                        data[typeQueryKeyList[index]] = element;
                    })
                    fs.writeFile("./public/data/types.json", JSON.stringify(data), ()=>{
                        console.log("types.json updated");
                        sql.close();
                        updateData();
                    })


                }
            })

        }
    })
}

function updateTables(){
    console.log("Updating tables...")
    sql.connect(config, err => {
        if(err){
            console.log(err);
            updateData();
        }
        else{
            console.log("Connection successfull for updating tables")
            console.log("Requesting query");
            new sql.Request().query(combinedTableQuery, (err, result) => {
                if(err){
                    console.log(err);
                    updateData();
                } 
                else{
                    console.log("Query successfull for updating table. Writing to file...")
                    let data = {};
                    result.recordsets.forEach((element, index) => {
                        data[tableQueryKeyList[index]] = element;
                    })
                    fs.writeFile("./public/data/tables.json", JSON.stringify(data), () => {
                        console.log("table.json updated")
                        sql.close();
                        updateTypes();
                    });
                    
                }
            })

        }
    })
}

sql.on("error", err => {
    console.dir("Catched an error on a global basis?")
    console.log(err)
    updateData();
})


function setIntervalandExecute(fn, t){
    fn();
    return(setInterval(fn, t))
};

function logTime(){
    let now = new Date();
    console.log(now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds())
}