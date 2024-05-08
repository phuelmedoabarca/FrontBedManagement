import React, { useState, useEffect } from 'react';
import './AsignarCama.css';
import * as API from '../../../servicios/data';
import Modal from '../Alerts/Modal';

function AsignarCamaModal({ isOpen, onClose, ingreso, rut, unidad, unidadId, initialValues = {} }) {
    const [formValues, setFormValues] = useState({
        rut: initialValues.rut || '',
        ingresoId: ingreso || '',
        cama: initialValues.cama || '',
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [salas, setSalas] = useState([]);
    const [camas, setCamas] = useState([]);
    const storedToken = localStorage.getItem('token');
    const storedUsuario = localStorage.getItem('usuarioId');

    useEffect(() => {
        const fetchSalas = async () => {
            try {
                const data = await API.GetSalaByUnidad(unidadId, storedToken);
                setSalas(data);
                console.error(ingreso);
            } catch (error) {
                console.error('Error al obtener las salas:', error);
            }
        };
        if (isOpen) {
            fetchSalas();
        }
    }, [isOpen]);

    const fetchCamasBySala = async (idSala) => {
        if(idSala != ''){
            try {
                const data = await API.GetCamaBySala(idSala, storedToken);
                setCamas(data);
            } catch (error) {
                console.error('Error al obtener las camas:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSalaChange = (e) => {
        const idSala = e.target.value;
        fetchCamasBySala(idSala);
    };

    const handleCamaChange = (e) => {
        const idCama = e.target.value;
        setFormValues({ ...formValues, cama: idCama });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await API.IngresoUpdate(formValues.ingresoId, formValues.cama,storedUsuario, storedToken);
            if(data.StatusCode === 400){
                setIsError(true);
                setMessage(data.Message); 
            }
            else{
                setIsSuccess(true);
                setMessage(data.message); 
            }
        } catch (error) {
            console.error('Error al realizar la solicitud PUT:', error);
            setIsError(true);
        }
    };

    const handleModalClose = () => {
        onClose();
        setFormValues({
            rut: initialValues.rut || '',
            ingresoId: ingreso || '',
            cama: initialValues.cama || '',
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
                    <h3 className='title'>Asignar Cama</h3>
                            <form onSubmit={handleSubmit}>
                            <br />
                            <div className="form-group">
                                <label htmlFor="rut">RUT:</label>
                                <input
                                    type="text"
                                    id="rut"
                                    name="rut"
                                    value={rut.rut.documento}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ingrese el RUT"
                                    maxLength={40}
                                    readOnly={true}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="unidad">Unidad:</label>
                                <input
                                    type="text"
                                    id="unidad"
                                    name="unidad"
                                    value={unidad} 
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ingrese el nombre"
                                    maxLength={40} 
                                    readOnly={true}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sala">Sala:</label>
                                <select
                                    id="sala"
                                    name="sala"
                                    value={formValues.sala}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        handleSalaChange(e);
                                    }}
                                    required
                                    className="input-style"
                                >
                                    <option value="">Seleccione una sala</option>
                                    {salas.map((sala) => (
                                        <option key={sala.id} value={sala.idSala}>
                                            {sala.numero}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cama">Cama:</label>
                                <select
                                    id="cama"
                                    name="cama"
                                    value={formValues.idCama}
                                    onChange={handleCamaChange}
                                    required
                                    className="input-style"
                                >
                                    <option value="">Seleccione una cama</option>
                                    {camas.map((cama) => (
                                        <option key={cama.id} value={cama.idCama}>
                                            {cama.numero}
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

export default AsignarCamaModal;
