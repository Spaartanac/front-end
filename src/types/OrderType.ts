import CartType from "./CartType";


export default interface OrderType{
    orderId: number;
    createAt: string;
    cart: CartType;
    status: string;
    
}