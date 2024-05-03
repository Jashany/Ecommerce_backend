import asyncHandler from "express-async-handler";
import connection from "../Db/Index.js";

const placeOrder = async ({props}) => {
    const { userId, billingAdress, items } = props;
    
    // Start transaction
    connection.beginTransaction((err) => {
        if (err) {
            throw err;
        }
        
        // Insert order
        const orderQuery = "INSERT INTO orders (User_id, Shipping_address_id, Status,Total_amount ,Payment_status,Payment_transaction_id) VALUES (?, ?, 'placed', ' paid')";
        connection.query(orderQuery, [userId, billingAdress], (err, result) => {
            if (err) {
                connection.rollback(() => {
                    console.log(err);
                });
            }
            
            const orderId = result.insertId;
            
            // Insert order items
            const orderItemsQuery = "INSERT INTO Order_items (Order_id, Product_id, Product_name, Price, Quantity, Total_amount) VALUES ?";
            const orderItemsValues = items.map(item => [orderId, item.product_id, item.product_name, item.price, item.quantity, item.total_amount]);
            connection.query(orderItemsQuery, [orderItemsValues], (err) => {
                if (err) {
                    connection.rollback(() => {
                        console.log(err);
                    });
                }
                
                // Commit transaction
                connection.commit((err) => {
                    if (err) {
                        connection.rollback(() => {
                            console.log(err);
                        });
                    }
                    
                    console.log({ message: "Order placed successfully", orderId });
                });
            });
        });
    });
}

const getOrderById = asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const query = "SELECT * FROM Orders WHERE Id = ?";
    connection.query(query, [orderId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        if (data.length === 0) {
            res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(data[0]);
    });
});

const getUserOrders = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const query = `
        SELECT 
            Orders.*, 
            order_items.Product_id, 
            order_items.Product_name, 
            order_items.Color, 
            order_items.Size, 
            order_items.Price, 
            order_items.Quantity, 
            order_items.Total_amount 
        FROM 
            Orders 
        INNER JOIN 
            order_items ON Orders.Id = order_items.Order_id 
        WHERE 
            Orders.User_id = ?`;

    connection.query(query, [userId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json(data);
    });
});

export { placeOrder, getOrderById, getUserOrders };
