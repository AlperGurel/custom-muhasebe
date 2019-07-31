

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

let table_name;

$(".table-name").click(function(e){
    $("#visible-table-name").html(e.currentTarget.innerText);
    // $(".dropdown-content").css("display", "none");
    let query = e.currentTarget.id;
    table_name = query;
    $.ajax({
        type: "get",
        url: "http://192.168.10.155:3000/tables/test/" + query,
        success: (result) => {
            console.log(result);
            drawTable(result);
        }
    })
})


google.charts.load('current', {'packages':['table']});

      function drawTable(result) {
        var data = new google.visualization.DataTable();
        let columnKeys = Object.keys(result.data[0]);
        let columnTypes = []
        let columnFix = {}
        result.type.forEach((element, index) => {
            let type = typeMap[element["DATA_TYPE"]];
            let columnName = columnKeys[index].toLocaleUpperCase();
            //if columnkeys[index] tahsilat tarihi
            //   make type a date
            let dateColumns = ["Tahsilat Tarihi",
                                "Tahsilat Vadesi",
                                "Fatura Tarihi", 
                                "Ödeme Tarihi",
                                "Çek Vadesi",
                                "Kabul Tarihi",
                                "Ödeme Vadesi",
                                "Tarih",
                                "Tahakkuk Tarihi"
                            ]
            if( dateColumns.includes(columnKeys[index])){
                type = "date";
            }
            // if(columnKeys[index] == "Ödeme Vadesi" && table_name=="GD_VW_GIDERLER"){
            //     type = "number"
            // }
            columnTypes[index] = type;
            data.addColumn(type, columnName)
            if(columnName === "TEL NO"){
                columnFix["telno index"] = index
            }
            if(columnName === "Banka Adı"){
                columnFix["Banka Adı"] = index
            }
            if(columnName === "TEMSİLCİ ADI"){
                columnFix["TEMSİLCİ ADI"] = index
            }
        })

        let dataVis = []
        result.data.forEach((element) => {
            let row = []
            //test
            columnKeys.forEach((column,index) => {
                if(columnTypes[index] === "date"){
                    //process given element (probably check if valid inside the function)                
                    //element[column] = new Date(element[column]);
                    element[column] = fixDate(element[column]);
                }
                if(columnTypes[index] === "number"){
                    if(element[column]){
                        element[column] = parseInt(element[column].toFixed());
                    }
                }
                //if column is of type date
                //element column = new date element column
                row.push(element[column]);
            })
            dataVis.push(row);
        })
        console.log(columnFix)
        data.addRows(dataVis);
        if(columnFix["telno index"]){
            data.setProperty(0, columnFix["telno index"], "style", "width:130px");
        }
        if(columnFix["Banka Adı"]){
            // data.setProperty(0, columnFix["Banka Adı"], "style", "width:650px");
            // data.setProperty(0, 1, "style", "width:1650px");
            //bir nedenden ötürü index 1'deki çalışmıyor
        }
        if(columnFix["TEMSİLCİ ADI"]){
            console.log("Fixing temsilci adı column")
            data.setProperty(0, columnFix["TEMSİLCİ ADI"], "style", "width:200px")
        }
        var table = new google.visualization.Table(document.getElementById('data-table'));
        var cssClassNames = {
            "tableRow":"test-black",
            "oddTableRow": "test-black-odd",
            "headerRow": "test-black row-head",
            "tableCell": "table-cell"
        }
        var monthYearFormatter = new google.visualization.DateFormat({
            pattern: "dd-MM-yyy"
        });
        monthYearFormatter.format(data, 0);
        table.draw(data, { height: '78%', cssClassNames:cssClassNames, allowHtml: true});

       for(let i = 0; i < $("tr")[0]["cells"].length; i++){
            $("tr")[0]["cells"][i].style.background = "#393939";
            $("tr")[0]["cells"][i].style.color = "#08A55D";
            $("tr")[0]["cells"][i].style["border-style"] = "none";
       }
    //    for(let i = 0; i < $("td").length; i++){  
    //        $("td")[i].style["border-style"] = "none";
    //    }
      }

function fixDate(badDate){
    try{
        let goodDate = new Date(badDate);
        if(goodDate = "Invalid Date"){
            let dateParts = badDate.split(".");
           goodDate = new Date(dateParts[2], dateParts[0] -1, dateParts[1]);
        }
        return goodDate;
    }
    catch(error){
     
    }
}