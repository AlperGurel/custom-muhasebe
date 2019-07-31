let resultData;

$(document).ready(function(){
    $.ajax({
        type: "get",
        url: "http://192.168.10.155:3000/test/getData",
        success: (result) => {
            console.log(result);
            // drawAxisTickColors(result);
            google.charts.setOnLoadCallback(drawAxisTickColors);
            resultData = result;
        }
    })
})


google.charts.load('current', {packages: ['corechart', 'bar']});


function drawAxisTickColors() {
        console.log(resultData)
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