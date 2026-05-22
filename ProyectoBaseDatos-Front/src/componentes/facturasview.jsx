import React, { useEffect, useState } from "react";
import { DollarSign, Plus, Search } from "lucide-react";
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

export default function FacturasView() {
  // Control de Sesión y Roles
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const rol = user.rol;

  const canCreate = ["SUPERADMIN", "ADMIN", "USUARIO"].includes(rol);
  const canEdit = ["SUPERADMIN", "ADMIN"].includes(rol);
  const canDelete = ["SUPERADMIN", "ADMIN"].includes(rol);

  const headers = { Authorization: `Bearer ${token}` };

  // Estados del Componente
  const [facturas, setFacturas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form] = Form.useForm();

  // GET: Obtener facturas de la BD
  const fetchFacturas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/facturas`, { headers });
      setFacturas(res.data.data);
    } catch {
      message.error("Error al cargar el listado de facturas");
    } finally {
      setLoading(false);
    }
  };

  // GET: Datos auxiliares de Citas para asociar en el formulario
  const fetchCitas = async () => {
    try {
      const res = await axios.get(`${API}/api/citas`, { headers });
      setCitas(res.data.data);
    } catch {
      console.log("Citas no disponibles en este momento");
    }
  };

  useEffect(() => {
    fetchFacturas();
    fetchCitas();
  }, []);

  // Filtrado reactivo en tiempo real
  const filtradas = facturas.filter(
    (f) =>
      f.cliente?.toLowerCase().includes(search.toLowerCase()) ||
      f.concepto?.toLowerCase().includes(search.toLowerCase()) ||
      f.id_factura?.toString().includes(search),
  );

  // Manejo del Modal
  const abrirModal = (factura = null) => {
    setEditando(factura);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditando(null);
    form.resetFields();
  };

  // POST / PATCH: Guardar la transacción
  const handleGuardar = async () => {
    try {
      const values = await form.validateFields();

      // Formateo de fecha para compatibilidad con la base de datos
      const datosFormateados = {
        ...values,
        fecha_emision: values.fecha_emision.format("YYYY-MM-DD"),
      };

      if (editando) {
        await axios.patch(
          `${API}/api/facturas/${editando.id_factura}`,
          datosFormateados,
          { headers },
        );
        message.success("Factura actualizada correctamente");
      } else {
        await axios.post(`${API}/api/facturas`, datosFormateados, { headers });
        message.success("Factura emitida y registrada");
      }
      cerrarModal();
      fetchFacturas();
    } catch (err) {
      if (err?.response?.data?.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // DELETE: Eliminar o anular factura
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/api/facturas/${id}`, { headers });
      message.success("Factura eliminada/anulada");
      fetchFacturas();
    } catch {
      message.error("Error al intentar eliminar la factura");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Facturación
            </h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {filtradas.length} transacciones registradas en el sistema
          </span>
        </div>
        {canCreate && (
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva factura</span>
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por Nº factura, cliente o concepto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* Tabla de Facturas */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-medium">
              Cargando registros financieros...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">Nº FACTURA</th>
                  <th className="py-4 px-6">FECHA EMISIÓN</th>
                  <th className="py-4 px-6">CLIENTE / TITULAR</th>
                  <th className="py-4 px-6">CONCEPTO</th>
                  <th className="py-4 px-6">MÉTODO PAGO</th>
                  <th className="py-4 px-6">ESTADO</th>
                  <th className="py-4 px-6">SUBTOTAL</th>
                  <th className="py-4 px-6">DESCUENTO</th>
                  <th className="py-4 px-6">TOTAL</th>
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
                      No se encontraron facturas emitidas
                    </td>
                  </tr>
                ) : (
                  filtradas.map((reg) => (
                    <tr
                      key={reg.id_factura}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                        {reg.id_factura}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                        {reg.fecha_emision}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800">
                        {reg.cliente}
                      </td>
                      <td className="py-4 px-6 text-gray-500 max-w-xs truncate">
                        {reg.concepto}
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-xs">
                        {reg.metodo_pago || "—"}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            reg.estado === "Pagada"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {reg.estado}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500">
                        ${Number(reg.subtotal || 0).toLocaleString("es-CO")}
                      </td>
                      <td className="py-4 px-6 text-red-500">
                        -${Number(reg.descuentos || 0).toLocaleString("es-CO")}
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-800">
                        ${Number(reg.total || 0).toLocaleString("es-CO")}
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
                                title="¿Seguro que deseas anular/eliminar esta factura?"
                                onConfirm={() => handleEliminar(reg.id_factura)}
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

      {/* Modal - Registrar / Editar Factura */}
      <Modal
        title={
          editando
            ? `Modificar Factura Nº ${editando.id_factura}`
            : "Generar Nueva Factura"
        }
        open={modalOpen}
        onOk={handleGuardar}
        onCancel={cerrarModal}
        okText={editando ? "Guardar Cambios" : "Emitir Factura"}
        cancelText="Cancelar"
        okButtonProps={{ style: { backgroundColor: "#065f46" } }}
        destroyOnHidden // Evita advertencias obsoletas de AntD
        afterOpenChange={(open) => {
          if (open && editando) {
            form.setFieldsValue({
              id_cita: editando.id_cita,
              fecha_emision: editando.fecha_emision
                ? dayjs(editando.fecha_emision)
                : null,
              cliente: editando.cliente,
              concepto: editando.concepto,
              metodo_pago: editando.metodo_pago,
              estado: editando.estado,
              subtotal: editando.subtotal,
              descuentos: editando.descuentos,
              total: editando.total,
            });
          }
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          {/* Fila 1: Asociación opcional o requerida con una Cita */}
          <Form.Item name="id_cita" label="Vincular con Cita Médica (Opcional)">
            <Select
              placeholder="Selecciona la cita de referencia"
              allowClear
              showSearch
              optionFilterProp="children"
              className="cursor-pointer"
            >
              {citas.map((cit) => (
                <Select.Option key={cit.id_cita} value={cit.id_cita}>
                  Cita #{cit.id_cita} - {cit.mascota} ({cit.fecha})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Fila 2: Cliente y Fecha Emisión */}
          <div className="flex gap-4">
            <Form.Item
              name="cliente"
              label="Cliente / Titular a Facturar"
              className="flex-[2]"
              rules={[
                { required: true, message: "Ingresa el nombre del titular" },
              ]}
            >
              <Input placeholder="Ej: María García" />
            </Form.Item>

            <Form.Item
              name="fecha_emision"
              label="Fecha Emisión"
              className="flex-1"
              rules={[{ required: true, message: "Selecciona la fecha" }]}
            >
              <DatePicker className="w-full" placeholder="Hoy" />
            </Form.Item>
          </div>

          {/* Fila 3: Concepto Facturado */}
          <Form.Item
            name="concepto"
            label="Concepto de Cobro"
            rules={[
              { required: true, message: "Especifica el concepto detallado" },
            ]}
          >
            <Input placeholder="Ej: Consulta Médica General + Ampolla Desparasitante" />
          </Form.Item>

          {/* Fila 4: Forma de pago y Estado actual */}
          <div className="flex gap-4">
            <Form.Item
              name="metodo_pago"
              label="Método de Pago"
              className="flex-1"
              rules={[{ required: true, message: "Selecciona el método" }]}
            >
              <Select placeholder="Forma de pago" className="cursor-pointer">
                <Select.Option value="Efectivo">Efectivo</Select.Option>
                <Select.Option value="Tarjeta de Crédito">
                  Tarjeta de Crédito
                </Select.Option>
                <Select.Option value="Tarjeta de Débito">
                  Tarjeta de Débito
                </Select.Option>
                <Select.Option value="Transferencia / QR">
                  Transferencia / QR
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="estado"
              label="Estado Inicial"
              className="flex-1"
              rules={[{ required: true, message: "Define el estado" }]}
            >
              <Select placeholder="Seleccionar" className="cursor-pointer">
                <Select.Option value="Pagada">Pagada</Select.Option>
                <Select.Option value="Pendiente">Pendiente</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {/* Fila 5: Valores Financieros (Subtotal, Descuento y Total General) */}
          <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <Form.Item
              name="subtotal"
              label="Subtotal ($)"
              className="flex-1 mb-0"
              rules={[{ required: true, message: "Ingresa el subtotal" }]}
            >
              <InputNumber
                className="w-full"
                min={0}
                placeholder="0"
                onChange={() => {
                  // Pequeña lógica automática para calcular sugerencia de total
                  const sub = form.getFieldValue("subtotal") || 0;
                  const desc = form.getFieldValue("descuentos") || 0;
                  form.setFieldsValue({ total: Math.max(0, sub - desc) });
                }}
              />
            </Form.Item>

            <Form.Item
              name="descuentos"
              label="Descuento ($)"
              className="flex-1 mb-0"
            >
              <InputNumber
                className="w-full"
                min={0}
                placeholder="0"
                onChange={() => {
                  const sub = form.getFieldValue("subtotal") || 0;
                  const desc = form.getFieldValue("descuentos") || 0;
                  form.setFieldsValue({ total: Math.max(0, sub - desc) });
                }}
              />
            </Form.Item>

            <Form.Item
              name="total"
              label="Total Neto ($)"
              className="flex-1 mb-0"
              rules={[{ required: true, message: "Ingresa el total final" }]}
            >
              <InputNumber
                className="w-full font-bold text-emerald-800"
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
