const { Schema, SchemaTypes, model } = require("mongoose")

const exchangeSchema = new Schema({
    exchange_id:{
        type: SchemaTypes.String,
        unique:true,
        required: true
    },
    name:{
        type: SchemaTypes.String,
        required: true
    },
    website:{
        type: SchemaTypes.String,
        required: true
    },
    iconUrl:{
        type: SchemaTypes.String,
    },
    volume_1day_usd:{
        type: SchemaTypes.Number,
        required: true
    }

},
{ timestamps:true}
)

const Exchanges = model("exchanges", exchangeSchema )
module.exports = Exchanges