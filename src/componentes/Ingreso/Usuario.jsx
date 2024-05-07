import React, { useState, useEffect } from 'react';
import "./Usuario.css";
import * as API from '../../servicios/data';
import NewUsuarioModal from '../Modals/NuevoUsuario/NewUsuario';

export function TableUsuario() {
    const [searchName, setSearchName] = useState('');
    const [searchRUT, setSearchRUT] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearchNameChange = (event) => {
        setSearchName(event.target.value);
    };

    const handleSearchRUTChange = (event) => {
        setSearchRUT(event.target.value);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        handlerSearch();
    };

    useEffect(() => {
        handlerSearch();
    }, []);

    async function handlerSearch(e){
    try {
            const data = await API.GetUsers();
            console.error("usuarios:", data);
            setUsuarios(data);
        } catch (error) {
            console.error("Error durante la obtención de usuarios:", data);
        }
    }

    async function handlerSearchByFilters(e){
        try {
                
                const data = await API.GetUsersByFilters(searchRUT, searchName);
                console.error("usuarios:", data);
                setUsuarios(data);
            } catch (error) {
                console.error(error);
                setUsuarios([]);
            }
        }

        return (
            <div className="table-frame">
                <div className="search-container">
                    <input
                        type="text"
                        value={searchRUT}
                        onChange={handleSearchRUTChange}
                        placeholder="RUT"
                        className="search-input"
                        maxLength={12}
                    />
                    <input
                        type="text"
                        value={searchName}
                        onChange={handleSearchNameChange}
                        placeholder="Nombre"
                        className="search-input"
                        maxLength={40}
                    />
                    <button className="button" onClick={openModal}>Nuevo</button>
                    <button className="button" onClick={handlerSearchByFilters}>Buscar</button>
                    <br />
                </div>
                <div className="table-scroll-container"> {/* Nuevo contenedor para scroll */}
                    <table className="table-content">
                        <thead>
                            <tr>
                                <th>Rut</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No existen registros.</td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.rut.documento}>
                                        <td>{usuario.rut.documento}</td>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.email.email}</td>
                                        <td>{usuario.rol.nombre}</td>
                                        <td className='align-button'>
                                            <button className="edit-button">Editar</button>
                                        </td>
                                        <td className='align-button'>
                                            <button className="delete-button">Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <NewUsuarioModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={(formValues) => {
                        console.log('Valores del formulario:', formValues);
                        closeModal();
                    }}
                />
            </div>
        );
    }