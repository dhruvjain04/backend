const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userschema = Schema(
    {
        Name:
        {
            type:String,
            required:true
        },
        Email:
        {
            type:String,
            required:true
        },
        Password:
        {
            type:String,
            required:true
        },
        Contact:
        {
            type:Number,
            required:true
        },
        City:
        {
            type:String,
            required:true
        },
        Country:
        {
            type:String,
            required:true
        },
        State:
        {
            type:String,
            required:true
        },
        Products:
        [{
            type:Schema.Types.ObjectId,
            ref:'product'
        }]
    }
)

module.exports=mongoose.model('user',userschema);