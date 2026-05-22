import React, { useEffect, useState } from "react";
import { Heart, Plus, Search } from "lucide-react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";

const API = "https://proyectobs-backend.onrender.com";

export default function MascotasView() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN", "USUARIO"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  const [mascotas, setMascotas] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [propietarios, setPropietarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  const fetchMascotas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/mascotas`, { headers });
      setMascotas(res.data.data);
    } catch {
      message.error("Error al cargar mascotas");
    } finally {
      setLoading(false);
    }
  };

  const fetchEspecies = async () => {
    try {
      const res = await axios.get(`${API}/api/especies`, { headers });
      setEspecies(res.data.data);
    } catch {
      console.log("Especies no disponibles aún");
    }
  };

  const fetchPropietarios = async () => {
    try {
      const res = await axios.get(`${API}/api/propietarios`, { headers });
      setPropietarios(res.data.data);
    } catch {
      console.log("Propietarios no disponibles aún");
    }
  };

  useEffect(() => {
    fetchMascotas();
    fetchEspecies();
    fetchPropietarios();
  }, []);

  const filtradas = mascotas.filter(
    (m) =>
      m.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      m.propietario?.toLowerCase().includes(search.toLowerCase()) ||
      m.especie?.toLowerCase().includes(search.toLowerCase()),
  );

  const abrirModal = (mascota = null) => {
    setEditando(mascota);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();
      if (editando) {
        await axios.patch(
          `${API}/api/mascotas/${editando.id_mascota}`,
          values,
          { headers },
        );
        message.success("Mascota actualizada");
      } else {
        await axios.post(`${API}/api/mascotas`, values, { headers });
        message.success("Mascota creada");
      }
      cerrarModal();
      fetchMascotas();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/mascotas/${id}`, { headers });
      message.success("Mascota desactivada");
      fetchMascotas();
    } catch {
      message.error("Error al eliminar");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Mascotas
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtradas.length} pacientes registrados
          </span>
        </div>
        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Mascota</span>
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nombre, especie o propietario..."
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
              Cargando mascotas...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">NOMBRE</th>
                  <th className="py-4 px-6">ESPECIE</th>
                  <th className="py-4 px-6">RAZA</th>
                  <th className="py-4 px-6">SEXO</th>
                  <th className="py-4 px-6">PESO</th>
                  <th className="py-4 px-6">PROPIETARIO</th>
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
                      No hay mascotas registradas
                    </td>
                  </tr>
                ) : (
                  filtradas.map((m) => (
                    <tr
                      key={m.id_mascota}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                        {m.id_mascota}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800">
                        {m.nombre}
                      </td>
                      <td className="py-4 px-6 text-gray-600">{m.especie}</td>
                      <td className="py-4 px-6 text-gray-500">
                        {m.raza || "—"}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {m.sexo === "M" ? "Macho" : "Hembra"}
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        {m.peso_kg ? `${m.peso_kg} kg` : "—"}
                      </td>
                      <td className="py-4 px-6 text-emerald-800 font-semibold">
                        {m.propietario}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            m.activa
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {m.activa ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canEdit && (
                              <button
                                onClick={() => abrirModal(m)}
                                className="p-1.5 text-gray-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                              >
                                ✏️
                              </button>
                            )}
                            {canDelete && (
                              <Popconfirm
                                title="¿Desactivar esta mascota?"
                                onConfirm={() => handleEliminar(m.id_mascota)}
                                okText="Sí"
                                cancelText="No"
                              >
                                <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
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

      {/* Modal */}
      <Modal
        title={editando ? "Editar mascota" : "Nueva mascota"}
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Guardar cambios" : "Crear mascota"}
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnClose
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              nombre: editando.nombre,
              id_especie: editando.id_especie,
              raza: editando.raza,
              sexo: editando.sexo,
              peso_kg: editando.peso_kg,
              color: editando.color,
              id_propietario: editando.id_propietario,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Ingresa el nombre" }]}
          >
            <Input placeholder="Ej: Firulais" />
          </Form.Item>

          <Form.Item
            name="id_especie"
            label="Especie"
            rules={[{ required: true, message: "Selecciona la especie" }]}
          >
            <Select placeholder="Selecciona una especie">
              {especies.map((e) => (
                <Select.Option key={e.id_especie} value={e.id_especie}>
                  {e.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="id_propietario"
            label="Propietario"
            rules={[{ required: true, message: "Selecciona el propietario" }]}
          >
            <Select
              placeholder="Selecciona un propietario"
              showSearch
              optionFilterProp="children"
            >
              {propietarios.map((p) => (
                <Select.Option key={p.id_propietario} value={p.id_propietario}>
                  {p.nombres} {p.apellidos}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item name="raza" label="Raza" className="flex-1">
              <Input placeholder="Ej: Labrador" />
            </Form.Item>
            <Form.Item
              name="sexo"
              label="Sexo"
              className="flex-1"
              rules={[{ required: true, message: "Selecciona el sexo" }]}
            >
              <Select placeholder="Sexo">
                <Select.Option value="M">Macho</Select.Option>
                <Select.Option value="F">Hembra</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex gap-4">
            <Form.Item name="peso_kg" label="Peso (kg)" className="flex-1">
              <InputNumber
                min={0}
                step={0.1}
                className="w-full"
                placeholder="Ej: 5.2"
              />
            </Form.Item>
            <Form.Item name="color" label="Color" className="flex-1">
              <Input placeholder="Ej: Dorado" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
