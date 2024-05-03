import connection from "../Db/Index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../Utils/generateToken.js";
import asyncHandler from "express-async-handler";
// Create a new user
const register = asyncHandler(async (req, res) => {

    const query = 'SELECT * FROM users WHERE Email = ?';
    connection.query(query, [req.body.email], (err, data) => {
        if (err) return res.status(400).send(err);
        if (data.length > 0) return res.status(400).send('Email already exists');

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        const query = "INSERT INTO users (`Full_name`, `Email`, `Password`,`Phone_number`) VALUES (?)";
        const values = [req.body.name, req.body.email, hashedPassword, req.body.phoneNumber];
        console.log(values)

        connection.query(query, [values], (err, data) => {
            if (err) {
                res.status(400).send(err);
            }
            generateToken(res, data.insertId);
            res.status(201).json({ 
                id: data.insertId, 
                name: req.body.name, 
                email: req.body.email ,
                Phone : req.body.phoneNumber
            });
        });
    });
});

// Login a user
const login = asyncHandler(async (req, res) => {
    const query = 'SELECT * FROM users WHERE Email = ?';
    connection.query(query, [req.body.email], (err, data) => {
        if (err) return res.status(400).send(err);
        if (data.length === 0) return res.status(400).send('Email does not exist');
    
        const validPassword = bcrypt.compareSync(req.body.password, data[0].Password);
        if (!validPassword) return res.status(400).send('Invalid password');

        generateToken(res, data[0].id);
        res.status(200).json({ 
            id: data[0].Id, 
            name: data[0].Full_name, 
            email: data[0].Email ,
            Phone : data[0].Phone_number
        });
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
    });
  
    res.status(200).json({ message: "User Logged Out" });
});

const updateuser = asyncHandler(async (req, res) => {
    const query = 'SELECT * FROM users WHERE Email = ?';
    connection.query(query, [req.body.email], (err, data) => {
        if (err) return res.status(400).send(err);
        if (data.length === 0) return res.status(400).send('Email does not exist');


        const query = "UPDATE users SET `Full_name` = ?, `Email` = ?, `Password` = ?, `Phone_number` = ? WHERE `Id` = ?";

        const values = [req.body.name, req.body.email, req.body.password, req.body.phoneNumber, req.body.id];

        connection.query(query, values , (err, data) => {
            if (err) {
                res.status(400).send(err);
            }
            res.status(201).json({ 
                id: req.body.id, 
                name: req.body.name, 
                email: req.body.email ,
                Phone : req.body.phoneNumber
            });
        }
        );
    })

});
    

export { register, login ,logoutUser ,updateuser}