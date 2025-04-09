"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const orderValidationSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: "Email is required",
        invalid_type_error: "Name must be a string",
    }),
    productId: zod_1.z.string({
        required_error: "Product ID is required",
        invalid_type_error: "Product ID must be a string of MongoDb _id",
    }),
    quantity: zod_1.z.number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
    }),
    price: zod_1.z.number({
        required_error: "Price of Product is required",
        invalid_type_error: "Price must be a number",
    }),
});
exports.default = orderValidationSchema;
