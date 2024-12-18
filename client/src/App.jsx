import { getAuth, signInAnonymously } from "firebase/auth";
import { getToken, onMessage } from 'firebase/messaging';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

import { messaging } from './firebase';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Mascotas from './Mascotas';
import Productos from './Productos';
import Citas from './Citas';
import './styles/App.css';
import './styles/Footer.css';
import './styles/Header.css';
import Usuarios from './Usuarios';
import Ventas from './Ventas';



function App() {

   // Función de inicio de sesión anónimo
   const loginAnonymously = () => {
    signInAnonymously(getAuth())
      .then((user) => console.log("Inicio de sesión anónimo exitoso", user))
      .catch((error) => console.error("Error en inicio de sesión anónimo", error));
  };

    // Función para activar el token de notificación
    const enableNotifications = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: "BAn-7aFkPFpuVq1tjG1x3ox1VsnFgqQtLoV1uMY5-8V7axoy1U8VgUx7vIRTPUbtGbyCNlRiJn81QZNyPIHJQxA",
        });
        if (token) {
          console.log("Token de notificación:", token);
        } else {
          console.warn("No se pudo obtener el token de notificación.");
        }
      } catch (error) {
        console.error("Error al obtener el token de notificación:", error);
      }
    };
  
    // Registrar el Service Worker
    useEffect(() => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log("Service Worker registrado exitosamente:", registration);
          })
          .catch((error) => {
            console.error("Error al registrar el Service Worker:", error);
          });
      }
  
      onMessage(messaging, (message) => {
        console.log("Mensaje en primer plano recibido:", message);
  
        // Mostrar notificación push en el navegador
        if (Notification.permission === 'granted') {
          new Notification(message.notification.title, {
            body: message.notification.body,
            icon: '/icon.png' // Asegúrate de tener un icono en tu proyecto
          });
        } else {
          toast(message.notification.title); // Fallback en caso de que las notificaciones no estén habilitadas
        }
      });
    }, []);
    
  return (
    <div className="App">
      <Header />
      <main>
        <ToastContainer />
        <button onClick={loginAnonymously}>Iniciar sesión anónimo</button>
        <button onClick={enableNotifications}>Habilitar notificaciones</button>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/mascotas" element={<Mascotas />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/ventas" element={<Ventas />} />
          
          
          
    


        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
