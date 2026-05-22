import React, { useEffect, useState } from "react";
import { User, Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Modal, Form, Input, Select, message, Popconfirm, Tag } from "antd";
import axios from "axios";

const API = "https://proyectobs-backend.onrender.com";

export default function UsuariosView() {
  // Manejo de Sesión y Roles
  const userLogueado = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rolLogueado = userLogueado.rol;

  // Restricciones de Seguridad: Solo perfiles administrativos manipulan credenciales
  const tieneAccesoTotal = ["SUPERADMIN", "ADMIN"].includes(rolLogueado);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados del Componente
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Traer cuentas de usuario
  const fetchUsuarios = async () => {
    if (!tieneAccesoTotal) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/usuarios`, { headers });
      const data = res.data.data || res.data;
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Error al cargar la lista de usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Filtrado por coincidencia en Username o Correo Electrónico
  const filtrados = usuarios.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  // Modales
  const abrirModal = (usuario = null) => {
    setEditando(usuario);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Guardar cambios
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();

      if (editando) {
        // Al editar, si el password_hash va vacío, el backend no debería actualizarlo
        await axios.patch(
          `${API}/api/usuarios/${editando.id_usuario}`,
          values,
          { headers },
        );
        message.success("Usuario actualizado correctamente");
      } else {
        await axios.post(`${API}/api/usuarios`, values, { headers });
        message.success("Nueva cuenta registrada con éxito");
      }
      cerrarModal();
      fetchUsuarios();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Desactivar o Eliminar de la base de datos
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/usuarios/${id}`, { headers });
      message.success("Usuario removido con éxito");
      fetchUsuarios();
    } catch {
      message.error("No se pudo procesar la baja del usuario");
    }
  };

  if (!tieneAccesoTotal) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold bg-red-50 rounded-2xl border border-red-200">
        No tienes permisos suficientes para auditar o gestionar las cuentas de
        usuario de VetCore.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <User className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Control de Usuarios
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtrados.length} accesos credenciales listados
          </span>
        </div>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por alias (username) o correo institucional..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* Tabla */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              Sincronizando cuentas con el servidor...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">USERNAME (ALIAS)</th>
                  <th className="py-4 px-6">EMAIL DE CONTACTO</th>
                  <th className="py-4 px-6">ROL</th>
                  <th className="py-4 px-6">ESTADO</th>
                  <th className="py-4 px-6 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      Ningún usuario coincide con los criterios
                    </td>
                  </tr>
                ) : (
                  filtrados.map((reg) => (
                    <tr
                      key={reg.id_usuario}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                        {reg.id_usuario}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800">
                        {reg.username}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-normal">
                        {reg.email}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            ["SUPERADMIN", "ADMIN"].includes(
                              reg.role || reg.rol,
                            )
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {reg.role || reg.rol}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {reg.activo ? (
                          <Tag
                            color="success"
                            className="rounded-full px-2.5 font-bold text-xs"
                          >
                            ACTIVO
                          </Tag>
                        ) : (
                          <Tag
                            color="error"
                            className="rounded-full px-2.5 font-bold text-xs"
                          >
                            INACTIVO
                          </Tag>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModal(reg)}
                            className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <Popconfirm
                            title="¿Inhabilitar o borrar permanentemente este usuario?"
                            onConfirm={() => handleEliminar(reg.id_usuario)}
                            okText="Eliminar"
                            cancelText="Cancelar"
                          >
                            <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Popconfirm>
                        </div>
                      </td>
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
          editando
            ? "Modificar Cuenta de Usuario"
            : "Crear Nueva Credencial Interna"
        }
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Aplicar Cambios" : "Dar de Alta"}
        cancelText="Descartar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnHidden // Solución al warning de la consola
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              username: editando.username,
              email: editando.email,
              rol: editando.role || editando.rol,
              activo: editando.activo !== undefined ? editando.activo : true,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="username"
            label="Username (Nombre de usuario)"
            rules={[
              {
                required: true,
                message: "El identificador de acceso es obligatorio",
              },
            ]}
          >
            <Input placeholder="Ej: dr_mendoza" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: "Inserta un email de contacto" },
              { type: "email", message: "Escribe una dirección válida" },
            ]}
          >
            <Input placeholder="usuario@vetcore.com" />
          </Form.Item>

          {/* Input de Clave: Obligatorio solo si es cuenta nueva */}
          <Form.Item
            name="password"
            label={
              editando
                ? "Contraseña (Dejar vacío para mantener la actual)"
                : "Contraseña de Acceso"
            }
            rules={[
              {
                required: !editando,
                message: "Establece una clave de seguridad primaria",
              },
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              name="rol"
              label="Rol Operativo"
              className="flex-1"
              rules={[
                { required: true, message: "Asigna un nivel de privilegios" },
              ]}
            >
              <Select
                placeholder="Selecciona un rol"
                className="cursor-pointer"
              >
                <Select.Option value="SUPERADMIN">SUPERADMIN</Select.Option>
                <Select.Option value="ADMIN">ADMIN</Select.Option>
                <Select.Option value="USUARIO">USUARIO</Select.Option>
                <Select.Option value="CONSULTA">CONSULTA</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="activo"
              label="Estado de Cuenta"
              className="flex-1"
              initialValue={true}
            >
              <Select className="cursor-pointer">
                <Select.Option value={true}>Habilitado (Activo)</Select.Option>
                <Select.Option value={false}>
                  Suspendido (Inactivo)
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
