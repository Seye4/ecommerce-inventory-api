import { Request, Response } from "express"
import orderValidationSchema from "./order.validation"
import { OrderServices } from "./order.services"
import { Product } from "../products/product.model"

const createOrder = async (req: Request, res: Response) => {

    try {       
        //zod validation
        const zodValidation = orderValidationSchema.safeParse(req.body)

        if(typeof zodValidation.error !== "undefined" && zodValidation.error.name === "ZodError")
        {
            const errorLists = zodValidation.error.issues.map((err) => err.message)

            res.status(500).json({
                success: false,
                message: 'Validation Error',
                errors: errorLists
            })
            return
        }

        if(zodValidation.success)
        {
            // find the product by Id
            const product = await Product.findById(zodValidation.data.productId)

            // check if the product quantity in inventory is greater than the requested order
            if(product && product.inventory.quantity < zodValidation.data.quantity)
            {
                res.status(400).json({
                    success: false,
                    message: "Insufficient quantity available in this Inventory"
                })
                return
            }

            // if product quantity is enough, get the new quantity of product in the inventory
            if(product) 
            {
                product.inventory.quantity = product.inventory.quantity - zodValidation.data.quantity
                
                // update the status of the inventory in stock to true /false
                product.inventory.inStock = product.inventory.quantity === 0 ? false : true

                //create a new order
                const newOrder = await OrderServices.createANewOrder(zodValidation.data)

                await product.save()

                res.status(200).json({
                    success: true,
                    message: "Order placed successfully",
                    data: newOrder
                })                
            }
        }        
        
    } 
    catch (err: any) 
    {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err
        })
    }
    
}

const getAllOrder = async (req: Request, res: Response) => {

    // const result = await ProductServices.getAllProducts()
    const email = req.query.email

    try {
        const orders = await OrderServices.getAllOrdersFromDB(email as string | undefined)

        if(orders.length === 0)
        {
            res.status(200).json({
                success: true,
                message: 'No orders found for this email',
                data: []
            })

            return
        }

        res.status(200).json({
            success: true,
            message: 'This are the orders for this email',
            data: orders
        })
    } 
    catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err
        })
    }  
}

export const OrderController = { createOrder, getAllOrder}