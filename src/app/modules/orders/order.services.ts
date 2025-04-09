import { OrderModel } from "./order.model";
import { TOrder } from "./order.interface";


const createANewOrder = async (orderData: TOrder) => {
    return await OrderModel.create(orderData)
}

const getAllOrdersFromDB = async ( query :string | undefined ) => {
    const filter = query ? {email: query} : {}
    const data = await OrderModel.find(filter)
    return data
}

export const OrderServices = { createANewOrder, getAllOrdersFromDB }