const mongoose=require("mongoose")



ConnectDB()
.then(()=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log(err);
});
async function ConnectDB(){
    await mongoose.connect(process.env.MONGODB_URL);
}


module.exports=ConnectDB;