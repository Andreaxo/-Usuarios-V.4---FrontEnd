import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, message } from 'antd';
import axios from "axios";
import dayjs from 'dayjs';

export const ModificarEvento = ({ evento, onClose, visible }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    // Establecer valores iniciales del formulario cuando el evento cambie
    useEffect(() => {
        if (evento) {
            form.setFieldsValue({
                nameEvent: evento.nameEvent,
                descriptionEvent: evento.descriptionEvent,
                dateEvent: evento.dateEvent ? dayjs(evento.dateEvent) : null
            });
        }
    }, [evento, form]);

    const handleSubmit = async () => {
        try {
            // Validar el formulario
            const values = await form.validateFields();

            setIsLoading(true);

            // Preparar los datos para enviar
            const dataToSend = {
                id: evento.id,
                nameEvent: values.nameEvent,
                descriptionEvent: values.descriptionEvent,
                dateEvent: values.dateEvent.format('YYYY-MM-DD')
            };

            // Llamar a la API para modificar
            const response = await axios.put(`http://localhost:3000/api/eventos/${evento.id}`, dataToSend);

            message.success('Evento modificado exitosamente');
            onClose(response.data, true);
        } catch (error) {
            console.error('Error al modificar:', error);
            message.error('No se pudo modificar el evento');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Modificar Evento"
            open={visible}
            onOk={handleSubmit}
            onCancel={() => onClose(null, false)}
            confirmLoading={isLoading}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="nameEvent"
                    label="Nombre del Evento"
                    rules={[
                        { required: true, message: 'Por favor ingrese el nombre del evento' },
                        { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, message: 'El nombre solo debe contener letras' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="descriptionEvent"
                    label="Descripción del Evento"
                    rules={[{ required: true, message: 'Por favor ingrese la descripción del evento' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="dateEvent"
                    label="Fecha del Evento"
                    rules={[{ required: true, message: 'Por favor seleccione la fecha del evento' }]}
                >
                    <DatePicker 
                        style={{ width: '100%' }}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};