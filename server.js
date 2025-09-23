const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Conexión a la base de datos
mongoose.connect('mongodb+srv://JordanTorunarijna:ChristophBaumgartner@michaelolise.xtapt6v.mongodb.net/?retryWrites=true&w=majority&appName=MichaelOlise', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Esquema y modelo de mensaje
const MessageSchema = new mongoose.Schema({
    nombre: { type: String, unique: true },
    contenido: String,
});
const Message = mongoose.model('Message', MessageSchema);

const app = express();
app.use(bodyParser.json());

// Claves únicas por método
const CLAVES = {
    POST: 'clave_post',
    GET: 'clave_get',
    DELETE: 'clave_delete'
};

// POST /message
app.post('/message', async (req, res) => {
    const { keyword, nombre, contenido } = req.body;
    if (keyword !== CLAVES.POST) {
        return res.status(403).json({ mensaje: 'Clave incorrecta para POST' });
    }
    try {
        const new_message = new Message({ nombre, contenido });
        await new_message.save();
        res.status(201).json({ mensaje: 'Mensaje guardado', new_message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /message
app.get('/message', async (req, res) => {
    const { keyword, nombre } = req.query;
    if (keyword !== CLAVES.GET) {
        return res.status(403).json({ mensaje: 'Clave incorrecta para GET' });
    }
    try {
        const new_message = await Message.findOne({ nombre });
        if (!new_message) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }
        res.json(new_message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /message
app.delete('/message', async (req, res) => {
    const { keyword, nombre } = req.query;
    if (keyword !== CLAVES.DELETE) {
        return res.status(403).json({ mensaje: 'Clave incorrecta para eliminar mensaje' });
    }
    try {
        const result = await Message.deleteOne({ nombre });
        if (result.deletedCount === 0) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }
        res.json({ mensaje: 'Mensaje eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /messages
app.delete('/messages', async (req, res) => {
    const { keyword } = req.query;
    if (keyword !== CLAVES.DELETE) {
        return res.status(403).json({ mensaje: 'Clave incorrecta para eliminar todos los mensajes' });
    }
    try {
        await Message.deleteMany({});
        res.json({ mensaje: 'Todos los mensajes eliminados' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor iniciado');
});