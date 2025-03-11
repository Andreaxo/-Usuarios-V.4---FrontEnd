import { Table, Input, Button, Space, Popconfirm, Modal, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Highlighter from 'react-highlight-words';
import '../../styles/Competidores/StyleListadoCompetidor.css';

import { CrearAprendiz } from '../aprendiz/CrearAprendiz';
import { VerCompetidor } from '../competidores/VerCompetidor';
import { ModificarCompetidor } from "./ModificarCompetidor";

export const ListadoCompetidor = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [selectedAprendiz, setSelectedAprendiz] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalView, setIsModalView] = useState(false);
    const [selectedCompetitor, setSelectedCompetitor] = useState(null);
    const competidorSectionRef = useRef(null);

    const handleVerCompetidor = (competidor) => {
        setSelectedCompetitor(competidor);
        setIsModalView(true);
        setTimeout(() => {
            competidorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/clientes/${id}`);
            message.success('Aprendiz eliminado exitosamente');
            fetchCompetidor();
        } catch (error) {
            message.error('Error al eliminar el Aprendiz');
        }
    };

    const columns = [
        { title: 'Habilidad', dataIndex: 'habilidad', key: 'habilidad', ...getColumnSearchProps('habilidad') },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', sorter: (a, b) => a.nombre.localeCompare(b.nombre), ...getColumnSearchProps('nombre') },
        { title: 'Apellido', dataIndex: 'apellido', key: 'apellido', sorter: (a, b) => a.apellido.localeCompare(b.apellido), ...getColumnSearchProps('apellido') },
        { title: 'Centro de formación', dataIndex: 'centro', key: 'centro', ...getColumnSearchProps('centro') },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => { setSelectedAprendiz(record); setIsModalOpenEdit(true); }} />
                    <Popconfirm title="¿Eliminar este competidor?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                    <Button icon={<EyeOutlined />} onClick={() => handleVerCompetidor(record)} />
                </Space>
            ),
        },
    ];

    const fetchCompetidor = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/clientes');
            const mainDataArray = response.data.body[0];
            const aprendices = mainDataArray.filter(usuario => usuario.rol === 'Competidor');
            setDataSource(aprendices.map(usuario => ({
                ...usuario, key: usuario.id, nombre: usuario.name, apellido: usuario.lastName, habilidad: usuario.competitionName, centro: usuario.formationCenter
            })));
        } catch (error) {
            message.error('Error al cargar la lista de aprendices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCompetidor(); }, []);

    return (
        <>
        <div className="competitors-listing-container">
            <div className="action-header">
                <h2 className="main-title">Todos los competidores</h2>
                <h3 className="subtitle-text">Escoge una habilidad</h3>
            </div>
            <Table 
                dataSource={dataSource} 
                columns={columns} 
                loading={loading}
                
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} de ${total} competidores`,
                }}
                scroll={{ x: true }}
                style={{ boxShadow: 'rgba(48, 48, 170, 0.2) 0px 7px 29px 0px',
                    margin: '0',
                    borderRadius: '10px',
                    
                }}
                rowClassName="ant-table-row"
            ></Table>
            {isModalOpen && <div ref={competidorSectionRef}><CrearAprendiz onClose={() => setIsModalOpen(false)} /></div>}
            {isModalOpenEdit && <div ref={competidorSectionRef}><ModificarCompetidor onClose={() => setIsModalOpenEdit(false)} expertData={selectedAprendiz} /></div>}
            {isModalView && <div ref={competidorSectionRef}><VerCompetidor onClose={() => setIsModalView(false)} expertData={selectedCompetitor} /></div>}
        </div>
        </>
    );
};