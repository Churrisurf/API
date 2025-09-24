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
  contenido: Buffer
});
const Message = mongoose.model('Message', MessageSchema);

const app = express();
app.use(bodyParser.json());

// Claves únicas por método
const CLAVES = {
    POST: 'clave',
    DELETE: 'clave_delete'
};

// POST /message para guardar mensajes de texto
app.post('/message', async (req, res) => {
  try {
    const { nombre, keyword, contenido } = req.body;

    if (keyword !== CLAVES.POST) {
      return res.status(403).json({ error: 'Clave incorrecta para guardar mensaje' });
    }

    if (!nombre || !contenido) {
      return res.status(400).json({ error: 'Faltan campos requeridos: nombre y contenido' });
    }

    const messageData = {
      nombre,
      contenido: Buffer.from(contenido, 'utf-8')
    };

    const new_message = new Message(messageData);
    await new_message.save();
    res.status(201).json({ mensaje: 'Mensaje guardado', new_message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /message para recuperar mensajes de texto
app.get('/message', async (req, res) => {
  try {
    const { nombre, keyword } = req.query;

    if (keyword !== CLAVES.POST) {
      return res.status(403).json({ error: 'Clave incorrecta para obtener mensaje' });
    }

    if (!nombre) {
      return res.status(400).json({ error: 'Falta el campo nombre' });
    }

    const mensaje = await Message.findOne({ nombre });
    if (!mensaje) {
      return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
    }

    res.set('Content-Type', 'text/plain');
    res.send(mensaje.contenido);
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
