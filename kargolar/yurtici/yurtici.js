const config = require('../../config');
const soap = require("soap");



let output = {
    sorgula: async function( bolunmus_paket ) {
        let pr = new Promise( (resolve, reject) => {
                soap.createClient(config.kargo.yurtici.url, (err,cli) => {
                    let degerler = {
                        wsUserName:config.kargo.yurtici.wsUserName,
                        wsPassword:config.kargo.yurtici.wsPassword,
                        wsLanguage:config.kargo.yurtici.wsLanguage,
                        keys:bolunmus_paket,
                        keyType:0,
                        addHistoricalData:true,
                        onlyTracking:false
                    };
                    cli.queryShipment(degerler, (err, kargo_cevabi) => {
                        if ( kargo_cevabi.ShippingDeliveryVO && kargo_cevabi.ShippingDeliveryVO ){
                            //console.log( {yurtici_kargo_cevabi_x: kargo_cevabi.ShippingDeliveryVO.shippingDeliveryDetailVO} );
                            resolve( kargo_cevabi.ShippingDeliveryVO.shippingDeliveryDetailVO );
                        }
                        else{
                            resolve("");
                        }
                    });
                });
        });
        return pr;
    }
}


module.exports = output;