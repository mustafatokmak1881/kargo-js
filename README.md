# kargo-js
Yurtiçi ve Ups Kargo'nun durum bilgisini getirir. Parametrelerinizi dizi olarak verebilir böylece çoklu sorgulama yapabilirsiniz.

Kullanım:
node kargo.js

Örnek(kargo.js):

const yurtici = require('./kargolar/yurtici/yurtici');
const ups = require('./kargolar/ups/ups');

yurtici.sorgula(['0901W******']).then(r=>{
    console.log( {yurtici:r} );
});


ups.sorgula(
    [
        '1Z07V8E88800******', 
        '1Z07V8E46800******'
    ]
    ).then(r=>{

    console.log( {ups:r} )
})

