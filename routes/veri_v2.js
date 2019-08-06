const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../config.json").databaseConfig;
// const veri = require("../public/data/veri.json");
const path = require("path")
const fs = require("fs")
let rawData;
let createdData = {
}


router.get("/", (req, res, next) => {
    res.status(200).render("veri");
} )

router.post("/mevduat", (req, res, next) => {
    
    let mevduat = req.body.mevduat;
    let monthIndex = req.body.monthIndex;
    let lst = [0,0,0,0,0,0,0,0,0,0,0,0];
    if(createdData["Açık İçin Kullanılan Mevduat"]){
        lst = createdData["Açık İçin Kullanılan Mevduat"];
    }
    lst[monthIndex] = mevduat;
    createdData["Açık İçin Kullanılan Mevduat"] = lst;
    res.status(200).json("ok");
})

router.get("/getData", (req ,res, next) => {
    const filePath = path.join(__dirname, "../public/data/veri.json")
    fs.readFile(filePath, (err, data) => {
        if(err){
            console.log(err);
        }
        else{
            data = JSON.parse(data);
            rawData = data;
            createNakitGirisleriBase();
            createNakitGirisleriSecond();
            createNakitGirisleriThird();
            ///////////////////////////
            createNakitCikisleriBase();
            createNakitCikisleriSecond();
            createNakitCikisleri();
            ///////////////////////////
            createBankaMevduat();
            ///////////////////////////
            createSuperUclu();
            res.status(200).json(createdData);
        }
    })
})

module.exports = router;
function createSuperUclu(){
    let donemBasiNakit= [];
    let donemSonuNakit = [];
    let donemIciFark = []
    //for each month
    //ocak
    donemBasiNakit.push(0);
    let tmp = donemBasiNakit[0] + createdData["Nakit Girişleri"][0] - createdData["Nakit Çıkışları"][0];
    console.log(donemBasiNakit[0]);
    console.log(createdData["Nakit Girişleri"][0])
    console.log(createdData["Nakit Çıkışları"][0])
    console.log(tmp);
    donemSonuNakit.push(tmp);
    tmp = donemSonuNakit[0] - donemBasiNakit[0]
    donemIciFark.push(tmp);
    for(let i = 1; i< 12; i++){
        donemBasiNakit.push(donemSonuNakit[i-1]);
        tmp = donemBasiNakit[i] + createdData["Nakit Girişleri"][i] - createdData["Nakit Çıkışları"][i] ;
        donemSonuNakit.push(tmp);
        tmp = donemSonuNakit[i] - donemBasiNakit[i];
        donemIciFark.push(tmp);
    }
    createdData["Dönem Başı Nakit"] = donemBasiNakit;
    createdData["Dönem Sonu Nakit"] = donemSonuNakit;
    createdData["Dönem İçi Fark"] = donemIciFark;

        //calculate donemBasiNakit and add List
        //calculate donemSonuNakit and add list
        //calculate donemicifark and add list
        

}

function createNakitCikisleriSecond(){
    createCariFaaliyetlerAlis();
    createSabitGiderler();
    createVerilenCekler();
    createKrediler();
    createOdemePerformans();
}

function createNakitCikisleri(){
    let cariFaaliyetlerAlis = createdData["Cari Faaliyetler Alış"];
    let sabitGiderler = createdData["Sabit Giderler"];
    let verilenCekler = createdData["Verilen Çekler"];
    let krediler = createdData["Krediler"];
    let nakitCikislari = [];
    cariFaaliyetlerAlis.forEach((element, index) => {
        nakitCikislari.push(element + sabitGiderler[index] + verilenCekler[index] + krediler[index])
    })
    createdData["Nakit Çıkışları"] = nakitCikislari;
}

function createBankaMevduat(){
    let data = rawData["toplamBankaMevduat"];
    let bankaMevduat = [];
    for(let i = 0; i < 12; i++){
        bankaMevduat.push(0);
    }
    data.forEach((element,index) => {
        Object.values(element).forEach((element2, index2) => {
            bankaMevduat[index2] += element2;
        })
    })
    createdData["Toplam Banka Mevduat"] = bankaMevduat
}


function createNakitCikisleriBase(){

    createAlislar();
    createPlanlananGiderler();
    createGerceklesenGiderler();
    createZiraatCek();
    createAlbarakaCek();
    createAkbankKredi();
    createAlbarakaKredi();
    createZiraatKredi();
    createFinansKredi();
    createAlisGerceklesenOdeme();
    createAlisKalanOdeme();
}


function createOdemePerformans(){
    let gerceklesenOdeme = createdData["Alışlar Gerçekleşen Ödeme"];
    let gerceklesenAlislar = createdData["alislar"];
    let odemePerformans = [];
    gerceklesenAlislar.forEach((element, index) => {
        odemePerformans.push(gerceklesenOdeme[index]/element*100);
    })
    createdData["Ödeme Performans"] = odemePerformans;
}

function createKrediler(){
    let akbankKredi = createdData["Akbank Kredi"];
    let albarakaKredi = createdData["Albaraka Kredi"];
    let ziraatKredi = createdData["Ziraat Kredi"];
    let finansKredi = createdData["Finans Kredi"];
    let krediler = [];
    akbankKredi.forEach((element, index)=> {
        krediler.push(element + albarakaKredi[index] + ziraatKredi[index] + finansKredi[index]);
    })
    createdData["Krediler"] = krediler;
}

function createVerilenCekler(){
    let ziraatCek = createdData["Ziraat Çek"];
    let albarakaCek = createdData["Albaraka Çek"];
    let verilenCekler = [];
    albarakaCek.forEach((element, index) => {
        verilenCekler.push(element + ziraatCek[index]);
    })
    createdData["Verilen Çekler"] = verilenCekler;
}

function createSabitGiderler(){
    //planlanan createGerceklesenGiderler
    let planlananGiderler = createdData["Planlanan Giderler"];
    let gerceklesenGiderler = createdData["Gerçekleşen Giderler"];
    let sabitGiderler = [];
    gerceklesenGiderler.forEach((element, index) => {
        sabitGiderler.push(element + planlananGiderler[index]);
    })
    createdData["Sabit Giderler"] = sabitGiderler;
}

function createNakitGirisleriBase(){
    createPlanlananSatislar();
    createPortfoydekiCekler();
    createTahsildekiCekler();
    createGerceklesenOdeme();
    createKalanOdeme();
    createKasa();
    createGerceklesenSatislar();
}

function createNakitGirisleriSecond(){
    createAlinanCekler();
    createCariFaaliyetler();
}

function createNakitGirisleriThird(){
    createNakitGirisleri();
    createTahsilatPerformans();
}

function createZiraatCek(){
    let data = rawData["ziraatCek"];
    data.forEach(element => {
        element["Çek Vadesi"] = new Date(parseDateDMY(element["Çek Vadesi"]));
    })
    //sort by date
    data.sort((a, b) => (a["Çek Vadesi"] > b["Çek Vadesi"]) ? 1 : -1);
    //months
    //sum list
    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Çek Vadesi"].getMonth();
        planlananList[ind].push(element["Çek Tutarı"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["Ziraat Çek"] = planlanansumList;
}

function createAlbarakaCek(){
    let data = rawData["albarakCek"];
    data.forEach(element => {
        element["Çek Vadesi"] = new Date(parseDateDMY(element["Çek Vadesi"]));
    })
    data.sort((a, b) => (a["Çek Vadesi"] > b["Çek Vadesi"]) ? 1 : -1);
    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Çek Vadesi"].getMonth();
        planlananList[ind].push(element["Çek Tutarı"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["Albaraka Çek"] = planlanansumList;
}

function createAkbankKredi(){
    let data = rawData["akbankKredi"];
    data.forEach(element => {
        element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
    })
    data = data.filter(element => element["Ödeme Vadesi"].getFullYear() === new Date().getFullYear())
    data.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);
    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Ödeme Vadesi"].getMonth();
        planlananList[ind].push(element["Taksit Tutarı"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["Akbank Kredi"] = planlanansumList;
}

function createFinansKredi(){
    let data = rawData["finansKredi"];
    data.forEach(element => {
        element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
    })
    data = data.filter(element => element["Ödeme Vadesi"].getFullYear() === new Date().getFullYear())
    data.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);
    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Ödeme Vadesi"].getMonth();
        planlananList[ind].push(element["Taksit Tutarı"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["Finans Kredi"] = planlanansumList;
}

function createGerceklesenGiderler(){
    let data = rawData["gerceklesenGiderler"];
    data.forEach(element => {
        element["Tarih"] = new Date(parseDateDMY(element["Tarih"]));
        element["Vade"] = new Date(element["Tarih"]);
        //batuhan bey vadeye +5 gün diyor ama
        if(!element["Vade"]){
            element["Vade"].setDate(element["Vade"].getDate() + 40);
        }
    })
    //sort by date
    data.sort((a, b) => (a["Vade"] > b["Vade"]) ? 1 : -1);
    //months
    //sum list
    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Vade"].getMonth();
        planlananList[ind].push(element["Masraf Tutarı"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["Gerçekleşen Giderler"] = planlanansumList;
}

function createPlanlananGiderler(){
    let data = rawData["planlananGiderler"];
    data.forEach(element => {
        element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
    })
    data.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);

    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Ödeme Vadesi"].getMonth();
        planlananList[ind].push(element["bna_tutar"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["Planlanan Giderler"] = planlanansumList;
}

function createAlbarakaKredi(){
    let data = rawData["albarakaKredi"];
    data.forEach(element => {
        element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
    })
    data = data.filter(element => element["Ödeme Vadesi"].getFullYear() === new Date().getFullYear())

    data.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);

    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Ödeme Vadesi"].getMonth();
        planlananList[ind].push(element["Taksit Tutarı"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["Albaraka Kredi"]= planlanansumList;
}

function createZiraatKredi(){
    let data = rawData["ziraatKredi"];
    data.forEach(element => {
        element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
    })
    data = data.filter(element => element["Ödeme Vadesi"].getFullYear() === new Date().getFullYear())

    data.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);

    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Ödeme Vadesi"].getMonth();
        planlananList[ind].push(element["Taksit Tutarı"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["Ziraat Kredi"]= planlanansumList;
}

function createTahsilatPerformans(){
    let gerceklesenOdeme = createdData["gerceklesenOdeme"];
    let cariFaaliyetler = createdData["Cari Faaliyetler"];
    let tahsilatPerformans = [];
    gerceklesenOdeme.forEach((element, index)=> {
        tahsilatPerformans.push(element/cariFaaliyetler[index]*100);
    })
    createdData["Tahsilat Performans"] = tahsilatPerformans;
}

function createNakitGirisleri(){
    let kasa = createdData["Güncel Bakiye"];
    let alinanCekler = createdData["Alınan Çekler"];
    let cariFaaliyetler = createdData["Cari Faaliyetler"];
    let nakitGirisleri = [];
    alinanCekler.forEach((element, index) => {
        nakitGirisleri.push(kasa + element + cariFaaliyetler[index])
    })
    createdData["Nakit Girişleri"] = nakitGirisleri;
}

function createCariFaaliyetler(){
    let planlananSatis = createdData["planlananSatis"];
    let gerceklesenSatis = createdData["gerceklesenSatislar"];
    let cariFaaliyetler = [];
    planlananSatis.forEach((element, index)=>{
        cariFaaliyetler.push(element + gerceklesenSatis[index])
    })
    createdData["Cari Faaliyetler"] = cariFaaliyetler;
}

function createAlinanCekler(){
    let portfoydekiCekler = createdData["portfoydekiCekler"];
    let tahsildekiCekler = createdData["tahsildekiCek"];
    let alinanCekler = [];
    portfoydekiCekler.forEach((element, index) => {
        alinanCekler.push(tahsildekiCekler[index] + element)
    });
    createdData["Alınan Çekler"] = alinanCekler;
}

function createGerceklesenSatislar(){
    template1({
        tableName: "gerceklesenSatislar",
        billdateTag: "Fatura Tarihi",
        parseBillDate: true,
        vadeLimit: 30,
        paymentAmountTag: "Fatura Tutarı",
        dataLabel: "gerceklesenSatislar"
    })
}

function createKalanOdeme() {
    template1({
        tableName: "gerceklesenSatislar",
        billdateTag: "Fatura Tarihi",
        parseBillDate: true,
        vadeLimit: 30,
        paymentAmountTag: "Kalan Ödeme",
        dataLabel: "Kalan Ödeme"
    })
}

function createGerceklesenOdeme(){
    template1({
        tableName: "gerceklesenSatislar",
        billdateTag: "Fatura Tarihi",
        parseBillDate: true,
        vadeLimit: 30,
        paymentAmountTag: "Gerçekleşen Ödeme",
        dataLabel: "gerceklesenOdeme"
    })
}

function createKasa(){
    let data = rawData["guncelBakiye"];
    let kasa = 0;
    data.forEach(element => {
        kasa += element["Giriş"];
        kasa -= element["Çıkış"];
    })
    createdData["Güncel Bakiye"] = kasa;
}

function createPlanlananSatislar(){
    let data = rawData["planlananSatis"];
    data.forEach(element => {
        element["Kdv Dahil"] = element["Tutarı"]*1.18;
    })
    data.forEach(element => {
        let billdate = new Date(element["Fatura Tarihi"]);
        let vadeDate = new Date(billdate);
        vadeDate.setDate(vadeDate.getDate() + 0);
        element["vade tarihi"] = vadeDate;
    })
    data.sort((a, b) => (a["vade tarihi"] > b["vade tarihi"]) ? 1 : -1);
    //push by months
    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["vade tarihi"].getMonth();
        planlananList[ind].push(element["Kdv Dahil"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["planlananSatis"] = planlanansumList;
    
}

function createPortfoydekiCekler(){
    data = rawData["portfoydekiCekler"];
    data.forEach(element => {
        element["Tahsilat Vadesi"] = new Date(parseDateDMY(element["Tahsilat Vadesi"]));
    })
    data.sort((a, b) => (a["Tahsilat Vadesi"] > b["Tahsilat Vadesi"]) ? 1 : -1);
   
    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Tahsilat Vadesi"].getMonth();
        planlananList[ind].push(element["Çek Tutarı"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["portfoydekiCekler"] = planlanansumList;
   
}

function createTahsildekiCekler(){
    data = rawData["tahsildekiCek"];
    data.forEach(element => {
        element["Tahsilat Vadesi"] = new Date(parseDateDMY(element["Tahsilat Vadesi"]));
    })
    data.sort((a, b) => (a["Tahsilat Vadesi"] > b["Tahsilat Vadesi"]) ? 1 : -1);
   
    let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["Tahsilat Vadesi"].getMonth();
        planlananList[ind].push(element["Çek Tutarı"]);
    })
    let planlanansumList = [];
    planlananList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0)
        planlanansumList.push(tmp);
    })
    createdData["tahsildekiCek"] = planlanansumList;

}

function createAlislar(){
    template1({
        tableName: "alislar",
        billdateTag: "Fatura Tarihi",
        parseBillDate: true,
        vadeLimit: 60,
        paymentAmountTag: "Fatura Tutarı",
        dataLabel: "alislar"
    })
}

function createAlisGerceklesenOdeme(){
    template1({
        tableName: "alislar",
        billdateTag: "Fatura Tarihi",
        parseBillDate: true,
        vadeLimit: 60,
        paymentAmountTag: "Gerçekleşen Ödeme",
        dataLabel : "Alışlar Gerçekleşen Ödeme"
    })
}

function createAlisKalanOdeme(){
    template1({
        tableName: "alislar",
        billdateTag: "Fatura Tarihi",
        parseBillDate: true,
        vadeLimit: 60,
        paymentAmountTag: "Kalan Ödeme",
        dataLabel : "Alışlar Kalan Ödeme"
    })
}

function createCariFaaliyetlerAlis(){
    let gerceklesenAlislar = createdData["alislar"];
    let cariFaaliyetlerAlis = [];
    gerceklesenAlislar.forEach(element => {
        cariFaaliyetlerAlis.push(element);
    })
    createdData["Cari Faaliyetler Alış"] = cariFaaliyetlerAlis;
}

function template1(info){
    let data = rawData[info.tableName];
    data.forEach(element => {
        let billdate = new Date(element[info.billdateTag]);
        if(info.parseBillDate){
            billdate = parseDateDMY(element[info.billdateTag]);           
        }
        let vadeDate = new Date(billdate);
        vadeDate.setDate(vadeDate.getDate() + info.vadeLimit);
        if(!element["vade tarihi"]){
            element["vade tarihi"] = vadeDate;  
        }
    })
    data.sort((a, b) => (a["vade tarihi"] > b["vade tarihi"]) ? 1: -1);
    let odemeList = [[], [], [], [], [], [], [], [], [], [], [], []];
    data.forEach(element => {
        let ind = element["vade tarihi"].getMonth();
        odemeList[ind].push(element[info.paymentAmountTag]);
    })
    let odemeSumList = [];
    odemeList.forEach(list => {
        let tmp = list.reduce((a, b) => a + b, 0);
        odemeSumList.push(tmp)
    })
    createdData[info.dataLabel] = odemeSumList;
    return odemeSumList;

}

function parseDateDMY(date){
    let dateArray = date.split(".");
    let newDate = dateArray[1] + "." + dateArray[0] + "." + dateArray[2];
    return newDate;
}