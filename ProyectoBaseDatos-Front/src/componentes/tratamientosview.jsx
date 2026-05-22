import React, { useEffect, useState } from "react";
import { Activity, Plus, Search, Edit2, Trash2 } from "lucide-react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";

const API = "https://proyectobs-backend.onrender.com";

export default function TratamientosView() {
  // Manejo de Sesión y Permisos
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN", "USUARIO"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados del Componente
  const [tratamientos, setTratamientos] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Cargar tratamientos desde el backend
  const fetchTratamientos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/tratamientos`, { headers });
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setTratamientos(res.data.data);
      } else if (res.data && Array.isArray(res.data)) {
        setTratamientos(res.data);
      } else {
        setTratamientos([]);
      }
    } catch {
      message.error("Error al cargar los tratamientos");
    } finally {
      setLoading(false);
    }
  };

  // GET: Auxiliares para llenar los Selects del Modal
  const fetchConsultas = async () => {
    try {
      const res = await axios.get(`${API}/api/consultas`, { headers });
      const data = res.data.data || res.data;
      setConsultas(Array.isArray(data) ? data : []);
    } catch {
      console.log("Consultas no disponibles aún");
    }
  };

  const fetchMedicamentos = async () => {
    try {
      const res = await axios.get(`${API}/api/medicamentos`, { headers });
      const data = res.data.data || res.data;
      setMedicamentos(Array.isArray(data) ? data : []);
    } catch {
      console.log("Medicamentos no disponibles aún");
    }
  };

  useEffect(() => {
    fetchTratamientos();
    fetchConsultas();
    fetchMedicamentos();
  }, []);

  // Filtrado en tiempo real por nombre de mascota (si lo trae el join), medicamento o dosis
  const filtrados = tratamientos.filter(
    (t) =>
      t.mascota?.toLowerCase().includes(search.toLowerCase()) ||
      t.medicamento?.toLowerCase().includes(search.toLowerCase()) ||
      t.dosis?.toLowerCase().includes(search.toLowerCase()) ||
      t.frecuencia?.toLowerCase().includes(search.toLowerCase()),
  );

  // Controladores del Modal
  const abrirModal = (tratamiento = null) => {
    setEditando(tratamiento);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Guardar o actualizar tratamiento
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();

      if (editando) {
        await axios.patch(
          `${API}/api/tratamientos/${editando.id_tratamiento}`,
          values,
          { headers },
        );
        message.success("Tratamiento actualizado con éxito");
      } else {
        await axios.post(`${API}/api/tratamientos`, values, { headers });
        message.success("Tratamiento asignado con éxito");
      }
      cerrarModal();
      fetchTratamientos();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Eliminar tratamiento
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/tratamientos/${id}`, { headers });
      message.success("Tratamiento eliminado correctamente");
      fetchTratamientos();
    } catch {
      message.error("Error al eliminar el tratamiento");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Cabecera superior */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Activity className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Tratamientos Clínicos
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtrados.length} procedimientos registrados en total
          </span>
        </div>
        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Tratamiento</span>
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por medicamento, dosis o frecuencia..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* Tabla Dinámica con datos de tu BD */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              Cargando tratamientos...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">CONSULTA</th>
                  <th className="py-4 px-6">MEDICAMENTO</th>
                  <th className="py-4 px-6">DOSIS</th>
                  <th className="py-4 px-6">FRECUENCIA</th>
                  <th className="py-4 px-6">DURACIÓN</th>
                  <th className="py-4 px-6">CANTIDAD</th>
                  {(canEdit || canDelete) && (
                    <th className="py-4 px-6 text-right">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-400">
                      No hay tratamientos registrados
                    </td>
                  </tr>
                ) : (
                  filtrados.map((t) => (
                    <tr
                      key={t.id_tratamiento}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                        {t.id_tratamiento}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {t.mascota
                          ? `${t.mascota} (Ref #${t.id_consulta})`
                          : `Consulta #${t.id_consulta}`}
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {t.medicamento || `Medicamento #${t.id_medicamento}`}
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-mono text-xs">
                        {t.dosis}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {t.frecuencia}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {t.duracion_days}{" "}
                        {t.duracion_days === 1 ? "día" : "días"}
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-gray-600 max-w-[80px]">
                        {t.cantidad} u.
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canEdit && (
                              <button
                                onClick={() => abrirModal(t)}
                                className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete && (
                              <Popconfirm
                                title="¿Eliminar definitivamente este tratamiento?"
                                onConfirm={() =>
                                  handleEliminar(
                                    t.id_treatment || t.id_tratamiento,
                                  )
                                }
                                okText="Sí"
                                cancelText="No"
                              >
                                <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                                  <Trash2 className="w-4 h-4" />
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

      {/* Formulario Modal Basado en tu DB */}
      <Modal
        title={editando ? "Editar Tratamiento" : "Asignar Nuevo Tratamiento"}
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Guardar cambios" : "Asignar tratamiento"}
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnHidden
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              id_consulta: editando.id_consulta,
              id_medicamento: editando.id_medicamento,
              dosis: editando.dosis,
              frecuencia: editando.frecuencia,
              duracion_days: editando.duracion_days,
              cantidad: editando.cantidad,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          {/* Relación con Consulta */}
          <Form.Item
            name="id_consulta"
            label="Consulta Médica de Origen"
            rules={[
              { required: true, message: "Selecciona la consulta de origen" },
            ]}
          >
            <Select
              placeholder="Selecciona el historial o consulta"
              showSearch
              optionFilterProp="children"
              className="cursor-pointer"
            >
              {consultas.map((c) => (
                <Select.Option key={c.id_consulta} value={c.id_consulta}>
                  Consulta #{c.id_consulta}{" "}
                  {c.mascota ? ` - Paciente: ${c.mascota}` : ""}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Relación con Medicamento */}
          <Form.Item
            name="id_medicamento"
            label="Medicamento a Recetar"
            rules={[{ required: true, message: "Selecciona el medicamento" }]}
          >
            <Select
              placeholder="Selecciona de la farmacia"
              showSearch
              optionFilterProp="children"
              className="cursor-pointer"
            >
              {medicamentos.map((m) => (
                <Select.Option key={m.id_medicamento} value={m.id_medicamento}>
                  {m.nombre} ({m.presentacion || "Fármaco"})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Dosis y Frecuencia */}
          <div className="flex gap-4">
            <Form.Item
              name="dosis"
              label="Dosis"
              className="flex-1"
              rules={[{ required: true, message: "Ej: 1 pipeta o 250mg" }]}
            >
              <Input placeholder="Ej: 250mg o 1.5 ml" />
            </Form.Item>

            <Form.Item
              name="frecuencia"
              label="Frecuencia"
              className="flex-1"
              rules={[{ required: true, message: "Ej: Cada 12 horas" }]}
            >
              <Input placeholder="Ej: Cada 8 horas / Diario" />
            </Form.Item>
          </div>

          {/* Duración en días y Cantidad total */}
          <div className="flex gap-4">
            <Form.Item
              name="duracion_days"
              label="Duración (Días)"
              className="flex-1"
              rules={[{ required: true, message: "Ingresa los días" }]}
            >
              <InputNumber min={1} className="w-full" placeholder="Ej: 7" />
            </Form.Item>

            <Form.Item
              name="amount" // Nota: en tu imagen se llama "cantidad" pero revisa si en tu backend mapea directo
              name="cantidad"
              label="Cantidad Total Unidades"
              className="flex-1"
              rules={[{ required: true, message: "Unidades totales" }]}
            >
              <InputNumber min={1} className="w-full" placeholder="Ej: 14" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
