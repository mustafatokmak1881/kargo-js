const yurtici = require('./kargolar/yurtici/yurtici');
const ups = require('./kargolar/ups/ups');

yurtici.sorgula(['0901W781301']).then(r=>{
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