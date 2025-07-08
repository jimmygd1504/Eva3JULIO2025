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