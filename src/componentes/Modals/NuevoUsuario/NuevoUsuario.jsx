import React, { useState, useEffect } from 'react';
import './NuevoUsuario.css';
import * as API from '../../../servicios/data';
import Modal from '../Alerts/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function NewUsuarioModal({ isOpen, onClose, onSubmit, initialValues = {} }) {
    const [formValues, setFormValues] = useState({
        rut: initialValues.rut || '',
        nombre: initialValues.nombre || '',
        email: initialValues.email || '',
        clave: initialValues.clave || '',
        rol: initialValues.rol || '',
    });
    const [roles, setRoles] = useState([]);
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const storedToken = localStorage.getItem('token');

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
      };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await API.GetRoles(storedToken);
                setRoles(data);
                console.error(data);
            } catch (error) {
                console.error('Error al obtener los roles:', error);
            }
        };
        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let filteredValue = value;
        if (name === "rut") {
            filteredValue = value.replace(/\./g, '');
        }
        setFormValues({ ...formValues, [name]: filteredValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await API.UserCreate(formValues.rut, formValues.nombre, formValues.clave, formValues.email, formValues.rol, storedToken);
            if(data.StatusCode === 400){
                setIsError(true);
                setMessage(data.Message); 
            }
            else{
                setIsSuccess(true);
                setMessage(data.message); 
            }
        } catch (error) {
            console.error('Error al realizar la solicitud POST:', error);
            setIsError(true);
        }
    };

    const handleModalClose = () => {
        onClose();
        setFormValues({
            rut: initialValues.rut || '',
            nombre: initialValues.nombre || '',
            email: initialValues.email || '',
            clave: initialValues.clave || '',
            rol: initialValues.rol || ''
        });
        setIsSuccess(false);
        setIsError(false);
    };

    const handleModalAlertClose = () => {
        if (isSuccess) {
            handleModalClose();

        } else if (isError) {
            setIsError(false);
        }
        setIsSuccess(false);
        setMessage(''); 
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div>
        {isOpen && (
            <div className="modal-overlay" onClick={handleModalClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close-button" onClick={handleModalClose}>×</button>
                    <div className="modal-body">
                    <h3 className='title'>Nuevo Usuario</h3>
                            <form onSubmit={handleSubmit}>
                            <br />
                            <div className="form-group">
                                <label htmlFor="rut">RUT:</label>
                                <input
                                    type="text"
                                    id="rut"
                                    name="rut"
                                    value={formValues.rut}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ingrese el RUT"
                                    maxLength={10}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formValues.nombre}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ingrese el nombre"
                                    maxLength={40} 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={formValues.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ingrese el email"
                                    pattern={pattern}
                                    title="Por favor, ingrese un email válido"
                                    maxLength={40} 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="clave">Clave:</label>
                                <div className="password-container">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="clave"
                                        name="clave"
                                        value={formValues.clave}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Ingrese la clave"
                                        maxLength={40} 
                                    />
                                    <FontAwesomeIcon
                                        className="eye-icon"
                                        icon={showPassword ? faEye : faEyeSlash}
                                        onClick={togglePasswordVisibility}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="rol">Rol:</label>
                                <select
                                    id="rol"
                                    name="rol"
                                    value={formValues.rol}
                                    onChange={handleInputChange}
                                    required
                                    className="input-style"
                                >
                                    <option value="">Seleccione un rol</option>
                                    {roles.map((rol) => (
                                        <option key={rol.id} value={rol.idRol}>
                                            {rol.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <br /><br />
                            <div class="button-container">
                                <button className="close-button" onClick={handleModalClose}>Cerrar</button>
                                <button type="submit" class="submit-button">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
        <Modal isOpen={isSuccess || isError} onClose={handleModalAlertClose} isError={isError}>
            {isSuccess ? (
                <div><br/>{message}</div>
            ) : (
                
                <div><br/>{message}</div>
            )}
        </Modal>
    </div>
    );
}

export default NewUsuarioModal;
