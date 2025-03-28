import React, { useState, useEffect } from 'react';
import { Modal, List, Empty, Dropdown, Menu, message } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import '../../styles/Eventos/StyleEventos.css';
import { Badge, Calendar } from 'antd';
import { CrearEvento } from './crearEvento';
import { ModificarEvento } from './ModificarEvento';
import dayjs from 'dayjs';

export const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [isModalView, setIsModalView] = useState(false);
  const [isEventosDiaModalVisible, setIsEventosDiaModalVisible] = useState(false);
  const [isModificarEventoVisible, setIsModificarEventoVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);

  // Función para obtener eventos desde la API
  const fetchEventos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/eventos');
      if (!response.ok) {
        throw new Error('Error al obtener los eventos');
      }
      const data = await response.json();
      
      // Acceder al primer elemento del array (los eventos)
      const eventosData = data.body[0] || [];
      
      console.log('Eventos:', eventosData);
      
      // Establecer los eventos
      setEventos(eventosData);
    } catch (error) {
      console.error('Error fetching eventos:', error);
      setEventos([]); // Establecer como array vacío en caso de error
    }
  };

  // Cargar eventos al montar el componente
  useEffect(() => {
    fetchEventos();
  }, []);

  // Obtener eventos para una fecha específica
  const getListData = (value) => {
    // Verificar que value no sea null o undefined
    if (!value || !value.format) {
      return [];
    }

    // Convertir la fecha del calendario a formato comparable
    const formattedDate = value.format('YYYY-MM-DD');
    
    // Verificar que eventos no sea null
    if (!eventos || !Array.isArray(eventos)) {
      return [];
    }
    
    // Filtrar eventos que coinciden con la fecha
    const listData = eventos
      .filter(evento => {
        // Verificar que el evento tenga fecha
        if (!evento.dateEvent) return false;
        
        // Convertir la fecha del evento a formato comparable
        const eventoDate = dayjs(evento.dateEvent).format('YYYY-MM-DD');
        return eventoDate === formattedDate;
      })
      .map(evento => ({
        ...evento,
        type: 'success', // Puedes personalizar esto
        content: evento.nameEvent, // Nombre del evento
        description: evento.descriptionEvent // Descripción del evento
      }));
    
    return listData;
  };

  const handleCloseCrearEvento = (data, hasChanges) => {
    setIsModalView(false);
    // Si hay cambios, volver a cargar los eventos
    if (hasChanges) {
      fetchEventos();
    }
  };

  const handleCloseModificarEvento = (data, hasChanges) => {
    setIsModificarEventoVisible(false);
    setSelectedEvento(null);
    // Si hay cambios, volver a cargar los eventos
    if (hasChanges) {
      fetchEventos();
    }
  };

  const handleDateSelect = (value) => {
    // Asegurarse de que value no sea null
    if (value) {
      setSelectedDate(value);
      setIsEventosDiaModalVisible(true);
    }
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const listData = getListData(current);
      return (
        <ul className="events">
          {listData.map((item, index) => (
            <li key={index} title={item.description}>
              <Badge status="success" text={item.content} />
            </li>
          ))}
        </ul>
      );
    }
    return info.originNode;
  };

  const handleEliminarEvento = async (evento) => {
    try {
      await fetch(`http://localhost:3000/api/eventos/${evento.id}`, {
        method: 'DELETE'
      });
      message.success('Evento eliminado exitosamente');
      fetchEventos();
      setIsEventosDiaModalVisible(false);
    } catch (error) {
      console.error('Error al eliminar:', error);
      message.error('No se pudo eliminar el evento');
    }
  };

  return (
    <div className="eventos_container">
      <div className="title-container-evento">
        <h1 className='title_event'>Eventos</h1>
        <button 
          className='btn-crear-evento' 
          onClick={() => setIsModalView(true)}
        >
          Crear evento
        </button>
        
        {isModalView && (
          <CrearEvento 
            onClose={handleCloseCrearEvento}
          />
        )}
      </div>

      <Calendar 
        cellRender={cellRender} 
        className='calendar_container'
        onSelect={handleDateSelect}
      />

      {/* Modal de eventos del día */}
      <Modal
        title={`Eventos para el ${selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : ''}`}
        open={isEventosDiaModalVisible}
        onCancel={() => setIsEventosDiaModalVisible(false)}
        footer={null}
        width={400}
      >
        {selectedDate && getListData(selectedDate).length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={getListData(selectedDate)}
            renderItem={(evento) => (
              <List.Item
                actions={[
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item 
                          key="edit" 
                          onClick={() => {
                            setSelectedEvento(evento);
                            setIsModificarEventoVisible(true);
                            setIsEventosDiaModalVisible(false);
                          }}
                        >
                          Modificar
                        </Menu.Item>
                        <Menu.Item 
                          key="delete" 
                          onClick={() => handleEliminarEvento(evento)}
                        >
                          Eliminar
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                  >
                    <MoreOutlined />
                  </Dropdown>
                ]}
              >
                <List.Item.Meta
                  title={evento.nameEvent}
                  description={evento.descriptionEvent}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="No hay eventos programados para este día" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        )}
      </Modal>

      {/* Modal para modificar evento */}
      <ModificarEvento
        visible={isModificarEventoVisible}
        evento={selectedEvento}
        onClose={handleCloseModificarEvento}
      />
    </div>
  );
};