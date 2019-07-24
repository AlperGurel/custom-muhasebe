$(document).ready(() => {
    google.charts.load('current', {'packages':['table']});
})

//CREATE A SELECT OPTION FOR TABLES
let app = new Vue({
    el: "#app",
    data: {
        selected_table: "GD_MUSTERI_BAKIYE"
    },
    created: function(){
        this.loadData();
    },
    methods: {
        loadData: function(){
            console.log(this.selected_table);
            let url = "http://localhost:3000/tables/gettable";
            url += "/" + this.selected_table;
            $.ajax({
                type: "GET",
                url: url,
                success: (result) => {
                    createTable(result);
                }

            })
        }
    }
})

function createTable(data){
    if(!document.getElementById("table_div")){
        let dom_table = document.createElement("div");
        dom_table.setAttribute("id", "table_div");
        let container = document.getElementById("table_container");
        container.appendChild(dom_table);
    }
    var table = new google.visualization.Table(document.getElementById('table_div'));
    console.log(data);
    const keys = Object.keys(data.recordset[0]);
    const dataGoogle = new google.visualization.DataTable();
    keys.forEach((key, index) => {
        let col_type = typeMap[data.data_types.recordset[index]["DATA_TYPE"]];
        dataGoogle.addColumn(col_type, key);
    });
    let rows = []
    data.recordset.forEach(record => {
        let row= [];
        keys.forEach((key, index) => {
            //if record is date
            let col_type = typeMap[data.data_types.recordset[index]["DATA_TYPE"]];
            if(col_type == "date"){
                let tmpDate = new Date(record[key]);
                row.push(tmpDate);
            }
            else{
                row.push(record[key]);   
            }     
          
        })
        rows.push(row);
    })
    dataGoogle.addRows(rows);
    table.draw(dataGoogle, {showRowNumber: true, width: '100%', height: '100%'});
}

typeMap = {
    nvarchar: "string",
    float: "number",
    varchar: "string",
    int: "number",
    smallint: "number",
    bit: "boolean",
    datetime: "date",
    tinyint: "number",


}