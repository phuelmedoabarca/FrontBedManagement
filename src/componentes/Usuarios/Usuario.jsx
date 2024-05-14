import React, { useState, useEffect } from 'react';
import "./Usuario.css";
import * as API from '../../servicios/data';
import NewUsuarioModal from '../Modals/NuevoUsuario/NuevoUsuario';
import EditUsuarioModal from '../Modals/EditarUsuario/EditarUsuario';
import Modal from '../Modals/Alerts/Modal';

export function TableUsuario() {
    const [buscarNombre, setBuscarNombre] = useState('');
    const [buscarRUT, setBuscarRUT] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [modalState, setModalState] = useState({ isOpen: false, type: null });
    const [selectedUser, setSelectedUser] = useState(null);
    const storedToken = localStorage.getItem('token');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);


    useEffect(() => {
        handlerSearch();
    }, []);

    const handleBuscarNombreChange = (e) => {
        setBuscarNombre(e.target.value);
    };

    const handleBuscarRUTChange = (e) => {
        const value = e.target.value.replace(/\./g, '');
        setBuscarRUT(value);
    };

    const handleEditUser = (usuario) => {
        setSelectedUser(usuario);
        setModalState({ isOpen: true, type: 'edit' });
    };

    const openNewUsuarioModal = () => {
        setModalState({ isOpen: true, type: 'new' });
        setSelectedUser(null);
    };
    
    const closeModal = () => {
        setModalState({ isOpen: false, type: null });
        handlerSearch();
    };

    async function handlerSearch(e){
    try {
            const data = await API.GetUsers(storedToken);
            console.info("usuarios:", data);
            setUsuarios(data);
        } catch (error) {
            console.error("Error durante la obtención de usuarios:", data);
        }
    }

    async function handlerSearchByFilters(e){
    try {
            const data = await API.GetUsersByFilters(buscarRUT, buscarNombre, storedToken);
            console.info("usuarios:", data);
            setUsuarios(data);
        } catch (error) {
            console.error(error);
            setUsuarios([]);
        }
    }

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            try {
                await API.UserDelete(`${userToDelete.rut.documento}-${userToDelete.rut.digito}`, storedToken);
                setIsSuccess(true);
                setMessage("Usuario eliminado correctamente.");
                handlerSearch();
            } catch (error) {
                setIsError(true);
                setMessage("Error durante la eliminación del usuario.");
            } finally {
                closeConfirmModal();
            }
        }
    };

    const handleModalAlertClose = () => {
        setIsSuccess(false);
        setIsError(false);
        setMessage('');
    };

    const openConfirmModal = (usuario) => {
        setUserToDelete(usuario);
        setIsConfirmModalOpen(true);
    };
    
    const closeConfirmModal = () => {
        setUserToDelete(null);
        setIsConfirmModalOpen(false);
    };

    return (
        <div className="table-frame sm-col-4">
            <div className="search-container">
                <input
                    type="text"
                    value={buscarRUT}
                    onChange={handleBuscarRUTChange}
                    placeholder="RUT"
                    className="search-input"
                    maxLength={10}
                />
                <input
                    type="text"
                    value={searchName}
                    onChange={handleBuscarNombreChange}
                    placeholder="Nombre"
                    className="search-input"
                    maxLength={40}
                />
                <button className="button" onClick={openNewUsuarioModal}>Nuevo</button>
                <button className="button" onClick={handlerSearchByFilters}>Buscar</button>
                <br />
            </div>
            <div className="table-scroll-container">
                <table className="table-content table">
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
                                    <td>{usuario.rut.documento}-{usuario.rut.digito}</td>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.email.email}</td>
                                    <td>{usuario.rol.nombre}</td>
                                    <td className='align-button'>
                                        <button className="edit-button" onClick={() => handleEditUser(usuario)}>Editar</button>
                                    </td>
                                    <td className='align-button'>
                                        <button className="delete-button" onClick={() => openConfirmModal(usuario)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {modalState.isOpen && modalState.type === 'new' && (
                <NewUsuarioModal
                    isOpen={modalState.isOpen}
                    onClose={closeModal}
                    onSubmit={(formValues) => {
                        console.log('Valores del formulario:', formValues);
                        closeModal();
                    }}
                />
            )}

            {modalState.isOpen && modalState.type === 'edit' && (
                <EditUsuarioModal
                    isOpen={modalState.isOpen}
                    onClose={closeModal}
                    initialValues={selectedUser}
                    onSubmit={(formValues) => {
                        console.log('Valores del formulario editado:', formValues);
                        closeModal();
                    }}
                />
            )}
            <Modal isOpen={isSuccess || isError} onClose={handleModalAlertClose} isError={isError}>
                {isSuccess ? (
                    <div><br/>{message}</div>
                ) : (
                    <div><br/>{message}</div>
                )}
            </Modal>
            {isConfirmModalOpen && (
                <Modal 
                    isOpen={isConfirmModalOpen}
                    onClose={closeConfirmModal}
                    onConfirm={handleConfirmDelete}
                    confirmText="Eliminar"
                    isError={true}
                >
                    <br /> 
                    <div>¿Estás seguro de que quieres eliminar a este usuario?</div>
                </Modal>
            )}
        </div>
        );
    }