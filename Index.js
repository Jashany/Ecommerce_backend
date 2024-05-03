import express from 'express';
import connection from './Db/Index.js';
import userRouter from './Routes/User.routes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cartRouter from './Routes/cart.routes.js';
import orderRouter from './Routes/order.routes.js';
import productRouter from './Routes/products.routes.js';
import wishlistRouter from './Routes/wishlist.routes.js';
import offerRouter from './Routes/offer.routes.js';
import cors from 'cors';
import categoryRouter from './Routes/categories.routes.js';
import { placeOrder } from './Controllers/order.js';
import addressRouter from './Routes/address.routes.js';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51PC7sWSDmPjhFyoElegSxm4RNnht0PNDwUPg1yGusQpQj0RLPl2g6y5eYRR907UwQFA1RaYO5b9wq2NsFXWpnMd500yrZidzsk')

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();


app.use('/api/users', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/offers', offerRouter);
app.use('/api/address', addressRouter);
app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const { userId ,userEmail ,billingAdress} = req.body;

        console.log(billingAdress)
        const query = "SELECT Carts.*, Products.Product_Name, Products.Description, Products.Price, Products.imageUrl FROM Carts INNER JOIN Products ON Carts.Product_id = Products.Id WHERE Carts.User_id = ?";
        
        connection.query(query, [userId], async (err, data) => {
            if (err) {
                console.error("Error fetching cart items:", err);
                return res.status(500).json({ error: "Error fetching cart items" });
            }
            console.log("hello")
            const lineItems = data.map((product) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.Product_Name,
                        images: [product.imageUrl]
                    },
                    unit_amount: product.Price * 100,
                },
                quantity: product.Quantity ,
            }));

            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: lineItems,
                    customer_email:userEmail,
                    shipping_address_collection: {
                        allowed_countries: ['IN', 'US'], // Replace 'IN', 'US', etc. with the desired country codes
                    },
                    mode: "payment",
                    success_url: "http://localhost:5173/success",
                    cancel_url: "http://localhost:5173/cancel",
                });


                
                const deleteQuery = "DELETE FROM Carts WHERE User_id = ?";
                connection.query(deleteQuery, [userId], (deleteErr, deleteResult) => {
                    if (deleteErr) {
                        console.error("Error deleting cart items:", deleteErr);
                    }
                });
                const orderQuery = "INSERT INTO orders (User_id,Payment_status) VALUES (?, 'paid')";

                connection.query(orderQuery, [userId], (err, result) => {
                    if (err) {
                        console.error("Error inserting order:", err);
                    }
                    const orderId = result.insertId;
                    const orderItemsQuery = "INSERT INTO Order_items (Order_id, Product_id, Product_name, Price, Quantity) VALUES ?";
                    const orderItemsValues = data.map(item => [orderId, item.Product_id, item.Product_Name, item.Price, item.Quantity]);
                    connection.query(orderItemsQuery, [orderItemsValues], (err) => {
                        if (err) {
                            console.error("Error inserting order items:", err);
                        }
                        console.log({ message: "Order placed successfully", orderId });
                    });
                });
                
                console.log(session.id)
                res.json({ id: session.id });

            } catch (error) {
                console.error("Error creating checkout session:", error);
                res.status(500).json({ error: "Error creating checkout session" });
            }
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


connection.connect((err) => {
    if (err) {
    console.log('Error connecting to Db');
    return;
    }
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
});
