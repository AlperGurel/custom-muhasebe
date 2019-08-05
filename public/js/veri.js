let resultData;
const wifi_ip = "192.168.10.170";
$(document).ready(function(){
    $.ajax({
        type: "get",
        url: "http://" + wifi_ip + ":3000/test/getData",
        success: (result) => {
            // drawAxisTickColors(result);
            resultData = result;
            result = fixNumbers(result);
            resultData = fixNumbers(result);
            google.charts.setOnLoadCallback(drawAxisTickColors);
            google.charts.setOnLoadCallback(drawTable);
            //NAKİT GİRİŞLERi
            $(".nakit-girisleri .header .col-sm").each(function(index){
                    this.textContent = result["Nakit Girişleri"][index];
                
            })
            //cari faaliyetler
            $(".nakit-girisleri .content .cari-faaliyetler .header .col-sm").each(function(index){
                
                    this.textContent = result["Cari Faaliyetler"][index]

            })
            //gerçekleşen satışlar
            $(".nakit-girisleri .content .cari-faaliyetler .gerceklesen-satislar .header .col-sm").each(function(index){
                    this.textContent = result["gerceklesenSatislar"][index]
            })
            //gerçekleşen ödeme
            $(".nakit-girisleri .content .cari-faaliyetler .gerceklesen-satislar .gerceklesen-odeme .col-sm").each(function(index){
                    this.textContent = result["gerceklesenOdeme"][index]    
            })
            //kalan ödeme
            $(".nakit-girisleri .content .cari-faaliyetler .gerceklesen-satislar .kalan-odeme .col-sm").each(function(index){
                    this.textContent = result["Kalan Ödeme"][index]
            })
            //planlanan periyodik satışlar
            $(".nakit-girisleri .content .cari-faaliyetler .planlanan-periyodik-satislar .col-sm").each(function(index){
                    this.textContent = result["planlananSatis"][index]
            })
            
            //sözleşmeli planlanan satışlar
            $(".nakit-girisleri .content .cari-faaliyetler .sozlesmeli-planlanan-satislar .col-sm").each(function(index){
                    this.textContent = 0
            })

            //alınan çekler
            $(".nakit-giriseri .content .alinan-cekler .header .col-sm").each(function(index){
                    this.textContent = result["Alınan Çekler"][index]
            })

            //tahsildeki çekler
            $(".nakit-girisleri .content .alinan-cekler .tahsildeki-cekler .col-sm").each(function(index){
                    this.textContent = result["tahsildekiCek"][index];
            })

            //portfoydeki cekler
            $(".nakit-girisleri .content .alinan-cekler .portfoydeki-cekler .col-sm").each(function(index){
                    this.textContent = result["portfoydekiCekler"][index];
            })
            //kasa(güncel bakiye)
            $(".nakit-girisleri .content .kasa .col-sm").each(function(index){
                    this.textContent = result["Güncel Bakiye"];
            })
            //banka pos hesapları
            $(".nakit-girisleri .content .banka-pos-hesaplari .header .col-sm").each(function(index){
                    this.textContent = result["Banka Pos Hesapları"]
                
            })
            //Pos tahsilatları
            $(".nakit-girisleri .content .banka-pos-hesaplari .pos-tahsilatlari .col-sm").each(function(index){
                    this.textContent = result["Pos Tahsilatları"]
            })
            //nakit çıkışları
            $(".nakit-cikisleri .header .col-sm").each(function(index){
                    this.textContent = result["Nakit Çıkışları"][index]
            })
            //cari faaliyetler
            $(".nakit-cikisleri .content .cari-faaliyetler .header .col-sm").each(function(index){
                    this.textContent = result["Cari Faaliyetler Alış"][index];
            })
            //gerçekleşen alışlar
            $(".nakit-cikisleri .content .cari-faaliyetler .gerceklesen-alislar .header .col-sm").each(function(index){
                    this.textContent = result["alislar"][index];
            })
            //gerçekleşen Ödeme
            $(".nakit-cikisleri .content .cari-faaliyetler .gerceklesen-alislar .content .gerceklesen-odeme .col-sm").each(function(index){
                    this.textContent = result["Alışlar Gerçekleşen Ödeme"][index];
            })
            //
            $(".nakit-cikisleri .content .cari-faaliyetler .gerceklesen-alislar .content .kalan-odeme .col-sm").each(function(index){
                    this.textContent = result["Alışlar Kalan Ödeme"][index]
            })
            $(".nakit-cikisleri .content .cari-faaliyetler .planlanan-alislar .col-sm").each(function(index){
                    this.textContent = 0;
            })
            $(".nakit-cikisleri .content .cari-faaliyetler .sozlesmeli-planlanan-alislar .col-sm").each(function(index){
                    this.textContent = 0;
            })
            $(".nakit-cikisleri .content .sabit-giderler .header .col-sm").each(function(index){
          
                    this.textContent = result["Sabit Giderler"][index]             
            })
            //planlanan giderler
            $(".nakit-cikisleri .content .sabit-giderler .content .planlanan-giderler .col-sm").each(function(index){
                    this.textContent = result["Planlanan Giderler"][index]
            })
            $(".nakit-cikisleri .content .sabit-giderler .content .gerceklesen-giderler .col-sm").each(function(index){
                    this.textContent = result["Gerçekleşen Giderler"][index];
            })
            $(".nakit-cikisleri .content .verilen-cekler .header .col-sm").each(function(index){
                    this.textContent = result["Verilen Çekler"][index];
            })
            $(".nakit-cikisleri .content .verilen-cekler .content .ziraat-bankasi .col-sm").each(function(index){
                    this.textContent = result["Ziraat Çek"][index]
            })
            $(".nakit-cikisleri .content .verilen-cekler .content .albaraka .col-sm").each(function(index){
            
                    this.textContent = result["Albaraka Çek"][index];
            })
            $(".nakit-cikisleri .content .krediler .header .col-sm").each(function(index){
                    this.textContent = result["Krediler"][index];
            })
            $(".nakit-cikisleri .content .krediler .content .akbank .col-sm").each(function(index){
                    this.textContent = result["Akbank Kredi"][index]
            })
            $(".nakit-cikisleri .content .krediler .content .albaraka .col-sm").each(function(index){
                    this.textContent = result["Albaraka Kredi"][index]
            })
            $(".nakit-cikisleri .content .krediler .content .ziraat .col-sm").each(function(index){
                    this.textContent = result["Ziraat Kredi"][index]
            
            })
            $(".nakit-cikisleri .content .krediler .content .finans .col-sm").each(function(index){
                    this.textContent = result["Finans Kredi"][index]
                
            })
            $(".nakit-cikisleri .content .kredi-kartlari .header .col-sm").each(function(index){
                    this.textContent = 0;
            })
            $(".nakit-cikisleri .content .kredi-kartlari .content .finans .col-sm").each(function(index){
                    this.textContent = 0;
            })
            $(".nakit-cikisleri .content .kredi-kartlari .content .deniz .col-sm").each(function(index){
                    this.textContent = 0;              
            })
            $(".nakit-cikisleri .content .kredi-kartlari .content .akbank .col-sm").each(function(index){
                    this.textContent = 0;
            })
            $(".acigi-giderici-kaynaklar .header .col-sm").each(function(index){
                    this.textContent = result["Toplam Banka Mevduat"][index]
            })
            $(".acigi-giderici-kaynaklar .content .banka .header .col-sm").each(function(index){
                    this.textContent = result["Toplam Banka Mevduat"][index]
            })
            $(".acigi-giderici-kaynaklar .content .banka .content .toplam-banka-mevduat .col-sm").each(function(index){
                    this.textContent = result["Toplam Banka Mevduat"][index]
            })
            $(".acigi-giderici-kaynaklar .content .banka .content .acik-icin-mevduat .col-sm").each(function(index){
                    this.textContent = ""
            })


        }
    })
})


google.charts.load('current', {packages: ['corechart', 'bar', "table"]});


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
            rows.push(row);
      }
      data.addRows(
          rows
      )

      var options = {
        backgroundColor: '#454443',
        title: '2019 Nakit Akışı',
        focusTarget: 'category',
        hAxis: {
          title: '2019',

            textStyle: {    
                fontSize: 14,
                color: '#d8e2ed',
                bold: true,
                italic: false
                },
            titleTextStyle: {
                fontSize: 18,
                color: '#f5f8fc',
                bold: true,
                italic: false,
            }
        },
        vAxis: {
            title: 'TL',
            textStyle: {
            fontSize: 12,
            color: '#e0dcdd',
            bold: false,
            italic: false
            },
            titleTextStyle: {
            fontSize: 18,
            color: '#e0dcdd',
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
    var cssClassNames = {
        "tableRow":"test-black",
        "oddTableRow": "test-black-odd",
        "headerRow": "test-black row-head",
        "tableCell": "table-cell"
    }
    // for(let i = 0; i < $("tr")[0]["cells"].length; i++){
    //     $("tr")[0]["cells"][i].style.background = "#393939";
    //     $("tr")[0]["cells"][i].style.color = "#08A55D";
    //     $("tr")[0]["cells"][i].style["border-style"] = "none";
    // }

    var table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(data, {cssClassNames: cssClassNames, width: '100%', allowHtml: true});
    for(let i = 0; i < $("tr")[0]["cells"].length; i++){
        $("tr")[0]["cells"][i].style.background = "#393939";
        $("tr")[0]["cells"][i].style.color = "#08A55D";
        $("tr")[0]["cells"][i].style["border-style"] = "none";
    }

}

$(".nakit-girisleri > .header").click(function(e){
        $(".nakit-girisleri .content").slideToggle(150);
})
$(".nakit-cikisleri > .header").click(function(e){
        $(".nakit-cikisleri .content").slideToggle(150);
})
$(".acigi-giderici-kaynaklar > .header").click(function(e){
        $(".acigi-giderici-kaynaklar .content").slideToggle(150);
})
$(".cari-faaliyetler > .header").click(function(e){
        $(".cari-faaliyetler .content").slideToggle(150);
})
$(".alinan-cekler > .header").click(function(e){
        $(".alinan-cekler .content").slideToggle(150);
})
$(".banka-pos-hesaplari > .header").click(function(e){
        $(".banka-pos-hesaplari .content").slideToggle(150);
})
$(".gerceklesen-satislar > .header").click(function(e){
        $(".gerceklesen-satislar .content").slideToggle(150);
})
$(".sabit-giderler> .header").click(function(e){
        $(".sabit-giderler .content").slideToggle(150);
})
$(".verilen-cekler > .header").click(function(e){
        $(".verilen-cekler .content").slideToggle(150);
})
$(".krediler > .header").click(function(e){
        $(".krediler .content").slideToggle(150);
})
$(".kredi-kartlari > .header").click(function(e){
        $(".kredi-kartlari .content").slideToggle(150);
})
$(".banka > .header").click(function(e){
        $(".banka .content").slideToggle(150);
})
$(".months .col-left").click(function(e){
        $(".content").slideToggle(150);
})
