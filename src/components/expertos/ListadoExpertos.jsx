import { Table, Input, Button, Space, Popconfirm, Modal, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import '../../styles/Expertos/StyleListadoExperto.css';

import {CrearExperto} from '../../components/expertos/CrearExperto';
import { ModificarExperto} from '../../components/expertos/ModificarExperto';
import {VerExperto} from '../../components/expertos/VerExperto';


export const ListadoExpertos = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [selectedExpert, setSelectedExpert] = useState(null);

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalView, setIsModalView] = useState(false);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />}>
                        Buscar
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)}>Resetear</Button>
                    <Button type="link" onClick={close}>Cerrar</Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        render: (text) => searchedColumn === dataIndex ? (
            <Highlighter highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} searchWords={[searchText]} textToHighlight={text ? text.toString() : ''} />
        ) : text,
    });

    const handleDelete = async(id) => {
      try{
          await axios.delete(`http://localhost:3000/api/clientes/${id}`);
          message.success('Experto eliminado exitosamente');
          fetchExpertos(); // Recargar la lista
      } catch (error) {
          message.error('Error al eliminar el experto');
          console.error('Error:', error);
      }
    };

    const columns = [
      {
          title: 'Nombre',
          dataIndex: 'nombre',
          key: 'nombre',
          width: '20%',
          ...getColumnSearchProps('nombre'),
          sorter: (a, b) => a.nombre.localeCompare(b.nombre),
          
      },
      {
            title: 'Apellido',
            dataIndex: 'apellido',
            key: 'apellido',
            width: '20%',
            ...getColumnSearchProps('apellido'),
            sorter: (a, b) => a.apellido.localeCompare(b.apellido),
        },
        {
            title: 'Área',
            dataIndex: 'area',
            key: 'area',
            width: '10%',
            ...getColumnSearchProps('area'),
            sorter: (a, b) => a.area.localeCompare(b.area),
        },
        {
            title: 'Habilidad',
            dataIndex: 'habilidad',
            key: 'habilidad',
            width: '20%',
            ...getColumnSearchProps('habilidad'),
        },
        {
            title: 'Centro de formación',
            dataIndex: 'centro',
            key: 'centro',
            width: '20%',
            ...getColumnSearchProps('centro'),
        },
        {title: 'Acciones',
        key: 'actions',
        width: '20%',
        render: (_, record) => (
            <Space size="middle">
                <Button icon={<EditOutlined />} onClick={() => { setSelectedExpert(record); setIsModalOpenEdit(true); }} />
                <Popconfirm title="¿Eliminar este experto?" onConfirm={() => handleDelete(record.id)}>
                    <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => {
                        setSelectedExpert(record);
                        setIsModalView(true);
                    }}
                />
            </Space>
        ),
    },
];

const fetchExpertos = async () => {
    try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/clientes');

        console.log('Respuesta completa:', response);
        console.log('Datos recibidos:', response.data);
        
        // The first array in body contains the main data
        const mainDataArray = response.data.body[0];

        if (Array.isArray(mainDataArray)) {
            const expertoInfo = mainDataArray.map((usuario) => ({
                ...usuario,
                key: usuario.id, // Use id as key
                nombre: usuario.name,
                apellido: usuario.lastName,
                area: usuario.area,
                habilidad: usuario.competitionName,
                centro: usuario.formationCenter
            }));
            setDataSource(expertoInfo);
        } else {
            console.error('No se encontró un array válido:', response.data);
            message.error('Error al cargar los datos de expertos');
        }
    } catch (error) {
        console.error('Error al cargar expertos', error);
        message.error('No se pudieron cargar los expertos');
    } finally {
        setLoading(false);
    }
};

  // Corregimos los manejadores para cerrar los modales correctamente
  const handleCloseCrearExperto = (data, hasChanges) => {
    setIsModalOpen(false);
    if (hasChanges) {
        fetchExpertos();
    }
  };

  const handleCloseVerExperto = (data, hasChanges) => {
    setIsModalView(false);
    setSelectedExpert(null);
    if (hasChanges) {
        fetchExpertos();
    }
  };
    
  const handleCloseModificarExperto = (data, hasChanges) => {
    setIsModalOpenEdit(false); // Corregido - estaba cerrando el modal de vista en lugar del de edición
    setSelectedExpert(null);
    if (hasChanges) {
        fetchExpertos();
    }
  };

  useEffect(() => {
      fetchExpertos();
  }, []);

  return (
      <div className="listado-expertos-container">
          <div className="header-actions" style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
          }}>
          <div className="titulo_expertos">
              <h2>Expertos</h2>
          </div>

          <Button 
              className="crearExperto"
              onClick={() => setIsModalOpen(true)}
          >
              Crear Experto
          </Button>
          </div>

          <Table 
              dataSource={dataSource} 
              columns={columns} 
              loading={loading}
              
              pagination={{
                  pageSize: 10,
                  showTotal: (total, range) => 
                      `${range[0]}-${range[1]} de ${total} expertos`,
              }}
              scroll={{ x: true }}
              style={{ boxShadow: 'rgba(48, 48, 170, 0.2) 0px 7px 29px 0px',
                  margin: '0',
                  borderRadius: '10px',
              }}
              rowClassName="ant-table-row"
          />

          {isModalOpen && <CrearExperto onClose={handleCloseCrearExperto} />}
          
          {isModalOpenEdit && (
              <ModificarExperto 
                  onClose={handleCloseModificarExperto}
                  expertData={selectedExpert}
              />
          )}
          
          {isModalView && (
              <VerExperto 
                  onClose={handleCloseVerExperto}
                  expertData={selectedExpert}
              />
          )}
      </div>
  );
};