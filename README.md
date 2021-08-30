# kargo-js
Yurtiçi ve Ups Kargo'nun durum bilgisini getirir. Parametrelerinizi dizi olarak verebilir böylece çoklu sorgulama yapabilirsiniz.

Kullanım:
node kargo.js
npm start

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

![yurtici](https://user-images.githubusercontent.com/33135266/131313057-f4266dea-eb35-44ac-bdf0-d8b1dafa58f5.PNG)
![ups](https://user-images.githubusercontent.com/33135266/131313018-50983d25-9ecb-4113-8291-fac0191c4fc1.PNG)


