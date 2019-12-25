const router = require("express").Router();
const auth = require("../middlewares/auth");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const role = require("../models/role.model");
const dishService = require("../services/preparingDish.service");

const {
    createBill,
    updateBill,
    getBill,
    deleteBill,
    completeBill,
    addOrder,
} = require("../controllers/bill.controller");

router.get("/get/:idBill", auth([role.ROLE_ADMIN, role.ROLE_WAITER]), asyncMiddleware(getBill));
router.post("/create", auth([role.ROLE_WAITER]), asyncMiddleware(createBill));
router.patch("/update/:idBill", auth([role.ROLE_WAITER]), asyncMiddleware(updateBill));
router.delete("/delete/:idbill", auth([role.ROLE_ADMIN, role.ROLE_WAITER], asyncMiddleware(deleteBill)));
router.post("/complete/:idBill", auth([role.ROLE_CASHIER]), asyncMiddleware(completeBill));
router.post("/addOrder/:idBill", auth([role.ROLE_WAITER]), asyncMiddleware(addOrder));

module.exports = router;