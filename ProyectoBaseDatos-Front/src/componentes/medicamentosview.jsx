import React, { useEffect, useState } from "react";
import { Pill, Plus, Search } from "lucide-react";
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

export default function MedicamentosView() {
  // Manejo de Sesión y Roles de Usuario
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN", "USUARIO"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados Locales
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Cargar inventario desde el Backend
  const fetchMedicamentos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/medicamentos`, { headers });
      setMedicamentos(res.data.data);
    } catch {
      message.error("Error al sincronizar el inventario de medicamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  // Filtrado reactivo multidimensional (Nombre, Principio Activo o Presentación)
  const filtrados = medicamentos.filter(
    (m) =>
      m.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      m.principio_act?.toLowerCase().includes(search.toLowerCase()) ||
      m.presentacion?.toLowerCase().includes(search.toLowerCase()),
  );

  // Controladores de Ventana Modal
  const abrirModal = (medicamento = null) => {
    setEditando(medicamento);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Operaciones de escritura de la Farmacia
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();

      if (editando) {
        await axios.patch(
          `${API}/api/medicamentos/${editando.id_medicamento}`,
          values,
          { headers },
        );
        message.success("Ficha del medicamento actualizada con éxito");
      } else {
        // Al crear un nuevo fármaco, lo enviamos activo por defecto como dicta la BD
        const nuevoRegistro = { ...values, activo: "TRUE" };
        await axios.post(`${API}/api/medicamentos`, nuevoRegistro, { headers });
        message.success("Nuevo medicamento incorporado al inventario");
      }
      cerrarModal();
      fetchMedicamentos();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Dar de baja o eliminar el fármaco
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/medicamentos/${id}`, { headers });
      message.success("Medicamento retirado del catálogo");
      fetchMedicamentos();
    } catch {
      message.error("Error al intentar remover el medicamento");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Cabecera del Componente */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Pill className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Farmacia e Insumos
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtrados.length} fármacos clínicos identificados en stock
          </span>
        </div>

        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo medicamento</span>
          </button>
        )}
      </div>

      {/* Barra de Búsqueda Avanzada */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nombre comercial, principio activo o presentación..."
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
              Sincronizando existencias de farmacia...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">MEDICAMENTO</th>
                  <th className="py-4 px-6">PRINCIPIO ACTIVO</th>
                  <th className="py-4 px-6">PRESENTACIÓN</th>
                  <th className="py-4 px-6">STOCK DISPONIBLE</th>
                  <th className="py-4 px-6">PRECIO UNITARIO</th>
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
                      No hay existencias farmacéuticas registradas
                    </td>
                  </tr>
                ) : (
                  filtrados.map((reg) => (
                    <tr
                      key={reg.id_medicamento}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                        {reg.id_medicamento}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800">
                        {reg.nombre}
                      </td>
                      <td className="py-4 px-6 text-gray-500 italic">
                        {reg.principio_act}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-md text-xs">
                          {reg.presentacion}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${reg.stock <= 10 ? "text-rose-600 font-bold" : "text-amber-800"}`}
                        >
                          {reg.stock} uds
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800">
                        ${Number(reg.precio_unit || 0).toLocaleString("es-CO")}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            reg.activo === "TRUE" || reg.activo === true
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {reg.activo === "TRUE" || reg.activo === true
                            ? "Disponible"
                            : "Agotado"}
                        </span>
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
                                title="¿Estás seguro de que deseas retirar este fármaco del catálogo?"
                                onConfirm={() =>
                                  handleEliminar(reg.id_medicamento)
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

      {/* Ventana Modal - Gestión Controlada de Inventario */}
      <Modal
        title={
          editando
            ? `Editar Medicamento - ID #${editando.id_medicamento}`
            : "Ingresar Nuevo Medicamento"
        }
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Actualizar Ficha" : "Registrar Insumo"}
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnHidden // 👈 Solución aplicada para limpiar la consola
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              nombre: editando.nombre,
              principio_act: editando.principio_act,
              presentacion: editando.presentacion,
              stock: editando.stock,
              precio_unit: editando.precio_unit,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="nombre"
            label="Nombre Comercial y Concentración"
            rules={[
              {
                required: true,
                message: "Ingresa el nombre comercial (Ej: Amoxicilina 500mg)",
              },
            ]}
          >
            <Input placeholder="Ej: Amoxicilina 500mg o Meloxicam Gotas" />
          </Form.Item>

          <Form.Item
            name="principio_act"
            label="Principio Activo"
            rules={[
              {
                required: true,
                message: "Define el componente activo principal",
              },
            ]}
          >
            <Input placeholder="Ej: Ivermectina, Fipronil, Meloxicam..." />
          </Form.Item>

          <Form.Item
            name="presentacion"
            label="Presentación Médica"
            rules={[
              {
                required: true,
                message: "Selecciona el formato de distribución",
              },
            ]}
          >
            <Select
              placeholder="Seleccionar formato"
              className="cursor-pointer"
            >
              <Select.Option value="Cápsulas">Cápsulas</Select.Option>
              <Select.Option value="Tabletas">Tabletas</Select.Option>
              <Select.Option value="Inyectable">Inyectable</Select.Option>
              <Select.Option value="Pipeta">Pipeta</Select.Option>
              <Select.Option value="Jarabe / Gotas">
                Jarabe / Gotas
              </Select.Option>
              <Select.Option value="Crema / Pomada">
                Crema / Pomada
              </Select.Option>
            </Select>
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              name="stock"
              label="Cantidad en Stock"
              className="flex-1"
              rules={[
                {
                  required: true,
                  message: "Ingresa las existencias físicas iniciales",
                },
              ]}
            >
              <InputNumber className="w-full" min={0} placeholder="0" />
            </Form.Item>

            <Form.Item
              name="precio_unit"
              label="Precio Unitario ($)"
              className="flex-1"
              rules={[
                {
                  required: true,
                  message: "Asigna el precio unitario de venta",
                },
              ]}
            >
              <InputNumber
                className="w-full text-emerald-800 font-semibold"
                min={0}
                placeholder="0"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
