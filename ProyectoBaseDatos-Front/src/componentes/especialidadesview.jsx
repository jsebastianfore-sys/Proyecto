import React, { useEffect, useState } from "react";
import { Award, Plus, Search } from "lucide-react";
import { Modal, Form, Input, message, Popconfirm } from "antd";
import axios from "axios";

const API = "https://proyectobs-backend.onrender.com";

export default function EspecialidadesView() {
  // Manejo de Sesión y Permisos idéntico a los módulos anteriores
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN", "USUARIO"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados del Componente
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Cargar las especialidades desde el backend
  const fetchEspecialidades = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/especies`, { headers }); // Cambiar ruta si en tu API es /api/especialidades
      setEspecialidades(res.data.data);
    } catch {
      message.error("Error al cargar las especialidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  // Filtrado reactivo por nombre o descripción clínica
  const filtradas = especialidades.filter(
    (e) =>
      e.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      e.descripcion?.toLowerCase().includes(search.toLowerCase()),
  );

  // Controladores de la ventana modal
  const abrirModal = (especialidad = null) => {
    setEditando(especialidad);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Crear o actualizar especialidad
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();
      if (editando) {
        await axios.patch(
          `${API}/api/especies/${editando.id_especie}`, // Ajustar llave primaria / ruta si es id_especialidad
          values,
          { headers },
        );
        message.success("Especialidad actualizada correctamente");
      } else {
        await axios.post(`${API}/api/especies`, values, { headers });
        message.success("Nueva especialidad registrada");
      }
      cerrarModal();
      fetchEspecialidades();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Eliminar o desactivar especialidad clínica
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/especies/${id}`, { headers });
      message.success("Especialidad eliminada correctamente");
      fetchEspecialidades();
    } catch {
      message.error("Error al eliminar la especialidad");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Cabecera de la sección */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Especialidades
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtradas.length} especialidades médicas configuradas para el
            personal
          </span>
        </div>

        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva especialidad</span>
          </button>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar especialidades por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* Contenedor de la Tabla */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              Cargando especialidades médicas...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">NOMBRE DE LA ESPECIALIDAD</th>
                  <th className="py-4 px-6">DESCRIPCIÓN CLÍNICA</th>
                  {(canEdit || canDelete) && (
                    <th className="py-4 px-6 text-right">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-gray-400">
                      No hay especialidades registradas
                    </td>
                  </tr>
                ) : (
                  filtradas.map((reg) => (
                    <tr
                      key={reg.id_especie}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                        {reg.id_especie}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800">
                        {reg.nombre}
                      </td>
                      <td className="py-4 px-6 text-gray-500 max-w-md truncate">
                        {reg.descripcion || "—"}
                      </td>

                      {(canEdit || canDelete) && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canEdit && (
                              <button
                                onClick={() => abrirModal(reg)}
                                className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                ✏️
                              </button>
                            )}
                            {canDelete && (
                              <Popconfirm
                                title="¿Seguro que deseas eliminar esta especialidad?"
                                onConfirm={() => handleEliminar(reg.id_especie)}
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

      {/* Ventana Modal */}
      <Modal
        title={editando ? "Editar Especialidad" : "Nueva Especialidad"}
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Guardar cambios" : "Crear especialidad"}
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnClose
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              nombre: editando.nombre,
              descripcion: editando.descripcion,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="nombre"
            label="Nombre de la Especialidad"
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
          >
            <Input placeholder="Ej: Cardiología" />
          </Form.Item>

          <Form.Item
            name="descripcion"
            label="Descripción Clínica"
            rules={[
              {
                required: true,
                message: "Por favor ingresa una breve descripción",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Escribe el alcance médico u observaciones de la especialidad..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
