import React, { useEffect, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const API = "https://proyectobs-backend.onrender.com";

export default function ConsultasView() {
  // Control de Sesión y Permisos
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN", "USUARIO"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados del Componente
  const [consultas, setConsultas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Cargar consultas médicas
  const fetchConsultas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/consultas`, { headers });
      setConsultas(res.data.data);
    } catch {
      message.error("Error al cargar el historial de consultas");
    } finally {
      setLoading(false);
    }
  };

  // GET: Datos auxiliares para los Selects del formulario
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
    fetchConsultas();
    fetchMascotas();
    fetchVeterinarios();
  }, []);

  // Filtro de búsqueda en tiempo real
  const filtradas = consultas.filter(
    (c) =>
      c.mascota?.toLowerCase().includes(search.toLowerCase()) ||
      c.veterinario?.toLowerCase().includes(search.toLowerCase()) ||
      c.diagnostico?.toLowerCase().includes(search.toLowerCase()),
  );

  // Manejo del Modal
  const abrirModal = (consulta = null) => {
    setEditando(consulta);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Guardar datos en la BD
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();

      // Formatear las fechas a cadenas YYYY-MM-DD para MySQL/PostgreSQL
      const datosFormateados = {
        ...values,
        fecha: values.fecha.format("YYYY-MM-DD"),
        proxima_cita: values.proxima_cita
          ? values.proxima_cita.format("YYYY-MM-DD")
          : null,
      };

      if (editando) {
        await axios.patch(
          `${API}/api/consultas/${editando.id_consulta}`,
          datosFormateados,
          { headers },
        );
        message.success("Consulta clínica actualizada");
      } else {
        await axios.post(`${API}/api/consultas`, datosFormateados, { headers });
        message.success("Historial de consulta registrado");
      }
      cerrarModal();
      fetchConsultas();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Eliminar o desactivar registro
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/consultas/${id}`, { headers });
      message.success("Registro de consulta eliminado");
      fetchConsultas();
    } catch {
      message.error("Error al eliminar la consulta");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Consultas Clínicas
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtradas.length} atenciones médicas en el historial
          </span>
        </div>
        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Consulta</span>
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por mascota, veterinario o diagnóstico..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* Tabla de Historial Clínico */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              Cargando consultas...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">MASCOTA</th>
                  <th className="py-4 px-6">VETERINARIO</th>
                  <th className="py-4 px-6">FECHA</th>
                  <th className="py-4 px-6">DIAGNÓSTICO</th>
                  <th className="py-4 px-6">TEMP.</th>
                  <th className="py-4 px-6">PESO (CONS.)</th>
                  <th className="py-4 px-6">COSTO</th>
                  <th className="py-4 px-6">PRÓX. CITA</th>
                  {(canEdit || canDelete) && (
                    <th className="py-4 px-6 text-right">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
                {filtradas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-16 text-center text-gray-400"
                    >
                      No hay consultas registradas
                    </td>
                  </tr>
                ) : (
                  filtradas.map((c) => (
                    <tr
                      key={c.id_consulta}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                        {c.id_consulta}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800">
                        {c.mascota}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {c.veterinario}
                      </td>
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                        {c.fecha}
                      </td>
                      <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                        {c.diagnostico || "—"}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {c.temperature ? `${c.temperature}°C` : "—"}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {c.peso_consulta ? `${c.peso_consulta} kg` : "—"}
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-800">
                        {c.costo
                          ? `$${Number(c.costo).toLocaleString("es-CO")}`
                          : "—"}
                      </td>
                      <td className="py-4 px-6 text-purple-700 font-semibold font-mono text-xs">
                        {c.proxima_cita ? c.proxima_cita : "Sin programar"}
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
                                title="¿Eliminar esta consulta médica?"
                                onConfirm={() => handleEliminar(c.id_consulta)}
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
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Formulario Modal */}
      <Modal
        title={
          editando ? "Editar Historial de Consulta" : "Registrar Nueva Consulta"
        }
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Guardar cambios" : "Registrar Consulta"}
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnClose
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              id_mascota: editando.id_mascota,
              id_veterinario: editando.id_veterinario,
              fecha: editando.fecha ? dayjs(editando.fecha) : null,
              diagnostico: editando.diagnostico,
              temperature: editando.temperature,
              peso_consulta: editando.peso_consulta,
              costo: editando.costo,
              proxima_cita: editando.proxima_cita
                ? dayjs(editando.proxima_cita)
                : null,
              observaciones: editando.observaciones,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          {/* Fila 1: Mascota */}
          <Form.Item
            name="id_mascota"
            label="Paciente (Mascota)"
            rules={[{ required: true, message: "Selecciona el paciente" }]}
          >
            <Select
              placeholder="Selecciona la mascota"
              showSearch
              optionFilterProp="children"
              className="cursor-pointer"
            >
              {mascotas.map((m) => (
                <Select.Option key={m.id_mascota} value={m.id_mascota}>
                  {m.nombre} ({m.propietario})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Fila 2: Veterinario */}
          <Form.Item
            name="id_veterinario"
            label="Médico Veterinario"
            rules={[
              { required: true, message: "Selecciona el médico encargado" },
            ]}
          >
            <Select
              placeholder="Selecciona el especialista"
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

          {/* Fila 3: Fecha Consulta e Importe Costo */}
          <div className="flex gap-4">
            <Form.Item
              name="fecha"
              label="Fecha de la Consulta"
              className="flex-1"
              rules={[{ required: true, message: "Ingresa la fecha de hoy" }]}
            >
              <DatePicker className="w-full" placeholder="Seleccionar fecha" />
            </Form.Item>

            <Form.Item
              name="costo"
              label="Costo de Consulta ($)"
              className="flex-1"
              rules={[
                { required: true, message: "Ingresa el valor de la consulta" },
              ]}
            >
              <InputNumber className="w-full" min={0} placeholder="Ej: 45000" />
            </Form.Item>
          </div>

          {/* Fila 4: Constantes Vitales (Temperatura y Peso actual) */}
          <div className="flex gap-4">
            <Form.Item
              name="temperature"
              label="Temperatura (°C)"
              className="flex-1"
              rules={[{ required: true, message: "Ingresa la temperatura" }]}
            >
              <InputNumber
                step={0.1}
                className="w-full"
                placeholder="Ej: 38.5"
              />
            </Form.Item>

            <Form.Item
              name="peso_consulta"
              label="Peso en Consulta (kg)"
              className="flex-1"
              rules={[{ required: true, message: "Ingresa el peso actual" }]}
            >
              <InputNumber
                step={0.01}
                className="w-full"
                placeholder="Ej: 12.4"
              />
            </Form.Item>
          </div>

          {/* Fila 5: Diagnóstico Clínico */}
          <Form.Item
            name="diagnostico"
            label="Diagnóstico Médico"
            rules={[{ required: true, message: "Escribe el veredicto médico" }]}
          >
            <Input placeholder="Ej: Gastroenteritis infecciosa leve o Control de rutina" />
          </Form.Item>

          {/* Fila 6: Próxima Cita de Control */}
          <Form.Item
            name="proxima_cita"
            label="Próxima Cita / Control Recomendo (Opcional)"
          >
            <DatePicker
              className="w-full"
              placeholder="Programar fecha de re-evaluación"
            />
          </Form.Item>

          {/* Fila 7: Observaciones detalladas */}
          <Form.Item
            name="observaciones"
            label="Tratamiento recetado o notas clínicas adicionales"
          >
            <Input.TextArea
              rows={3}
              placeholder="Ej: Administrar Amoxicilina 2ml cada 12 horas por 7 días..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
