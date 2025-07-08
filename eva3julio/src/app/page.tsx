import { useState, useEffect } from "react";

interface Evento {
  id: number;
  nombre: string;
  participantes: number;
  categoria: string;
  descripcion: string;
  fecha: string;
}

const InitialStateEvento: Evento = {
  id: 0,
  nombre: "",
  participantes: 0,
  categoria: "",
  descripcion: "",
  fecha: ""
}

  useEffect(() => {
    const eventosGuardados = localStorage.getItem("eventos");
    if (eventosGuardados) {
      const eventosParseados = JSON.parse(eventosGuardados);
      setEventos(eventosParseados);
    }
  }, []);

 
  useEffect(() => {
    if (eventos.length > 0) {
      localStorage.setItem("eventos", JSON.stringify(eventos));
    }
  }, [eventos]);

  const validarCampos = (): boolean => {
    const nuevosErrores: {[key: string]: string} = {};
    
    if (!evento.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    } else if (evento.nombre.length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres";
    }
    
    if (evento.participantes <= 0) {
      nuevosErrores.participantes = "Debe haber al menos 1 participante";
    }
    
    if (!evento.categoria) {
      nuevosErrores.categoria = "Debe seleccionar una categoría";
    }
    
    if (!evento.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida";
    }
    
    if (!evento.fecha) {
      nuevosErrores.fecha = "La fecha es requerida";
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleInputChange = (name: string, value: string | number) => {
    setEvento({
      ...evento,
      [name]: value
    });

     if (errores[name]) {
      setErrores({
        ...errores,
        [name]: ""
      });
    }
  };

  const handleRegistrar = () => {
    if (!validarCampos()) return;
    
    if (editandoId !== null) {
    
      const eventosActualizados = eventos.map(e => 
        e.id === editandoId ? { ...evento, id: editandoId } : e
      );
      setEventos(eventosActualizados);
      setEditandoId(null);
    } else {

      const nuevoEvento = {
        ...evento,
        id: Date.now()
      };
      setEventos([...eventos, nuevoEvento]);
    }
    
    setEvento(InitialStateEvento);
    setErrores({});
  };

  const handleEditar = (eventoAEditar: Evento) => {
    setEvento(eventoAEditar);
    setEditandoId(eventoAEditar.id);
  };

  const handleEliminar = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      const eventosActualizados = eventos.filter(e => e.id !== id);
      setEventos(eventosActualizados);
      localStorage.setItem("eventos", JSON.stringify(eventosActualizados));
    }
  };

  const handleCancelar = () => {
    setEvento(InitialStateEvento);
    setEditandoId(null);
    setErrores({});
  };

  const eventosFiltrados = eventos.filter(e =>
    e.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    e.categoria.toLowerCase().includes(filtro.toLowerCase())
  );