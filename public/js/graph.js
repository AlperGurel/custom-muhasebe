let resultData;
const wifi_ip = "192.168.10.170";

$(document).ready(() => {
  $.ajax({
    type: "GET",
    url: "http://" + wifi_ip + ":3000/test/getData",
    success: (result) => {
      result = fixNumbers(result);
      resultData = result;
      let options = createOptions();
      var chart = new ApexCharts(
        document.querySelector("#donem-sonu-nakit-akis"),
        options
        );
        chart.render()
    }
  })


 })


function fixNumbers(data){
  let dataKeys = Object.keys(data);
  dataKeys.forEach((element, index)=> {
      if(element != "Güncel Bakiye"){
          data[element].forEach((number, innerIndex) =>{
              if(number != null){
                  data[element][innerIndex] = parseInt(number.toFixed());
              }
          })
      }

  })
  data["Güncel Bakiye"] = parseInt(data["Güncel Bakiye"].toFixed());
  return data;
}


let createOptions = function(){
  let options = {
    chart: {
        height: 350,
        type: 'line',
        shadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 1
        },
        toolbar: {
            show: false
        }
    },
    colors: ['#77B6EA'],
    dataLabels: {
        enabled: true,
    },
    stroke: {
        
    },
    series: [{
            name: "Dönem Sonu Nakit Akışı",
            data: resultData["Dönem Sonu Nakit"]
        }
    ],
    title: {
        text: '2019 Dönem Sonu Nakit Akışı',
        align: 'left'
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity:0.2
        },
    },
    markers: {
        
        size: 3
    },
    xaxis: {
        categories: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
        title: {
            text: 'Ay'
        }
    },
    yaxis: {
        title: {
            text: 'Dönem Sonu Nakit Akışı (TL)'
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
    }
  }
  return options;
}




// chart.render();