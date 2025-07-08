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