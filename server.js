const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Conexión a la base de datos
mongoose.connect('mongodb+srv://constrasenadepatatas:puredepatatas@ufv-calidad.8i5b4pw.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  ssl: true,
  sslValidate: true
});

// Definir el esquema y modelo de usuario
const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  edad: Number
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

const app = express();
app.use(bodyParser.json());

// Endpoint POST /save para guardar datos de usuario
app.post('/save', async (req, res) => {
  try {
    const { nombre, email, edad } = req.body;
    const usuario = new Usuario({ nombre, email, edad });
    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario guardado', usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint GET /retrieve para conseguir datos de usuario por email
app.get('/retrieve', async (req, res) => {
  try {
    const { email } = req.query;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en puerto 3000');
});