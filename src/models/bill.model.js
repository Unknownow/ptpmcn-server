const mongoose = require("mongoose");
const Schema = mongoose.Schema

const BillSchema = mongoose.Schema(
    {
        employee: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        customer: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "Customer"
        },
        orders: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Order"
        }],
        totalPrice: {
            type: Number,
            required: true,
            default: 0
        },
        tables: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Table'
        }],
        status: {
            type: String, // eating, pending, finished
            required: true,
            default: "eating"
        },
        finalOrder: [{
            dish: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Dish"
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    },
    {
        timestamps: true
    }
)

BillSchema.post("save", async (doc) => {
    await doc.populate("employee", ["_id", "name"]).execPopulate();
    await doc.populate("tables", ["_id", "name", "isAvailable", "currentBill"]).execPopulate();
    if (doc.finalOrder != undefined)
            for (let i = 0; i < doc.finalOrder.length; i++) {
                await doc.populate("finalOrder." + i + ".dish", ["name", "isAvailable"]).execPopulate();
            }
})

BillSchema.post("find", async (docs) => {
    for (let doc of docs) {
        for (let i = 0; i < doc.orders.length; i++) {
            for (let j = 0; j < doc.orders[i].dishes.length; j++) {
                await doc.populate("orders." + i + ".dishes." + j + ".dish", ["name", "unit"], "Dish").execPopulate();
                await doc.populate("orders." + i + ".dishes." + j + ".dish.unit", ["name"], "DishUnit").execPopulate();
            }
        }
        if (doc.finalOrder != undefined)
            for (let i = 0; i < doc.finalOrder.length; i++) {
                await doc.populate("finalOrder." + i + ".dish", ["name", "isAvailable"]).execPopulate();
            }
    }
})

BillSchema.pre("find", function (next) {
    this.populate("employee", ["_id", "name"]);
    this.populate("tables", ["_id", "name", "isAvailable"]);
    this.populate("orders", ["status", "openDate", "employee", "dishes"]);
    next();
})

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;