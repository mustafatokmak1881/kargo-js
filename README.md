# kargo-js
Yurtiçi ve Ups Kargo'nun durum bilgisini getirir. Parametrelerinizi dizi olarak verebilir böylece çoklu sorgulama yapabilirsiniz.

Kullanım:
node kargo.js

Örnek(kargo.js):



yurtici.sorgula(
    [
        '0901W******',
        '0901Y******',
    ]
).then(r=>{
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

