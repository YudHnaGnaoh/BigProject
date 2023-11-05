import { configureStore } from "@reduxjs/toolkit";
// import taskReducer from "./taskSlice";
// import brandReducer from '../redux/brandSlice';
// import cateReducer from '../redux/cateSlice';
// import productReducer from "../redux/productSlice";
// import cartReducer from "../redux/cartSlice";

export default configureStore({
    reducer : {
        // brand: brandReducer,
        // carts: cartReducer,
        // cate: cateReducer,
        // product: productReducer,
        // task: taskReducer,
    }
})