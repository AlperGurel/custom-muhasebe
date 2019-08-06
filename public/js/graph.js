let resultData;
const wifi_ip = "192.168.10.150";

$(document).ready(() => {
  $.ajax({
    type: "GET",
    url: "http://" + wifi_ip + ":3000/test/getData",
    success: (result) => {
        result = fixNumbers(result);
        resultData = result;
        new ApexCharts(document.querySelector("#donem-sonu-nakit-akis"), createTestOptions({
            name: "Dönem Sonu Nakit",
            data: [resultData["Dönem Sonu Nakit"]]
        })).render();         
        new ApexCharts(document.querySelector("#nakit-giris"), createTestOptions({
            name: "Nakit Giriş",
            data: [resultData["Nakit Girişleri"]]
        })).render();
        new ApexCharts(document.querySelector("#donem-ici-fark"), createTestOptions({
            name: "Dönem İçi Fark",
            data: [resultData["Dönem İçi Fark"]]
        })).render();
        new ApexCharts(document.querySelector("#nakit-cikisleri"), createTestOptions({
            name: "Nakit Çıkışları",
            data: [resultData["Nakit Çıkışları"]]
        })).render();
        new ApexCharts(document.querySelector("#tahsilat-performans"), createTestOptions({
            name: "Tahsilat Performans",
            data: [resultData["Tahsilat Performans"]]
        })).render();
        new ApexCharts(document.querySelector("#odeme-performans"), createTestOptions({
            name: "Ödeme Performans",
            data: [resultData["Ödeme Performans"]]
        })).render();
        new ApexCharts(document.querySelector("#giris-cikis"), createTestOptions({
            name: "Nakit Giriş Çıkış",
            data: [resultData["Nakit Girişleri"], resultData["Nakit Çıkışları"]],
            datanames: ["Nakit Girişi", "Nakit Çıkışı"],
            lineType: "area",
            colors: ["#42f569","#f54b42"]
        })).render()
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


let createTestOptions = function(options){
    let type = "line";
    let colors= ["#00E396", "#0090FF"];
    if(options.colors){
        colors = options.colors;
    }
    let series = options.data.map((element,index) => {
        let name = options.name;
        if(options.datanames){
            name = options.datanames[index]
        }
        return {
            name: name,
            data: element
        }
    })
    if(options.lineType){
        type = options.lineType
    }

    return {
        title: {
            text: options.name.toLocaleUpperCase()
        },
        chart: {
            
          type: type,
          height: 300,
          foreColor: "#999",
          scroller: {
            enabled: true,
            track: {
              height: 7,
              background: '#e0e0e0'
            },
            thumb: {
              height: 10,
              background: '#94E3FF'
            },
            scrollButtons: {
              enabled: true,
              size: 9,
              borderWidth: 2,
              borderColor: '#008FFB',
              fillColor: '#008FFB'
            },
            padding: {
              left: 30,
              right: 20
            }
          },
          stacked: true,
          dropShadow: {
            enabled: true,
            enabledSeries: [0],
            top: -2,
            left: 2,
            blur: 5,
            opacity: 0.06
          }
        },
        colors: colors,
        stroke: {
           curve: "smooth",
           width: 3
        },
        dataLabels: {
          enabled: false
        },
        series: series,
        markers: {
          size: 0,
          strokeColor: "#fff",
          strokeWidth: 3,
          strokeOpacity: 1,
          fillOpacity: 1,
          hover: {
            size: 6
          }
        },
        xaxis: {
          categories: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
    
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          labels: {
            offsetX: 24,
            offsetY: -5
          },
          tooltip: {
            enabled: true
          }
        },
        grid: {
          padding: {
            left: -5,
            right: 5
          }
        },
        tooltip: {
          x: {
            
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        },
        fill: {
          type: "solid",
          fillOpacity: 0.7
        }
      };
}
