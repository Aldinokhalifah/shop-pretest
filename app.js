require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const axios = require('axios'); 

const expressLayouts = require('express-ejs-layouts');
const app = express();
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES
app.get('/', (req, res) => res.redirect('/products'));

app.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.query(`
        SELECT p.*, s.quantity FROM products p JOIN stock s ON p.id = s.product_id
        ORDER BY p.id
        `);
        res.render('products', { products: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Halaman create purchase (form input pembelian oleh admin)
app.get('/purchase/create', async (req, res) => {
    try {
        const [products] = await pool.query(`
        SELECT p.*, s.quantity FROM products p JOIN stock s ON p.id = s.product_id
        `);
        res.render('create-purchase', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// POST create purchase
app.post('/purchase/create', async (req, res) => {
    const { product_id, quantity, buyer_name } = req.body;
    const qty = parseInt(quantity, 10);
    if (!product_id || !qty || qty <= 0) return res.status(400).send('Input invalid');

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [[stockRow]] = await conn.query('SELECT quantity FROM stock WHERE product_id = ?', [product_id]);
        if (!stockRow) throw new Error('Produk tidak ditemukan');
        if (stockRow.quantity < qty) throw new Error('Stok tidak cukup');

        const [[prod]] = await conn.query('SELECT price FROM products WHERE id = ?', [product_id]);
        if (!prod) throw new Error('Produk tidak ditemukan (price)');

        const total = (prod.price * qty).toFixed(2);

        await conn.query(`INSERT INTO purchases (product_id, quantity, total_price, buyer_name, status) VALUES (?, ?, ?, ?, ?)`, 
        [product_id, qty, total, buyer_name || 'Admin', 'completed']);

        await conn.query(`UPDATE stock SET quantity = quantity - ? WHERE product_id = ?`, [qty, product_id]);

        await conn.commit();
        res.redirect('/purchases');
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(400).send('Error: ' + err.message);
    } finally {
        conn.release();
    }
});

// List purchases
app.get('/purchases', async (req, res) => {
    try {
        const [rows] = await pool.query(`
        SELECT pur.*, p.name as product_name
        FROM purchases pur
        JOIN products p ON pur.product_id = p.id
        ORDER BY pur.created_at DESC
        `);
        res.render('purchases', { purchases: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Cancel purchase (admin)
app.post('/purchase/cancel/:id', async (req, res) => {
    const id = req.params.id;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [[pur]] = await conn.query('SELECT * FROM purchases WHERE id = ?', [id]);
        if (!pur) throw new Error('Pembelian tidak ditemukan');
        if (pur.status === 'cancelled') throw new Error('Sudah dibatalkan');

        await conn.query('UPDATE purchases SET status = ? WHERE id = ?', ['cancelled', id]);
        await conn.query('UPDATE stock SET quantity = quantity + ? WHERE product_id = ?', [pur.quantity, pur.product_id]);

        await conn.commit();
        res.redirect('/purchases');
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(400).send('Error: ' + err.message);
    } finally {
        conn.release();
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
