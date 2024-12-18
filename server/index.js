const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Conexion con la BD
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "te20to00",
    database: "veterinaria",
    port: 3306,
});

// BACKEND USUARIOS

// Crear un nuevo usuario
app.post("/create", (req, res) => {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    // Verificar si el correo ya está registrado
    db.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al verificar el correo");
            }
            if (result.length > 0) {
                return res.status(400).send("El correo ya está registrado");
            }

            // Registrar el nuevo usuario
            db.query(
                'INSERT INTO usuarios(nombre, correo, contrasena) VALUES(?,?,?)',
                [nombre, correo, contrasena],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error al registrar el usuario");
                    } else {
                        res.send({ message: 'Usuario registrado exitosamente', data: result });
                    }
                }
            );
        }
    );
});

// Obtener todos los usuarios
app.get("/usuarios", (req, res) => {
    db.query('SELECT * FROM usuarios',
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al cargar los usuarios");
            } else {
                res.send(result);
            }
        }
    );
});

// Actualizar un usuario existente
app.put("/update", (req, res) => {
    const { nombre, correo, contrasena, id } = req.body;

    if (!nombre || !correo || !contrasena || !id) {
        return res.status(400).send("Todos los campos son obligatorios");
    }

    // Verificar si el correo ya está en uso por otro usuario
    db.query(
        'SELECT * FROM usuarios WHERE correo = ? AND id != ?',
        [correo, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al verificar el correo");
            }
            if (result.length > 0) {
                return res.status(400).send("El correo ya está en uso por otro usuario");
            }

            // Actualizar el usuario
            db.query(
                'UPDATE usuarios SET nombre=?, correo=?, contrasena=? WHERE id=?',
                [nombre, correo, contrasena, id],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error al actualizar el usuario");
                    } else {
                        res.send({ message: 'Usuario actualizado exitosamente', data: result });
                    }
                }
            );
        }
    );
});

// Eliminar un usuario
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        'DELETE FROM usuarios WHERE id=?',
        [id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al eliminar el usuario");
            } else {
                res.send({ message: 'Usuario eliminado exitosamente', data: result });
            }
        }
    );
});


// BACKEND MASCOTAS

// Crear una mascota
app.post("/createMascota", (req, res) => {
    const { nombre, especie, edad, id_usuario } = req.body;

    db.query(
        'INSERT INTO mascotas(nombre, especie, edad, id_usuario) VALUES(?,?,?,?)',
        [nombre, especie, edad, id_usuario],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al registrar la mascota");
            } else {
                res.send(result);
            }
        }
    );
});

// Obtener todas las mascotas
app.get("/mascotas", (req, res) => {
    db.query('SELECT * FROM mascotas',
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al cargar las mascotas");
            } else {
                res.send(result);
            }
        }
    );
});

// Actualizar una mascota
app.put("/updateMascota", (req, res) => {
    const { nombre, especie, edad, id_usuario, id } = req.body;

    db.query(
        'UPDATE mascotas SET nombre=?, especie=?, edad=?, id_usuario=? WHERE id=?',
        [nombre, especie, edad, id_usuario, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al actualizar la mascota");
            } else {
                res.send(result);
            }
        }
    );
});

// Eliminar una mascota
app.delete("/deleteMascota/:id", (req, res) => {
    const id = req.params.id;
    db.query(
        'DELETE FROM mascotas WHERE id=?', [id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al eliminar la mascota");
            } else {
                res.send(result);
            }
        }
    );
});


// BACKEND productos


// Crear un producto
app.post("/createProducto", (req, res) => {
    const { nombre, descripcion, precio, contenido, cantidadUnidades, imagen } = req.body;

    db.query(
        'INSERT INTO productos(nombre, descripcion, precio, contenido, cantidadUnidades, imagen) VALUES(?,?,?,?,?,?)',
        [nombre, descripcion, precio, contenido, cantidadUnidades, imagen],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al registrar el producto");
            } else {
                res.send(result);
            }
        }
    );
});

// Obtener todos los productos
app.get("/productos", (req, res) => {
    db.query('SELECT * FROM productos',
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al cargar los productos");
            } else {
                res.send(result);
            }
        }
    );
});

// Actualizar un producto
app.put("/updateProducto", (req, res) => {
    const { nombre, descripcion, precio, contenido, cantidadUnidades, imagen, cod } = req.body;

    db.query(
        'UPDATE productos SET nombre=?, descripcion=?, precio=?, contenido=?, cantidadUnidades=?, imagen=? WHERE cod=?',
        [nombre, descripcion, precio, contenido, cantidadUnidades, imagen, cod],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al actualizar el producto");
            } else {
                res.send(result);
            }
        }
    );
});

// Eliminar un producto
app.delete("/deleteProducto/:cod", (req, res) => {
    const cod = req.params.cod;
    db.query(
        'DELETE FROM productos WHERE cod=?', [cod],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al eliminar el producto");
            } else {
                res.send(result);
            }
        }
    );
});

app.listen(3001, () => {
    console.log("Corriendo en el puerto 3001");
});


app.post('/actualizar-stock', (req, res) => {
    const productos = req.body.productos; // Array de {cod, cantidadVendida}
    let errores = [];

    productos.forEach((producto) => {
        const { cod, cantidadVendida } = producto;
        connection.query(
            'UPDATE productos SET cantidadUnidades = cantidadUnidades - ? WHERE cod = ? AND cantidadUnidades >= ?',
            [cantidadVendida, cod, cantidadVendida],
            (error, results) => {
                if (error || results.affectedRows === 0) {
                    errores.push(`Error con el producto ${cod}`);
                }
            }
        );
    });

    if (errores.length > 0) {
        return res.status(400).json({ message: 'Errores al actualizar stock', errores });
    }

    res.status(200).json({ message: 'Stock actualizado correctamente' });
});


// BACKEND CITAS
app.post("/createCitas", (req, res) => {
    const { fecha, hora, id_mascota, id_usuario, especie, nivel_urgencia } = req.body;

    // Verificar si ya existe una cita en la misma fecha y hora
    db.query(
        'SELECT * FROM citas WHERE fecha = ? AND hora = ?',
        [fecha, hora],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al verificar citas");
            }

            // Si ya existe una cita en esa fecha y hora, enviar mensaje de error
            if (result.length > 0) {
                return res.status(400).send("Por favor, introducir otra hora y fecha"); 
            }

            // Si no existe, proceder a insertar la nueva cita
            db.query(
                'INSERT INTO citas(fecha, hora, id_mascota, id_usuario, especie, nivel_urgencia) VALUES(?,?,?,?,?,?)',
                [fecha, hora, id_mascota, id_usuario, especie, nivel_urgencia],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error al registrar la cita");
                    } else {
                        res.send(result);
                    }
                }
            );
        }
    );
});

app.get("/citas", (req, res) => {
    db.query('SELECT * FROM citas',
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al cargar las citas");
            } else {
                res.send(result);
            }
        }
    );
});

app.put("/updateCitas/:id", (req, res) => {
    const { fecha, hora, id_mascota, id_usuario, especie, nivel_urgencia } = req.body;
    const id = req.params.id; // Obtener el ID de la cita desde los parámetros de la URL

    db.query(
        'UPDATE citas SET fecha=?, hora=?, id_mascota=?, id_usuario=?, especie=?, nivel_urgencia=? WHERE id=?',
        [fecha, hora, id_mascota, id_usuario, especie, nivel_urgencia, id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al actualizar la cita");
            } else {
                res.send(result);
            }
        }
    );
});

app.delete("/deleteCitas/:id", (req, res) => {
    const id = req.params.id;
    db.query(
        'DELETE FROM citas WHERE id=?', [id],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error al eliminar la cita");
            } else {
                res.send(result);
            }
        }
    );
});





