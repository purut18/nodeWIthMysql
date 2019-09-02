const express = require('express');
const mysql = require('mysql');
const Joi = require('joi');

const app = express();

// this line is to use json in post body
app.use(express.json());

// create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
});


// create DB
app.get('/createDB', (req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database Created...');
    });
});

// create table
app.get('/createPostTable', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id));';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Posts table created...');
    });

});

// insert post
app.post('/addPost', (req, res) => {

    const schema = {
        title: Joi.string().min(3).required(),
        body: Joi.string().min(7).required()
    }

    const result = Joi.validate(req.body, schema);

    if(result.error) {
        res.status(400).send('404 Bad Request');
        return;
    }
    
    // ? is a placeholder for actual data
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, req.body, (err, result) => {
        console.log(req.body);
        res.send('Post Adeded...');
    });
});

// connect
db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySQL Connected');
});

app.listen('3000', () => {
    console.log('Server listening 3000...');
})