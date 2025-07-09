'use client'
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
};

export default function GestorEventos() {
  const [evento, setEvento] = useState<Evento>(InitialStateEvento);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState("");
  const [errores, setErrores] = useState<{[key: string]: string}>({});

  
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Gestor de Eventos Comunitarios
      </h1>
      
      {/* formulario */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editandoId ? "Editar Evento" : "Registrar Nuevo Evento"}
        </h2>
        
        <div className="space-y-4">
          {/* campo de texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Evento
            </label>
            <input
              type="text"
              value={evento.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              placeholder="Ej: Limpieza del parque"
              className={`w-full p-2 border rounded-md ${errores.nombre ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errores.nombre && <span className="text-red-500 text-sm">{errores.nombre}</span>}
          </div>

          {/* campo numérico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Participantes
            </label>
            <input
              type="number"
              value={evento.participantes}
              onChange={(e) => handleInputChange("participantes", parseInt(e.target.value) || 0)}
              min="1"
              placeholder="0"
              className={`w-full p-2 border rounded-md ${errores.participantes ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errores.participantes && <span className="text-red-500 text-sm">{errores.participantes}</span>}
          </div>

          {/* menú desplegable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={evento.categoria}
              onChange={(e) => handleInputChange("categoria", e.target.value)}
              className={`w-full p-2 border rounded-md ${errores.categoria ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Seleccionar categoría</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Educación">Educación</option>
              <option value="Salud">Salud</option>
              <option value="Deportes">Deportes</option>
              <option value="Cultura">Cultura</option>
              <option value="Solidaridad">Solidaridad</option>
            </select>
            {errores.categoria && <span className="text-red-500 text-sm">{errores.categoria}</span>}
          </div>

          {/* area de texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={evento.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              placeholder="Describe el evento, objetivos y actividades..."
              rows={4}
              className={`w-full p-2 border rounded-md ${errores.descripcion ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errores.descripcion && <span className="text-red-500 text-sm">{errores.descripcion}</span>}
          </div>

          {/* campo de fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha del Evento
            </label>
            <input
              type="date"
              value={evento.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
              className={`w-full p-2 border rounded-md ${errores.fecha ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errores.fecha && <span className="text-red-500 text-sm">{errores.fecha}</span>}
          </div>

          {/* botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleRegistrar}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editandoId ? "Actualizar" : "Registrar"}
            </button>
            
            {editandoId && (
              <button
                type="button"
                onClick={handleCancelar}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* lista de eventos */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Eventos Registrados ({eventosFiltrados.length})
          </h2>
          
          {/* filtro */}
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-64"
          />
        </div>

        {eventosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {filtro ? "No se encontraron eventos que coincidan con la búsqueda." : "No hay eventos registrados aún."}
          </p>
        ) : (
          <div className="grid gap-4">
            {eventosFiltrados.map((e) => (
              <div key={e.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-blue-600">{e.nombre}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {e.categoria}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <p><strong>Participantes:</strong> {e.participantes}</p>
                  <p><strong>Fecha:</strong> {new Date(e.fecha).toLocaleDateString()}</p>
                </div>
                
                <p className="text-gray-700 mb-3">{e.descripcion}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(e)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(e.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}