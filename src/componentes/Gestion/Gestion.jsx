import React, { useState, useEffect } from 'react';
import "./Gestion.css";
import * as API from '../../servicios/data';
import AsignarCamaModal from '../Modals/AsignarCama/AsignarCama';

export function TableGestion() {
    const [ingresos, setIngresos] = useState([]);
    const storedToken = localStorage.getItem('token');
    const [searchName, setSearchName] = useState('');
    const [searchRUT, setSearchRUT] = useState('');
    const [modalOpen, setModalOpen] = useState(false); 
    const [ingresoSeleccionado, setIngresoSeleccionado] = useState('');
    const [rutSeleccionado, setRutSeleccionado] = useState('');
    const [unidadSeleccionada, setUnidadSeleccionada] = useState('');
    const [unidadIdSeleccionada, setUnidadIdSeleccionada] = useState('');
    const [contadorPendiente, setContadorPendiente] = useState(0);
    const [contadorCirugia, setContadorCirugia] = useState(0);
    const [contadorUCI, setContadorUCI] = useState(0);
    const [contadorUTI, setContadorUTI] = useState(0);

    useEffect(() => {
        handlerSearch();
        fetchContadores();
    }, []);

    const fetchContadores = async () => {
        try {
            const pendientes = await API.CountsIngresosPendientes(storedToken);
            setContadorPendiente(pendientes);

            const cirugia = await API.CountsCamaByUnidad(1 ,storedToken);
            setContadorCirugia(cirugia);

            const uci = await API.CountsCamaByUnidad(2, storedToken);
            setContadorUCI(uci);

            const uti = await API.CountsCamaByUnidad(3, storedToken);
            setContadorUTI(uti);
        } catch (error) {
            console.error("Error al obtener contadores:", error);
        }
    }

    const handleSearchNameChange = (event) => {
        setSearchName(event.target.value);
    };

    const handleSearchRUTChange = (event) => {
        setSearchRUT(event.target.value);
    };

    async function handlerSearch(e){
        try {
                const data = await API.GetIngresosGestion(storedToken);
                console.error("ingresos:", data);
                setIngresos(data);
            } catch (error) {
                console.error("Error durante la obtención de usuarios:", data);
            }
        }

    async function handlerSearchByFilters(e){
    try {
            const data = await API.GetIngresosByFilters(searchRUT, searchName, storedToken);
            console.error("ingresos:", data);
            setIngresos(data);
        } catch (error) {
            console.error(error);
            setIngresos([]);
        }
    }

    const getNombreEstado = (idEstado) => {
        switch (idEstado) {
            case 1:
                return 'INGRESADO';
            case 2:
                return 'ESPERA CAMA';
            case 3:
                return 'ASIGNADO';
            case 4:
                return 'ALTA';
            default:
                return 'Desconocido';
        }
    };

    const openModal = (ingreso, rut, unidad, unidadId) => {
        setModalOpen(true);
        setIngresoSeleccionado(ingreso)
        setRutSeleccionado(rut);
        setUnidadSeleccionada(unidad);
        setUnidadIdSeleccionada(unidadId)
    };

    const closeModal = () => {
        setModalOpen(false);
        handlerSearch();
        fetchContadores();
    };

    return (
        <div>
            <div className="counter-container">
                <div className="counter-box">
                    <div className="counter-number">{contadorPendiente}</div>
                    <div className="counter-label">Pendientes por asignar</div>
                </div>
                <div className="counter-box">
                    <div className="counter-number">{contadorCirugia}</div>
                    <div className="counter-label">Disponibles Cirugia</div>
                </div>
                <div className="counter-box">
                    <div className="counter-number">{contadorUCI}</div>
                    <div className="counter-label">Disponibles UCI</div>
                </div>
                <div className="counter-box">
                    <div className="counter-number">{contadorUTI}</div>
                    <div className="counter-label">Disponibles UTI</div>
                </div>
            </div>
            <div className="table-frame sm-col-4">
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
                    <button className="button" onClick={handlerSearchByFilters}>Buscar</button>
                </div>
                <br />
                <div className="table-scroll-container">
                    <table className="table-content">
                        <thead>
                            <tr>
                                <th>Rut</th>
                                <th>Nombre</th>
                                <th>Estado</th>
                                <th>Unidad</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {ingresos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No existen registros.</td>
                                </tr>
                            ) : (
                                ingresos.map((ingreso) => (
                                    <tr key={ingreso.paciente.rut.documento}>
                                        <td>{ingreso.paciente.rut.documento}</td>
                                        <td>{ingreso.paciente.nombre}</td>
                                        <td>{getNombreEstado(ingreso.idEstado)}</td>
                                        <td>{ingreso.unidad.nombre}</td>
                                        <td className='align-button'>
                                            {ingreso.idEstado === 2 && ( 
                                                <button className="edit-button" onClick={() => openModal(ingreso.idIngreso, ingreso.paciente, ingreso.unidad.nombre, ingreso.idUnidad)}>Asignar</button> 
                                            )} 
                                        </td>
                                    </tr>
                                ))
                            )}  
                        </tbody>
                    </table>
                </div>
                {modalOpen && (
                    <AsignarCamaModal
                        isOpen={modalOpen}
                        onClose={closeModal}
                        ingreso={ingresoSeleccionado}
                        rut={rutSeleccionado}
                        unidad={unidadSeleccionada}
                        unidadId={unidadIdSeleccionada}
                        onSubmit={(formValues) => {
                            console.log('Valores del formulario:', formValues);
                            closeModal();
                        }}
                    />
                )}
            </div>
        </div>
        );
    }