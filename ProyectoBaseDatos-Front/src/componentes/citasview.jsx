import React, { useEffect, useState } from "react";
import { Calendar, Search, Plus } from "lucide-react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const API = "https://proyectobs-backend.onrender.com";

export default function CitasView() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN", "USUARIO"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados del Componente
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Cargar citas desde el backend
  const fetchCitas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/citas`, { headers });
      setCitas(res.data.data);
    } catch {
      message.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  // GET: Auxiliares para llenar los Selects del Modal
  const fetchMascotas = async () => {
    try {
      const res = await axios.get(`${API}/api/mascotas`, { headers });
      setMascotas(res.data.data);
    } catch {
      console.log("Mascotas no disponibles aún");
    }
  };

  const fetchVeterinarios = async () => {
    try {
      const res = await axios.get(`${API}/api/veterinarios`, { headers });
      setVeterinarios(res.data.data);
    } catch {
      console.log("Veterinarios no disponibles aún");
    }
  };

  useEffect(() => {
    fetchCitas();
    fetchMascotas();
    fetchVeterinarios();
  }, []);

  // Lógica de filtrado en tiempo real
  const filtradas = citas.filter(
    (c) =>
      c.mascota?.toLowerCase().includes(search.toLowerCase()) ||
      c.veterinario?.toLowerCase().includes(search.toLowerCase()) ||
      c.motivo?.toLowerCase().includes(search.toLowerCase()) ||
      c.estado?.toLowerCase().includes(search.toLowerCase()),
  );

  // Controladores de Ventana Modal
  const abrirModal = (cita = null) => {
    setEditando(cita);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Guardar o actualizar cita
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();

      // Formatear la fecha y hora combinándolas en la propiedad unica 'fecha_hora' de la BD
      const fechaFormateada = values.fecha.format("YYYY-MM-DD");
      const horaFormateada = values.hora.format("HH:mm:ss");

      const datosFormateados = {
        id_mascota: values.id_mascota,
        id_veterinario: values.id_veterinario,
        fecha_hora: `${fechaFormateada} ${horaFormateada}`, // 👈 Estructura combinada
        motivo: values.motivo,
        observaciones: values.observaciones || null,
        estado: values.estado || "PENDIENTE", // Por defecto al crear
      };

      if (editando) {
        await axios.patch(
          `${API}/api/citas/${editando.id_cita}`,
          datosFormateados,
          { headers },
        );
        message.success("Cita actualizada exitosamente");
      } else {
        await axios.post(`${API}/api/citas`, datosFormateados, { headers });
        message.success("Cita agendada exitosamente");
      }
      cerrarModal();
      fetchCitas();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Remover la cita
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/citas/${id}`, { headers });
      message.success("Cita anulada o eliminada");
      fetchCitas();
    } catch {
      message.error("Error al cancelar la cita");
    }
  };

  // Estilos basados exactamente en los ENUM de tu base de datos (Mayúsculas)
  const getEstadoEstilo = (estado) => {
    switch (estado) {
      case "ATENDIDA":
        return "bg-emerald-100 text-emerald-700";
      case "PENDIENTE":
        return "bg-amber-100 text-amber-700";
      case "CANCELADA":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Cabecera superior */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Calendar className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Citas Médicas
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtradas.length} turnos agendados en total
          </span>
        </div>
        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Cita</span>
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por mascota, veterinario o motivo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* Tabla Dinámica */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              Cargando citas...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">MASCOTA</th>
                  <th className="py-4 px-6">VETERINARIO</th>
                  <th className="py-4 px-6">FECHA</th>
                  <th className="py-4 px-6">HORA</th>
                  <th className="py-4 px-6">MOTIVO</th>
                  <th className="py-4 px-6">OBSERVACIÓN</th>
                  <th className="py-4 px-6">ESTADO</th>
                  {(canEdit || canDelete) && (
                    <th className="py-4 px-6 text-right">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-gray-400">
                      No hay citas registradas
                    </td>
                  </tr>
                ) : (
                  filtradas.map((c) => {
                    // Extraer de forma segura la fecha y hora del string 'fecha_hora' de la base de datos
                    const [fechaCita, horaCita] = c.fecha_hora
                      ? c.fecha_hora.split(" ")
                      : ["—", "—"];

                    return (
                      <tr
                        key={c.id_cita}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                          {c.id_cita}
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-800">
                          {c.mascota || `Paciente #${c.id_mascota}`}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {c.veterinario || `Médico #${c.id_veterinario}`}
                        </td>
                        <td className="py-4 px-6 text-gray-500">{fechaCita}</td>
                        <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                          {horaCita ? horaCita.substring(0, 5) : "—"}{" "}
                          {/* Recorta segundos para estética (HH:MM) */}
                        </td>
                        <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                          {c.motivo || "—"}
                        </td>
                        <td className="py-4 px-6 text-gray-400 max-w-xs truncate font-normal italic">
                          {c.observaciones || "—"}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${getEstadoEstilo(c.estado)}`}
                          >
                            {c.estado}
                          </span>
                        </td>
                        {(canEdit || canDelete) && (
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {canEdit && (
                                <button
                                  onClick={() => abrirModal(c)}
                                  className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                                >
                                  ✏️
                                </button>
                              )}
                              {canDelete && (
                                <Popconfirm
                                  title="¿Anular o eliminar esta cita?"
                                  onConfirm={() => handleEliminar(c.id_cita)}
                                  okText="Sí"
                                  cancelText="No"
                                >
                                  <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                                    🗑️
                                  </button>
                                </Popconfirm>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Formulario Modal Adaptado */}
      <Modal
        title={editando ? "Editar Cita" : "Nueva Cita"}
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Guardar cambios" : "Agendar cita"}
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnHidden // 👈 Cambiado para evitar warnings innecesarios en consola
        afterOpenChange={(open) => {
          if (open && editando) {
            // Segmentar fecha_hora para repoblar los pickers de Ant Design
            const [fechaCita, horaCita] = editando.fecha_hora
              ? editando.fecha_hora.split(" ")
              : [null, null];

            form.setFieldsValue({
              id_mascota: editando.id_mascota,
              id_veterinario: editando.id_veterinario,
              fecha: fechaCita ? dayjs(fechaCita) : null,
              hora: horaCita ? dayjs(`2026-01-01 ${horaCita}`) : null,
              motivo: editando.motivo,
              observaciones: editando.observaciones,
              estado: editando.estado,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          {/* Relación con Mascota */}
          <Form.Item
            name="id_mascota"
            label="Mascota"
            rules={[{ required: true, message: "Selecciona el paciente" }]}
          >
            <Select
              placeholder="Selecciona un paciente"
              showSearch
              optionFilterProp="children"
              className="cursor-pointer"
            >
              {mascotas.map((m) => (
                <Select.Option key={m.id_mascota} value={m.id_mascota}>
                  {m.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Relación con Veterinario */}
          <Form.Item
            name="id_veterinario"
            label="Veterinario Asignado"
            rules={[
              { required: true, message: "Selecciona el médico veterinario" },
            ]}
          >
            <Select
              placeholder="Selecciona un especialista"
              showSearch
              optionFilterProp="children"
              className="cursor-pointer"
            >
              {veterinarios.map((v) => (
                <Select.Option key={v.id_veterinario} value={v.id_veterinario}>
                  {v.nombres} {v.apellidos}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Fecha y Hora en paralelo */}
          <div className="flex gap-4">
            <Form.Item
              name="fecha"
              label="Fecha"
              className="flex-1"
              rules={[{ required: true, message: "Selecciona la fecha" }]}
            >
              <DatePicker className="w-full" placeholder="Seleccionar día" />
            </Form.Item>

            <Form.Item
              name="hora"
              label="Hora"
              className="flex-1"
              rules={[{ required: true, message: "Selecciona la hora" }]}
            >
              <TimePicker
                className="w-full"
                format="HH:mm"
                placeholder="Seleccionar hora"
              />
            </Form.Item>
          </div>

          {/* Campo de control de Estado (Solo visible al editar) */}
          {editando && (
            <Form.Item
              name="estado"
              label="Estado de la Cita"
              rules={[{ required: true }]}
            >
              <Select className="cursor-pointer">
                <Select.Option value="PENDIENTE">PENDIENTE</Select.Option>
                <Select.Option value="ATENDIDA">ATENDIDA</Select.Option>
                <Select.Option value="CANCELADA">CANCELADA</Select.Option>
              </Select>
            </Form.Item>
          )}

          {/* Motivo */}
          <Form.Item
            name="motivo"
            label="Motivo de la consulta"
            rules={[{ required: true, message: "Ingresa el motivo principal" }]}
          >
            <Input placeholder="Ej: Control de vacunas anual o chequeo general" />
          </Form.Item>

          {/* Observación adicional */}
          <Form.Item name="observaciones" label="Observaciones previas / Notas">
            <Input.TextArea
              rows={3}
              placeholder="Ingresa datos clínicos preliminares, ej: viene en ayunas..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
