if(process.env.Node_Env === 'production'){
    module.exports = {mongoURI:""}
}else{
    module.exports ={mongoURI:"mongodb://localhost/vidjot-dev"}
}