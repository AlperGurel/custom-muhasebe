
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

$(".table-name").click(function(e){
    $("#visible-table-name").html(e.currentTarget.innerText);
    // $(".dropdown-content").css("display", "none");
    let query = e.currentTarget.id;
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
            let columnName = columnKeys[index];
            columnTypes[index] = type;
            data.addColumn(type, columnName)
            if(columnName === "TEL NO"){
                columnFix["telno index"] = index
            }

        })
        let dataVis = []
        result.data.forEach((element) => {
            let row = []
            //test
            columnKeys.forEach((column,index) => {
                if(columnTypes[index] === "date"){
                    
                    element[column] = new Date(element[column]);
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
        data.addRows(dataVis);
        if(columnFix["telno index"]){
            data.setProperty(0, columnFix["telno index"], "style", "width:110px");
        }
        var table = new google.visualization.Table(document.getElementById('data-table'));
        var cssClassNames = {
            "tableRow":"test-black",
            "oddTableRow": "test-black",
            "headerRow": "test-black row-head",
            "tableCell": "table-cell"
        }

        table.draw(data, {width: '100%', height: '70%', cssClassNames:cssClassNames, allowHtml: true});

       for(let i = 0; i < $("tr")[0]["cells"].length; i++){
            $("tr")[0]["cells"][i].style.background = "#393939";
            $("tr")[0]["cells"][i].style.color = "#08A55D";
            $("tr")[0]["cells"][i].style["border-style"] = "none";
       }
    //    for(let i = 0; i < $("td").length; i++){  
    //        $("td")[i].style["border-style"] = "none";
    //    }
      }