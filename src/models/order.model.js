const mongoose = require("mongoose");
require("../models/dish.model");

const OrderSchema = mongoose.Schema(
    {
        status: {
            type: String, //"open", "closed"
            required: true,
            default: "open"
        },
        openDate: {
            type: Date,
            required: true,
            default: Date.now()
        },
        closeDate: {
            type: Date,
            required: false
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        dishes: [{
            dish: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Dish"
            },
            quantity: {
                type: Number,
                required: true
            },
            canFinish:{
                type: Boolean,
                required: true,
                default: false
            },
            isDone: {
                type: Boolean,
                required: true,
                default: false
            }
        }],
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    })

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;