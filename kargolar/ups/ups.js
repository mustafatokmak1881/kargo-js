const config = require("../../config");
const request = require("request");
const xml2json= require("xml2json");

const output = {
    ups_durum_kodunda_durum_aciklamasi_getir: function( durum_kodu ){
        let durum_kodlari = {
            "1":"GİRİŞ SCAN EDİLDİ",
            "2" : "ALICIYA TESLİM EDİLDİ",
            "3" : "ÖZEL DURUM OLUŞTU",
            "4" : "KURYE DAĞITMAK ÜZERE ÇIKARDI",
            "5" : "KURYE GERİ GETİRDİ",
            "6" : "ŞUBEYE GÖNDERİLDİ",
            "7" : "ŞUBEDEN GELDİ",
            "12" : "K. KONTEYNERE KONDU",
            "15" : "MANİFESTO FAZLASI",
            "16" : "K. KONTEYNERDEN ÇIKTI",
            "17" : "GÖNDERENE İADE AMAÇLI ÇIKIŞ",
            "18" : "MÜŞTERİ TOPLU GİRİŞ",
            "19" : "ŞUBEDE BEKLEYEN",
            "30" : "KONSOLOSLUKTAN TESLİM ALINDI",
            "31" : "ÇAĞRI SONUCU ALINDI",
            "32" : "DEPOYA GİRDİ",
            "33" : "DEPODAN ÇIKTI",
            "34" : "EDI BİLGİ TRANSFER",
            "35" : "MÜŞTERİ DEPODA OKUNDU",
            "36" : "TOPLU DAĞITIMA ÇIKIŞ",
            "37" : "TRANSİT KARŞILAMA",
            "38" : "TRANSİT ÇIKIŞ"
        };

        let r = "";
        if ( durum_kodlari[durum_kodu] ){
            r = durum_kodlari[durum_kodu];
        }
        return r;
    },
    oturum_olustur: async function(){
        let pr = new Promise((resolve, reject) => {

            let xml = `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <Login_Type1 xmlns="http://ws.ups.com.tr/wsCreateShipment">
                  <CustomerNumber>`+config.kargo.ups.customerNumber+`</CustomerNumber>
                  <UserName>`+config.kargo.ups.username+`</UserName>
                  <Password>`+config.kargo.ups.password+`</Password>
                </Login_Type1>
              </soap:Body>
            </soap:Envelope>`;

            let options = {
                url: config.kargo.ups.oturum_url,
                body:xml,
                headers:{
                    "Content-Type":"text/xml"
                }
            }
            request.post(options, (error, response, html) => {
                if( !error && response.statusCode == 200 ){
                    let regexp = new RegExp('<SessionID>(.*)</SessionID>', 'g');
                    let session_id = regexp.exec( html )[1];
                    resolve( {session_id:session_id} );
                }
            });

        });
        return pr;
    },
    referansList_olustur: async function(bolunmus_paket){
        let pr = new Promise((resolve, reject) => {
      
                let referans_listesi = "";
                let string_etiketi = "";
                if ( bolunmus_paket && bolunmus_paket.length> 0 ){
                    bolunmus_paket.forEach((kargo_takip_no,k) => {
                        string_etiketi = "<string>"+kargo_takip_no+"</string>";
                        referans_listesi = referans_listesi+""+string_etiketi;
                    });
                }
    
                resolve( referans_listesi );

        });
        return pr;
    },
    liste_getir: async function( bolunmus_paket, data ){
        let pr = new Promise((resolve, reject) => {
            (async() => {
                let kargo_cevabi = [];
                this.referansList_olustur( bolunmus_paket ).then( referans_listesi => {

                    let xml = `<?xml version="1.0" encoding="utf-8"?>
                        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                        <soap:Body>
                            <GetTransactionsByList_V1 xmlns="http://ws.ups.com.tr/wsPaketIslemSorgulamaEng/">
                            <SessionID>`+data.session_id+`</SessionID>
                            <InformationLevel>1</InformationLevel>
                            <refList>
                                <referansType>WAYBILL_TYPE</referansType>
                                <referansList>
                                `+referans_listesi+`
                                </referansList>
                            </refList>
                            <trnType>LAST_TRANSACTIONS</trnType>
                            </GetTransactionsByList_V1>
                        </soap:Body>
                        </soap:Envelope>`;

    
                    let xml2 =`<?xml version="1.0" encoding="utf-8"?>
                        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                          <soap:Body>
                            <GetTransactionsByList_V1 xmlns="http://ws.ups.com.tr/wsPaketIslemSorgulamaEng/">
                              <SessionID>`+data.session_id+`</SessionID>
                              <InformationLevel>1</InformationLevel>
                              <refList>
                                <referansType>WAYBILL_TYPE</referansType>
                                <referansList>
                                    `+referans_listesi+`
                                </referansList>
                              </refList>
                              <trnType>LAST_TRANSACTIONS</trnType>
                            </GetTransactionsByList_V1>
                          </soap:Body>
                        </soap:Envelope>`;
    

                    

                    let options = {
                        url: config.kargo.ups.url,
                        body: xml2,
                        headers:{
                            "Content-Type":"text/xml"
                        }
                    }
    
    
                    request.post( options, (error, response, html) => {
            
                        let jsn = JSON.parse( xml2json.toJson( html ) );
                       
                        if ( jsn["soap:Envelope"]
                                && jsn["soap:Envelope"]["soap:Body"]
                                && jsn["soap:Envelope"]["soap:Body"]["GetTransactionsByList_V1Response"]
                                && jsn["soap:Envelope"]["soap:Body"]["GetTransactionsByList_V1Response"]["GetTransactionsByList_V1Result"]
                                && jsn["soap:Envelope"]["soap:Body"]["GetTransactionsByList_V1Response"]["GetTransactionsByList_V1Result"]["PackageTransactionwithDeliveryDetail"]
                             )
                        {
                            kargo_cevabi = jsn["soap:Envelope"]["soap:Body"]["GetTransactionsByList_V1Response"]["GetTransactionsByList_V1Result"]["PackageTransactionwithDeliveryDetail"];
                            resolve( kargo_cevabi );
                        }
                        else{
                            resolve( kargo_cevabi );
                        }

                
                    });
    

                });
    
            })()
        });

        return pr;
    },
    sorgula: async function( bolunmus_paket ) {

        let pr = new Promise( (resolve, reject) => {
            this.oturum_olustur().then(data => {
                this.liste_getir(bolunmus_paket, data).then(r=>{
                    resolve( r );
                });
            })

        });

        return pr;

    }
}


module.exports = output;