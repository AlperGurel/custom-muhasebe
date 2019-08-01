let resultData;

$(document).ready(function(){
    $.ajax({
        type: "get",
        url: "http://192.168.10.155:3000/test/getData",
        success: (result) => {
            console.log(result);
            // drawAxisTickColors(result);
            resultData = result;
            google.charts.setOnLoadCallback(drawAxisTickColors);
            google.charts.setOnLoadCallback(drawTable);
        }
    })
})


google.charts.load('current', {packages: ['corechart', 'bar', "table"]});


function drawAxisTickColors() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', '2019');
      data.addColumn('number', 'Nakit Girişleri');
      data.addColumn('number', 'Nakit Çıkışları');
      let months = ["Ocak", "Şubat", "Mart", "Nisan","Mayıs","Haziran","Temmuz","Ağustos", "Eylül", "Ekim", "Kasım","Aralık"];
      let rows = [];
      for(let i = 0; i < 12; i++){
            let row = [];
            row.push(months[i]);
            let nm = resultData["Nakit Girişleri"][i];
            nm = parseInt(nm.toFixed());
            row.push(nm);
            nm2 = resultData["Nakit Çıkışları"][i];
            nm2 = parseInt(nm2.toFixed());
            row.push(nm2)
            console.log(row)
            rows.push(row);
      }
      data.addRows(
          rows
      )

      var options = {
        title: '2019 Nakit Akışı',
        focusTarget: 'category',
        hAxis: {
          title: '2019',

            textStyle: {    
                fontSize: 14,
                color: '#053061',
                bold: true,
                italic: false
                },
            titleTextStyle: {
                fontSize: 18,
                color: '#053061',
                bold: true,
                italic: false
            }
        },
        vAxis: {
            title: 'TL',
            textStyle: {
            fontSize: 18,
            color: '#67001f',
            bold: false,
            italic: false
            },
            titleTextStyle: {
            fontSize: 18,
            color: '#67001f',
            bold: true,
            italic: false
            }
        }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('column-graph'));
    chart.draw(data, options);
}

function drawTable(){
    var data = new google.visualization.DataTable();
    let months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
    data.addColumn("string", "");
    months.forEach((month, index) => {
        data.addColumn("number", month);
    })
    let rows = []
    let donemBasiNakit = ["Dönem Başı Nakit"];
    resultData["Dönem Başı Nakit"].forEach((element, index) => {
        donemBasiNakit.push(element);
    })
    let donemSonuNakit = ["Dönem Sonu Nakit"];
    resultData["Dönem Sonu Nakit"].forEach((element, index) => {
        donemSonuNakit.push(element);
    })
    let donemIciFark = ["Dönem İçi Fark"];
    resultData["Dönem İçi Fark"].forEach((element, index) => {
        donemIciFark.push(element);
    })
    rows.push(donemBasiNakit);
    rows.push(donemSonuNakit);
    rows.push(donemIciFark);
    data.addRows(rows);

    var table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(data, {width: '100%'});

}