

const createdTF = ()=>{
    return Math.round(Math.random());
};


const createdOneGua = ()=>{
    let gua = [createdTF(),createdTF(),createdTF()];
    let count = 0;
    //console.log(gua);
    gua.forEach(item=>{
        count+=item;
    });
    return{
        TF:count<=1?0:1,
        Type:(count===0||count===3)&&true
    }
};


module.exports = {
    createdOneGua:createdOneGua
};