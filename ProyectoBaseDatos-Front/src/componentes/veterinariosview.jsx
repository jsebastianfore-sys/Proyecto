import React, { useEffect, useState } from "react";
import { ShieldAlert, Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Modal, Form, Input, Select, message, Popconfirm, Tag } from "antd";
import axios from "axios";

const API = "https://proyectobs-backend.onrender.com";

export default function VeterinariosView() {
  // Autenticación y Permisos
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados del Componente
  const [veterinarios, setVeterinarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Obtener cuerpo médico desde la BD
  const fetchVeterinarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/veterinarios`, { headers });
      const data = res.data.data || res.data;
      setUsuarios(Array.isArray(data) ? data : []); // Fallback en caso de retorno plano
      setVeterinarios(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Error al cargar el registro de veterinarios");
    } finally {
      setLoading(false);
    }
  };

  // GET: Auxiliar para cargar las especialidades en el Modal
  const fetchEspecialidades = async () => {
    try {
      const res = await axios.get(`${API}/api/especialidades`, { headers });
      const data = res.data.data || res.data;
      setEspecialidades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("No se pudieron precargar las especialidades médicas");
    }
  };

  useEffect(() => {
    fetchVeterinarios();
    fetchEspecialidades();
  }, []);

  // Búsqueda en tiempo real (Cédula, Nombres, Apellidos o Correo)
  const filtrados = veterinarios.filter(
    (v) =>
      v.nombres?.toLowerCase().includes(search.toLowerCase()) ||
      v.apellidos?.toLowerCase().includes(search.toLowerCase()) ||
      v.cedula?.toString().includes(search) ||
      v.email?.toLowerCase().includes(search.toLowerCase()),
  );

  // Controladores del Modal
  const abrirModal = (vet = null) => {
    setEditando(vet);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Guardar registro
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();

      if (editando) {
        await axios.patch(
          `${API}/api/veterinarios/${editando.id_veterinario}`,
          values,
          { headers },
        );
        message.success("Ficha del veterinario actualizada");
      } else {
        await axios.post(`${API}/api/veterinarios`, values, { headers });
        message.success("Médico veterinario registrado con éxito");
      }
      cerrarModal();
      fetchVeterinarios();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Dar de baja o remover médico
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/veterinarios/${id}`, { headers });
      message.success("Médico removido del sistema");
      fetchVeterinarios();
    } catch (error) {
      message.error("Error al intentar eliminar el registro");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Encabezado Principal */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Cuerpo Médico Veterinario
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtrados.length} especialistas registrados en el sistema
          </span>
        </div>
        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Veterinario</span>
          </button>
        )}
      </div>

      {/* Buscador inteligente */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nombre, apellidos, cédula o email institucional..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* Tabla de Datos proveniente de la Base de Datos */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              Sincronizando plantilla médica...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">CÉDULA</th>
                  <th className="py-4 px-6">MÉDICO VETERINARIO</th>
                  <th className="py-4 px-6">EMAIL INSTITUCIONAL</th>
                  <th className="py-4 px-6">TELÉFONO</th>
                  <th className="py-4 px-6">ESPECIALIDAD</th>
                  <th className="py-4 px-6">ESTADO</th>
                  {(canEdit || canDelete) && (
                    <th className="py-4 px-6 text-right">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-400">
                      No se encontraron profesionales de la salud inscritos
                    </td>
                  </tr>
                ) : (
                  filtrados.map((reg) => (
                    <tr
                      key={reg.id_veterinario}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                        {reg.id_veterinario}
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-mono text-xs">
                        {reg.cedula}
                      </td>
                      <td className="py-4 px-6 text-gray-800 font-bold">
                        {`Dr(a). ${reg.nombres} ${reg.apellidos}`}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-normal">
                        {reg.email}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                        {reg.telefono || "Sin registrar"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md text-xs font-semibold">
                          {reg.nombre_especialidad ||
                            `Especialidad #${reg.id_especialidad}`}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {reg.activo ? (
                          <Tag
                            color="success"
                            className="rounded-full px-2.5 font-bold text-xs"
                          >
                            DISPONIBLE
                          </Tag>
                        ) : (
                          <Tag
                            color="error"
                            className="rounded-full px-2.5 font-bold text-xs"
                          >
                            NO DISPO.
                          </Tag>
                        )}
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canEdit && (
                              <button
                                onClick={() => abrirModal(reg)}
                                className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete && (
                              <Popconfirm
                                title="¿Seguro que deseas remover este veterinario?"
                                onConfirm={() =>
                                  handleEliminar(reg.id_veterinario)
                                }
                                okText="Sí, Eliminar"
                                cancelText="Cancelar"
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

      {/* Formulario de Registro / Modificación */}
      <Modal
        title={
          editando
            ? "Modificar Datos del Profesional"
            : "Dar de Alta Médico Veterinario"
        }
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Actualizar Ficha" : "Registrar Médico"}
        cancelText="Volver"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnHidden // Solución para evitar advertencias de ciclos de vida en Antd Modals
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              cedula: editando.cedula,
              nombres: editando.nombres,
              apellidos: editando.apellidos,
              telefono: editando.telefono,
              email: editando.email,
              id_especialidad: editando.id_especialidad,
              activo: editando.activo !== undefined ? editando.activo : true,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="flex gap-4">
            <Form.Item
              name="cedula"
              label="Documento (Cédula)"
              className="flex-1"
              rules={[
                {
                  required: true,
                  message: "Inserta el documento de identidad",
                },
              ]}
            >
              <Input placeholder="Ej: 10203040" />
            </Form.Item>

            <Form.Item
              name="id_especialidad"
              label="Especialidad Asignada"
              className="flex-1"
              rules={[
                { required: true, message: "Selecciona una área de enfoque" },
              ]}
            >
              <Select placeholder="Selecciona..." className="cursor-pointer">
                {especialidades.map((esp) => (
                  <Select.Option
                    key={esp.id_especialidad}
                    value={esp.id_especialidad}
                  >
                    {esp.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="flex gap-4">
            <Form.Item
              name="nombres"
              label="Nombres"
              className="flex-1"
              rules={[
                { required: true, message: "Nombre de pila obligatorio" },
              ]}
            >
              <Input placeholder="Ej: Carlos" />
            </Form.Item>

            <Form.Item
              name="apellidos"
              label="Apellidos"
              className="flex-1"
              rules={[{ required: true, message: "Apellidos obligatorios" }]}
            >
              <Input placeholder="Ej: Pérez" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Correo Electrónico Institucional"
            rules={[
              {
                required: true,
                message: "El correo es indispensable para el login o contacto",
              },
              {
                type: "email",
                message: "Escribe un correo electrónico formal",
              },
            ]}
          >
            <Input placeholder="ejemplo@vetcore.com" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              name="telefono"
              label="Teléfono Móvil"
              className="flex-1"
              rules={[
                { required: true, message: "Registra un canal telefónico" },
              ]}
            >
              <Input placeholder="Ej: 3001112222" />
            </Form.Item>

            <Form.Item
              name="activo"
              label="Disponibilidad Actual"
              className="flex-1"
              initialValue={true}
            >
              <Select className="cursor-pointer">
                <Select.Option value={true}>Disponible (Activo)</Select.Option>
                <Select.Option value={false}>
                  Inactivo / En Comisión
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
