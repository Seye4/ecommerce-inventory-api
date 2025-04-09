import { Request, Response } from "express"
import productValidationSchema from "./product.validation"
import { ProductServices } from "./product.services"

const createProduct = async (req: Request, res: Response) => {
    try {
        // console.log(req.body);
        const zodParser = productValidationSchema.parse(req.body)
        const result = await ProductServices.createAProductIntoDB(zodParser)

        res.status(200).json({
            success: true,
            message: "Product created successfully",
            data: result
        })
        
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err
        })
    }
}

const getAllProducts = async (req: Request, res: Response) => {

    // const result = await ProductServices.getAllProducts()
    const {searchTerm} = req.query
    const result = await ProductServices.getAllProducts(searchTerm as string)    
    
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: result
    })
    
}

const getSingleProduct = async(req: Request, res: Response) => {
    try {
        const {productId} = req.params
        const result = await ProductServices.getSingleProductFromDB(productId as string)

        res.status(200).json({
            success: true,
            message: "Product Found",
            data: result
        })
        
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err
        })
    }
}

const updateProduct = async(req: Request, res: Response) => {

    try {

        const {productId} = req.params
        const data = req.body
        const result = await ProductServices.updateProductIntoDB(productId, data)

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: result
        })
        
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err
        })
    }
}

const deleteProduct = async(req: Request, res: Response) => {    

    try {

        const {productId} = req.params
        const result = await ProductServices.deleteProductInDB(productId)

        res.status(200).json({
            success: true,
            message: "Product Deleted successfully",
            data: result
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
            error: err
        })
    }
}


export const ProductControllers = {createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct}