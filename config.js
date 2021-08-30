module.exports = {
    kargo:{
        yurtici:{
            url:"http://webservices.yurticikargo.com:8080/KOPSWebServices/ShippingOrderDispatcherServices?wsdl",
            wsUserName:"AR********",
            wsPassword:"C1AC7C********",
            wsLanguage:"TR",
            kargo_ismi:"Yurtiçi Kargo"
        },   
        ups:{
            oturum_url:"https://ws.ups.com.tr/wsCreateShipment/wsCreateShipment.asmx",
            url:"http://ws.ups.com.tr/QueryPackageInfo/wsQueryPackagesInfo.asmx",
            customerNumber:"89****",
            username:"Yv6Mm8ShDEe47a******",
            password:"jStZjeNM2aZUN2******",
            kargo_ismi:"UPS Kargo"
        },        
        51506: {
            kargo_adi:"yurtici"
        },
        250806: {
            kargo_adi:"ups"
        }
    }
}

