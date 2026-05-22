import React, { useEffect, useState } from "react";
import { Users, Plus, Search } from "lucide-react";
import { Modal, Form, Input, message, Popconfirm } from "antd";
import axios from "axios";

const API = "https://proyectobs-backend.onrender.com";

export default function PropietariosView() {
  // Manejo de Sesión y Roles de Usuario
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN", "USUARIO"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados Locales
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Cargar propietarios desde el Backend
  const fetchPropietarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/propietarios`, { headers });
      setPropietarios(res.data.data);
    } catch {
      message.error("Error al cargar el catálogo de propietarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropietarios();
  }, []);

  // Filtrado reactivo (por cédula, nombres o apellidos)
  const filtrados = propietarios.filter(
    (p) =>
      p.cedula?.toLowerCase().includes(search.toLowerCase()) ||
      p.nombres?.toLowerCase().includes(search.toLowerCase()) ||
      p.apellidos?.toLowerCase().includes(search.toLowerCase()),
  );

  // Controladores de Ventana Modal
  const abrirModal = (propietario = null) => {
    setEditando(propietario);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Guardar o editar propietario
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();

      if (editando) {
        await axios.patch(
          `${API}/api/propietarios/${editando.id_propietario}`,
          values,
          { headers },
        );
        message.success("Datos del propietario actualizados");
      } else {
        await axios.post(`${API}/api/propietarios`, values, { headers });
        message.success("Nuevo propietario registrado con éxito");
      }
      cerrarModal();
      fetchPropietarios();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Eliminar propietario
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/propietarios/${id}`, { headers });
      message.success("Propietario removido del sistema");
      fetchPropietarios();
    } catch {
      message.error("Error al intentar eliminar al propietario");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Cabecera del Componente */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Propietarios
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtrados.length} clientes registrados en el sistema
          </span>
        </div>

        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo propietario</span>
          </button>
        )}
      </div>

      {/* Barra de Búsqueda */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por cédula, nombres o apellidos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* Tabla Principal */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              Cargando base de datos de propietarios...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">CÉDULA</th>
                  <th className="py-4 px-6">NOMBRE COMPLETO</th>
                  <th className="py-4 px-6">TELÉFONO</th>
                  <th className="py-4 px-6">EMAIL</th>
                  <th className="py-4 px-6">UBICACIÓN</th>
                  {(canEdit || canDelete) && (
                    <th className="py-4 px-6 text-right">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400">
                      No se encontraron propietarios registrados
                    </td>
                  </tr>
                ) : (
                  filtrados.map((reg) => (
                    <tr
                      key={reg.id_propietario}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs max-w-[120px] truncate">
                        {reg.id_propietario}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-600">
                        {reg.cedula}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800">
                        {reg.nombres} {reg.apellidos}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                        {reg.telefono || "—"}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {reg.email || "—"}
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-xs">
                        {reg.direccion ? `${reg.direccion}, ` : ""}
                        {reg.ciudad}
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
                                title="¿Estás seguro de eliminar a este propietario?"
                                onConfirm={() =>
                                  handleEliminar(reg.id_propietario)
                                }
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

      {/* Ventana Modal - Registro / Edición */}
      <Modal
        title={
          editando
            ? "Modificar Datos del Propietario"
            : "Registrar Nuevo Propietario"
        }
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Actualizar" : "Registrar"}
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnHidden // 👈 Solución para mantener limpia la consola
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              cedula: editando.cedula,
              nombres: editando.nombres,
              apellidos: editando.apellidos,
              telefono: editando.telefono,
              email: editando.email,
              direccion: editando.direccion,
              ciudad: editando.ciudad,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="cedula"
            label="Documento de Identidad (Cédula)"
            rules={[{ required: true, message: "Por favor ingresa la cédula" }]}
          >
            <Input placeholder="Ej: 10000001" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              name="nombres"
              label="Nombres"
              className="flex-1"
              rules={[{ required: true, message: "Ingresa los nombres" }]}
            >
              <Input placeholder="Ej: Juan" />
            </Form.Item>

            <Form.Item
              name="apellidos"
              label="Apellidos"
              className="flex-1"
              rules={[{ required: true, message: "Ingresa los apellidos" }]}
            >
              <Input placeholder="Ej: Pérez" />
            </Form.Item>
          </div>

          <div className="flex gap-4">
            <Form.Item
              name="telefono"
              label="Teléfono de Contacto"
              className="flex-1"
            >
              <Input placeholder="Ej: 3010000001" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Correo Electrónico"
              className="flex-1"
              rules={[
                {
                  type: "email",
                  message: "Ingresa un correo electrónico válido",
                },
              ]}
            >
              <Input placeholder="Ej: juan@gmail.com" />
            </Form.Item>
          </div>

          <div className="flex gap-4">
            <Form.Item
              name="direccion"
              label="Dirección de Residencia"
              className="flex-[2]"
            >
              <Input placeholder="Ej: Calle 10 #11-12" />
            </Form.Item>

            <Form.Item
              name="ciudad"
              label="Ciudad"
              className="flex-1"
              rules={[{ required: true, message: "Especifica la ciudad" }]}
            >
              <Input placeholder="Ej: Bogotá" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
