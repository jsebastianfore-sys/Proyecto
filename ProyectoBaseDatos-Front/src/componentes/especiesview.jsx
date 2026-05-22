import React, { useEffect, useState } from "react";
import { Grid, Plus, Search } from "lucide-react";
import { Modal, Form, Input, message, Popconfirm } from "antd";
import axios from "axios";

const API = "https://proyectobs-backend.onrender.com";

export default function EspeciesView() {
  // Control de Sesión, Roles y Permisos
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN", "USUARIO"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados del Módulo
  const [especies, setEspecies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Cargar las especies desde el backend
  const fetchEspecies = async () => {
    setLoading(true);
    try {
      // Ajusta la ruta aquí si tu endpoint de categorías de animales se llama diferente (ej: /api/categorias-especies)
      const res = await axios.get(`${API}/api/especies`, { headers });
      setEspecies(res.data.data);
    } catch {
      message.error("Error al cargar el catálogo de especies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecies();
  }, []);

  // Filtrado reactivo por clasificación o nombre común
  const filtradas = especies.filter(
    (e) =>
      e.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      e.nombre_comun?.toLowerCase().includes(search.toLowerCase()),
  );

  // Manejo del Modal (Formulario)
  const abrirModal = (especie = null) => {
    setEditando(especie);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Guardar cambios o crear registro
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();

      if (editando) {
        await axios.patch(
          `${API}/api/especies/${editando.id_especie}`,
          values,
          { headers },
        );
        message.success("Clasificación de especie actualizada");
      } else {
        await axios.post(`${API}/api/especies`, values, { headers });
        message.success("Nueva especie catalogada con éxito");
      }
      cerrarModal();
      fetchEspecies();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Eliminar especie del sistema
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/especies/${id}`, { headers });
      message.success("Especie removida del catálogo");
      fetchEspecies();
    } catch {
      message.error("Error al intentar eliminar la especie");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Grid className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Especies
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtradas.length} categorías registradas para control biológico
          </span>
        </div>

        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva especie</span>
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar especies por clasificación o nombre común..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* Tabla General */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              Cargando catálogo biológico...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">CLASIFICACIÓN CLÍNICA</th>
                  <th className="py-4 px-6">NOMBRE COMÚN</th>
                  {(canEdit || canDelete) && (
                    <th className="py-4 px-6 text-right">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-gray-400">
                      No hay registros coincidentes
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
                      <td className="py-4 px-6 text-gray-600">
                        {reg.nombre_comun || "—"}
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
                                title="¿Deseas dar de baja esta especie?"
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

      {/* Modal - Formulario de registro/edición */}
      <Modal
        title={editando ? "Modificar Especie" : "Añadir Nueva Especie"}
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Actualizar" : "Registrar"}
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnHidden // 👈 Solución a la advertencia de AntD aplicada
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              nombre: editando.nombre,
              nombre_comun: editando.nombre_comun,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="nombre"
            label="Clasificación Clínica (Familia / Familia Biológica)"
            rules={[
              {
                required: true,
                message: "Por favor define el término clínico (Ej: Canina)",
              },
            ]}
          >
            <Input placeholder="Ej: Canina, Felina, Aviar, Equina..." />
          </Form.Item>

          <Form.Item
            name="nombre_comun"
            label="Nombre Común"
            rules={[
              {
                required: true,
                message: "Ingresa el nombre coloquial o común de la especie",
              },
            ]}
          >
            <Input placeholder="Ej: Perro, Gato, Pájaro, Caballo..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
