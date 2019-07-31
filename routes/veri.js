const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../config.json").databaseConfig;


router.get("/", (req, res, next) => {
    res.status(200).render("veri");
})

router.get("/getGerceklesenSatislar", (req, res, next) => {
    //returns a 12 element array
    //get fatura date and budget from satislar
    if(sql){
        sql.close();
    }
    const query = `SELECT [Fatura Tarihi]
    ,[Fatura Tutarı] ,[Gerçekleşen Ödeme] ,[Kalan Ödeme]
    FROM [MikroDB_V15_00].[dbo].[GD_VW_SATISLAR]`
    sql.connect(config, err => {
        if(err){
            console.log(err);            
        }
        new sql.Request().query(query, (err, result) => {
            //add vadedate to each fatura by adding 1 month to every billdate
            result = result.recordset;
            result.forEach(element => {
                let billdate = parseDateDMY(element["Fatura Tarihi"]);
                billdate = new Date(billdate);
                let vadeDate = new Date(billdate);
                //vadeDate.setMonth(vadeDate.getMonth() + 1);
                //vadeDate.addDays(30);
                vadeDate.setDate(vadeDate.getDate()+30);
                element["vade tarihi"] = vadeDate;
                ///

            })
            //sort by vadedate
            result.sort((a, b) => (a["vade tarihi"] > b["vade tarihi"]) ? 1 : -1);
            console.log(result);

            let newList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["vade tarihi"].getMonth();
                newList[ind].push(element["Fatura Tutarı"]);
            })
            let odemeList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["vade tarihi"].getMonth();
                odemeList[ind].push(element["Gerçekleşen Ödeme"]);
            })
            let kalanodemeList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["vade tarihi"].getMonth();
                kalanodemeList[ind].push(element["Kalan Ödeme"]);
            })

            //sum inner list
            let sumList = [];
            let odemeSumList = [];
            let kalanodemeSumList = [];

            newList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                sumList.push(tmp);
            })

            odemeList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                odemeSumList.push(tmp);

            })
            kalanodemeList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                kalanodemeSumList.push(tmp);

            })
            let obj = {
                gerceklesenSatislar: sumList,
                gerceklesenOdemeler: odemeSumList,
                kalanodemeler:  kalanodemeSumList
            }
            console.log(odemeSumList);
            res.status(200).json(obj);
            sql.close();

        })
    })

    //return 12 element list
})

router.get("/getAlislar", (req, res, next) => {

    const query = `SELECT  [Fatura Tarihi]
    ,[Posizyon]
    ,[Fatura Tutarı]
    ,[Gerçekleşen Ödeme]
    ,[Kalan Ödeme]
    ,[Tahslat Durumu]
    FROM [MikroDB_V15_00].[dbo].[GD_VW_ALISLAR]`
    sql.connect(config, err => {
        if(err){
            console.log(err);            
        }
        new sql.Request().query(query, (err, result) => {
            //add vadedate to each fatura by adding 1 month to every billdate
            result = result.recordset;
            result.forEach(element => {
                let billdate = parseDateDMY(element["Fatura Tarihi"]);
                billdate = new Date(billdate);
                let vadeDate = new Date(billdate);
                //vadeDate.setMonth(vadeDate.getMonth() + 1);
                //vadeDate.addDays(30);
                vadeDate.setDate(vadeDate.getDate()+60);
                element["vade tarihi"] = vadeDate;
                ///
            })

            //sort by vadedate
            result.sort((a, b) => (a["vade tarihi"] > b["vade tarihi"]) ? 1 : -1);
            console.log(result);

            let newList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["vade tarihi"].getMonth();
                newList[ind].push(element["Fatura Tutarı"]);
            })
            let odemeList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["vade tarihi"].getMonth();
                odemeList[ind].push(element["Gerçekleşen Ödeme"]);
            })
            let kalanodemeList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["vade tarihi"].getMonth();
                kalanodemeList[ind].push(element["Kalan Ödeme"]);
            })

            //sum inner list
            let sumList = [];
            let odemeSumList = [];
            let kalanodemeSumList = [];

            newList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                sumList.push(tmp);
            })

            odemeList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                odemeSumList.push(tmp);

            })
            kalanodemeList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                kalanodemeSumList.push(tmp);

            })
            let obj = {
                gerceklesenAlislar: sumList,
                gerceklesenOdemeler: odemeSumList,
                kalanodemeler:  kalanodemeSumList
            }
            res.status(200).json(obj);
            sql.close();

        })
    })

})

router.get("/getPlanlananSatislar", (req, res, next) => {
    //returns an 12 element array
    //get bill date and tutar from db
    const query = `SELECT [Fatura Tarihi]
    ,[Tutarı]
    FROM [MikroDB_V15_00].[dbo].[GD_VW_HIZMET_SOZLESMELERI]`;
    sql.connect(config, err => {
        if(err){
            console.log(err);            
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            //add kdv included bill for each record
            result = result.recordset;
            result.forEach(element => {
                element["Kdv Dahil"] = element["Tutarı"]*1.18;
            })
            //add vade date to each record
            result.forEach(element => {
                let billdate = new Date(element["Fatura Tarihi"]);
                let vadeDate = new Date(billdate);

                vadeDate.setDate(vadeDate.getDate()+0);
                element["vade tarihi"] = vadeDate;


            })
            //sort by vade date
            result.sort((a, b) => (a["vade tarihi"] > b["vade tarihi"]) ? 1 : -1);
            //push by months
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["vade tarihi"].getMonth();
                planlananList[ind].push(element["Kdv Dahil"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        });
    });
    //make inner lists
    //sum inner lists
})

router.get("/getTahsildekiCekler", (req, res, next) => {
    //returns 12 value array
    //get from alınan çekler table based on ödendi value
    query = `SELECT [Tahsilat Vadesi]
    ,[Çek Tutarı]
    FROM [MikroDB_V15_00].[dbo].[GD_VW_ALINAN_CEKLER]
    where [GD_VW_ALINAN_CEKLER].[Posizyon] = 'Ödendi'`
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            result.forEach(element => {
                element["Tahsilat Vadesi"] = new Date(parseDateDMY(element["Tahsilat Vadesi"]));
            })
            result.sort((a, b) => (a["Tahsilat Vadesi"] > b["Tahsilat Vadesi"]) ? 1 : -1);
           
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Tahsilat Vadesi"].getMonth();
                planlananList[ind].push(element["Çek Tutarı"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close();
        })
    })
    //fix date
    //sort by date
    //get into months 
})
router.get("/getPortfoydekiCekler", (req, res, next) => {
    //returns 12 value array
    //get from alınan çekler table based on ödendi value
    query = `SELECT [Tahsilat Vadesi]
    ,[Çek Tutarı]
    FROM [MikroDB_V15_00].[dbo].[GD_VW_ALINAN_CEKLER]
    where [GD_VW_ALINAN_CEKLER].[Posizyon] = 'Portföyde'`
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            result.forEach(element => {
                element["Tahsilat Vadesi"] = new Date(parseDateDMY(element["Tahsilat Vadesi"]));
            })
            result.sort((a, b) => (a["Tahsilat Vadesi"] > b["Tahsilat Vadesi"]) ? 1 : -1);
           
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Tahsilat Vadesi"].getMonth();
                planlananList[ind].push(element["Çek Tutarı"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close();
        })
    })
    //fix date
    //sort by date
    //get into months 
})

router.get("/getGuncelBakiye", (req, res, next) => {
    query = `SELECT 
    [İşlem]
    ,[Giriş]
    ,[Çıkış]
    FROM [MikroDB_V15_00].[dbo].[GD_VW_Kasa]`;
    sql.connect(config, err => {
        if(err){
            console.log(err)
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            let kasa = 0;
            result.forEach(element => {
                kasa += element["Giriş"];
                kasa -= element["Çıkış"];
            })
                
            res.status(200).json(kasa);
            sql.close();
            
        })
    })
})

router.get("/getPlanlananGiderler", (req, res, next) => {
    const query = `SELECT [Ödeme Vadesi]
    ,[bna_tutar]
    FROM [MikroDB_V15_00].[dbo].[GD_VW_VERGI]`;
    
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            //fix date
            result.forEach(element => {
                element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
            })
            //sort by date
            result.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);
            //months
            //sum list
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Ödeme Vadesi"].getMonth();
                planlananList[ind].push(element["bna_tutar"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        })
    })
    
})

router.get("/getGerceklesenGiderler", (req, res, next) => {
    const query = `SELECT [Tarih]
                ,[Masraf Tutarı]
                FROM [MikroDB_V15_00].[dbo].[GD_VW_GIDERLER]`;
    
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            //fix date
            result.forEach(element => {
                element["Tarih"] = new Date(parseDateDMY(element["Tarih"]));
                element["Vade"] = new Date(element["Tarih"]);
                //batuhan bey vadeye +5 gün diyor ama
                element["Vade"].setDate(element["Vade"].getDate() + 40);
            })
            //sort by date
            result.sort((a, b) => (a["Vade"] > b["Vade"]) ? 1 : -1);
            //months
            //sum list
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Vade"].getMonth();
                planlananList[ind].push(element["Masraf Tutarı"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        })
    })
    
})


router.get("/getZiraatCek", (req, res, next) => {
    //banka adı ileride ayrıntılı olarak yazılacak
    const query = `SELECT  [Ödeme Tarihi]
    ,[Banka Adı]
    ,[Çek Vadesi]
    ,[Çek Tutarı]
FROM [MikroDB_V15_00].[dbo].[GD_VW_VERILEN_CEKLER] where [Banka Adı] = 'Ziraat'`;
    
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            //fix date
            result.forEach(element => {
                element["Çek Vadesi"] = new Date(parseDateDMY(element["Çek Vadesi"]));
            })
            //sort by date
            result.sort((a, b) => (a["Çek Vadesi"] > b["Çek Vadesi"]) ? 1 : -1);
            //months
            //sum list
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Çek Vadesi"].getMonth();
                planlananList[ind].push(element["Çek Tutarı"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        })
    })
    
})

router.get("/getAlbarakaCek", (req, res, next) => {
    //banka adı ileride ayrıntılı olarak yazılacak
    const query = `SELECT  [Ödeme Tarihi]
    ,[Banka Adı]
    ,[Çek Vadesi]
    ,[Çek Tutarı]
FROM [MikroDB_V15_00].[dbo].[GD_VW_VERILEN_CEKLER] where [Banka Adı] = 'ALBARAKA TÜRK - 0001 NOLU TL HESAP'`;
    
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            //fix date
            result.forEach(element => {
                element["Çek Vadesi"] = new Date(parseDateDMY(element["Çek Vadesi"]));
            })
            //sort by date
            result.sort((a, b) => (a["Çek Vadesi"] > b["Çek Vadesi"]) ? 1 : -1);
            //months
            //sum list
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Çek Vadesi"].getMonth();
                planlananList[ind].push(element["Çek Tutarı"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        })
    })
    
})
router.get("/getAkbankKredi", (req, res, next) => {
    //banka adı ileride ayrıntılı olarak yazılacak
    const query = `SELECT [Banka Adı]
    ,[Ödeme Vadesi]
    ,[Taksit Tutarı]
FROM [MikroDB_V15_00].[dbo].[GD_VW_KREDILER] where [Banka Adı] = 'AKBANK - 2459 NOLU TL HESAP'`;
    
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            //fix date
            result.forEach(element => {
                element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
            })
            //discard !2019
            result = result.filter(element => element["Ödeme Vadesi"].getFullYear() === new Date().getFullYear())
            console.log(result);
            //sort by date
            result.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);
            //months
            //sum list
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Ödeme Vadesi"].getMonth();
                planlananList[ind].push(element["Taksit Tutarı"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        })
    })
    
})

router.get("/getAlbarakaKredi", (req, res, next) => {
    //banka adı ileride ayrıntılı olarak yazılacak
    const query = `SELECT [Banka Adı]
    ,[Ödeme Vadesi]
    ,[Taksit Tutarı]
FROM [MikroDB_V15_00].[dbo].[GD_VW_KREDILER] where [Banka Adı] = 'ALBARAKA TÜRK - 0001 NOLU TL HESAP'`;
    
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            //fix date
            result.forEach(element => {
                element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
            })
            //discard !2019
            result = result.filter(element => element["Ödeme Vadesi"].getFullYear() === new Date().getFullYear())
            console.log(result);
            //sort by date
            result.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);
            //months
            //sum list
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Ödeme Vadesi"].getMonth();
                planlananList[ind].push(element["Taksit Tutarı"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        })
    })
    
})
router.get("/getZiraatKredi", (req, res, next) => {
    //banka adı ileride ayrıntılı olarak yazılacak
    const query = `SELECT [Banka Adı]
    ,[Ödeme Vadesi]
    ,[Taksit Tutarı]
FROM [MikroDB_V15_00].[dbo].[GD_VW_KREDILER] where [Banka Adı] = 'ZİRAAT BANKASI - 5001 NOLU TL HESAP'`;
    
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            //fix date
            result.forEach(element => {
                element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
            })
            //discard !2019
            result = result.filter(element => element["Ödeme Vadesi"].getFullYear() === new Date().getFullYear());
            console.log(result);
            //sort by date
            result.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);
            //months
            //sum list
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Ödeme Vadesi"].getMonth();
                planlananList[ind].push(element["Taksit Tutarı"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        })
    })
    
})

router.get("/getFinansKredi", (req, res, next) => {
    //banka adı ileride ayrıntılı olarak yazılacak
    const query = `SELECT [Banka Adı]
    ,[Ödeme Vadesi]
    ,[Taksit Tutarı]
FROM [MikroDB_V15_00].[dbo].[GD_VW_KREDILER] where [Banka Adı] = 'QNB FİNANS BANK -0787 NOLU TL HESAP'`;
    
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;
            //fix date
            result.forEach(element => {
                element["Ödeme Vadesi"] = new Date(parseDateDMY(element["Ödeme Vadesi"]));
            })
            //discard !2019
            result = result.filter(element => element["Ödeme Vadesi"].getFullYear() === new Date().getFullYear());
            console.log(result);
            //sort by date
            result.sort((a, b) => (a["Ödeme Vadesi"] > b["Ödeme Vadesi"]) ? 1 : -1);
            //months
            //sum list
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let ind = element["Ödeme Vadesi"].getMonth();
                planlananList[ind].push(element["Taksit Tutarı"]);
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        })
    })
    
})

router.get("/getToplamBankaMevduat", (req, res, next) => {
    //banka adı ileride ayrıntılı olarak yazılacak
    const query = `SELECT [Ocak]
    ,[Şubat]
    ,[Mart]
    ,[Nisan]
    ,[Mayıs]
    ,[Haziran]
    ,[Temmuz]
    ,[Ağuston]
    ,[Eylül]
    ,[Ekim]
    ,[Kasım]
    ,[Aralık]
    
FROM [MikroDB_V15_00].[dbo].[GD_VW_Banka]`;
    
    sql.connect(config, err => {
        if(err){
            console.log(err);
        }
        new sql.Request().query(query, (err, result) => {
            if(err){
                console.log(err);
            }
            result = result.recordset;

            //months
            //sum list
            let planlananList = [[], [], [], [], [], [], [], [], [], [], [], []];
            result.forEach(element => {
                let index = 0;
                for(var propertyName in element){
                    planlananList[index].push(element[propertyName]);
                    index++;
                }
            })
            let planlanansumList = [];
            planlananList.forEach(list => {
                let tmp = list.reduce((a, b) => a + b, 0)
                planlanansumList.push(tmp);
            })
            res.status(200).json(planlanansumList);
            sql.close()
        })
    })
    
})


router.get("/test", (req, res, next) => {

})



function createMonthStartEnd(monthIndex){
    const monthStart = new Date(2019, monthIndex -2 , 1);
    const monthEnd = new Date(2019, monthIndex, 0 );
    return {
        start: monthStart,
        end : monthEnd
    }
}

function parseDateDMY(date){
    let dateArray = date.split(".");
    let newDate = dateArray[1] + "." + dateArray[0] + "." + dateArray[2];
    return newDate;
}

module.exports = router;