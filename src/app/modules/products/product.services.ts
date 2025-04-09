import { Product } from "./product.model";
import { TProduct } from "./products.interface";


const createAProductIntoDB = async (productData: TProduct) => {
    const result = await Product.create(productData)
    return result
}

const getAllProducts = async (searchTerm = "") => {
    const query = searchTerm ? {name: {$regex: searchTerm, $options: 'i'}} :{}
    const data = await Product.find(query)
    return data
}

const getSingleProductFromDB = async (id: string) => {
    const result = await Product.findById(id)
    return result
}

const updateProductIntoDB = async ( productId: string, data: TProduct) => {
    const result = await Product.findByIdAndUpdate(productId, data, {new: true})
    return result
}

const deleteProductInDB = async (productId: string) => {
    const result = await Product.findByIdAndDelete(productId)
    return result
}

export const ProductServices = { createAProductIntoDB, getAllProducts, getSingleProductFromDB, updateProductIntoDB, deleteProductInDB}