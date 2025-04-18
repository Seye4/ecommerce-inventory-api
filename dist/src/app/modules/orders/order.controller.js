"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_validation_1 = __importDefault(require("./order.validation"));
const order_services_1 = require("./order.services");
const product_model_1 = require("../products/product.model");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //zod validation
        const zodValidation = order_validation_1.default.safeParse(req.body);
        if (typeof zodValidation.error !== "undefined" && zodValidation.error.name === "ZodError") {
            const errorLists = zodValidation.error.issues.map((err) => err.message);
            res.status(500).json({
                success: false,
                message: 'Validation Error',
                errors: errorLists
            });
            return;
        }
        if (zodValidation.success) {
            // find the product by Id
            const product = yield product_model_1.Product.findById(zodValidation.data.productId);
            // check if the product quantity in inventory is greater than the requested order
            if (product && product.inventory.quantity < zodValidation.data.quantity) {
                res.status(400).json({
                    success: false,
                    message: "Insufficient quantity available in this Inventory"
                });
                return;
            }
            // if product quantity is enough, get the new quantity of product in the inventory
            if (product) {
                product.inventory.quantity = product.inventory.quantity - zodValidation.data.quantity;
                // update the status of the inventory in stock to true /false
                product.inventory.inStock = product.inventory.quantity === 0 ? false : true;
                //create a new order
                const newOrder = yield order_services_1.OrderServices.createANewOrder(zodValidation.data);
                yield product.save();
                res.status(200).json({
                    success: true,
                    message: "Order placed successfully",
                    data: newOrder
                });
            }
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err
        });
    }
});
const getAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await ProductServices.getAllProducts()
    const email = req.query.email;
    try {
        const orders = yield order_services_1.OrderServices.getAllOrdersFromDB(email);
        if (orders.length === 0) {
            res.status(200).json({
                success: true,
                message: 'No orders found for this email',
                data: []
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'This are the orders for this email',
            data: orders
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err
        });
    }
});
exports.OrderController = { createOrder, getAllOrder };
