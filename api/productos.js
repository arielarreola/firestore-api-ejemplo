const admin = require('firebase-admin')
const express = require('express')
const router = express.Router()
const db = admin.firestore()

router.get('/', async (req, res) => {
    try{
    const snapshot = await db.collection('productos').get()
    const productos = []
    snapshot.forEach((doc) => {
        productos.push({
            id: doc.id,
            ...doc.data()
        })
    })
    res.status(200).json(productos)
    }catch(error){
        res.status(500).json(error.message)
    }
})

router.get('/:id', async (req, res) => {
    try{
    const doc = await db.collection('productos').doc(req.params.id).get()
    if(!doc.exists){
       return res.status(404).json({message: 'Producto no encontrado'})
    }
    return res.status(200).json({
        id: doc.id,
        ...doc.data()
    })
    }catch(error){
        res.status(500).json(error.message)
    }
})

router.post('/', async (req, res) => {
    if (!req.body.nombre || !req.body.precio) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    try {
        const snapshot = await db.collection('productos').get();

        await db.collection('productos').add({
            nombre: req.body.nombre,
            precio: req.body.precio,
        });
        res.status(201).json({ nombre: req.body.nombre, precio: req.body.precio });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        if (!req.body.nombre || !req.body.precio) {
            return res.status(400).json({ error: 'Faltan datos' });
        }
        const docRef = db.collection('productos').doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await docRef.update({
            nombre: req.body.nombre,
            precio: req.body.precio,
        });
        res.status(201).json({ id: req.params.id, nombre: req.body.nombre, precio: req.body.precio });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const docRef = db.collection('productos').doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        await docRef.delete();
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;