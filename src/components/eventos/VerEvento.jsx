import React, { useState } from 'react';
import { Modal, List, Empty } from 'antd';
import dayjs from 'dayjs';

export const VerEvento = ({visible, onClose, selectedDate, eventos}) => {
    // Filtrar eventos para la fecha seleccionada
    const eventosFecha = eventos.filter(evento => 
      dayjs(evento.dateEvent).format('YYYY-MM-DD') === 
      dayjs(selectedDate).format('YYYY-MM-DD')
    );
  
    return (
      <Modal
        title={`Eventos para el ${dayjs(selectedDate).format('DD/MM/YYYY')}`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={400}
      >
        {eventosFecha.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={eventosFecha}
            renderItem={(evento) => (
              <List.Item>
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
    );
  };

