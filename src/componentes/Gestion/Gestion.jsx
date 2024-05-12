import React, { useState, useEffect } from 'react';
import "./Gestion.css";
import * as API from '../../servicios/data';
import AsignarCamaModal from '../Modals/AsignarCama/AsignarCama';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
        fetchContadores();
        handlerSearch();
    }, []);

    const fetchContadores = async () => {
        try {
            const pendientes = await API.CountsIngresosPendientes(storedToken);
            setContadorPendiente(pendientes);

            const cirugia = await API.CountsCamaByUnidad(1 ,storedToken);
            setContadorCirugia(cirugia);

            const uti = await API.CountsCamaByUnidad(2, storedToken);
            setContadorUTI(uti);

            const uci = await API.CountsCamaByUnidad(3, storedToken);
            setContadorUCI(uci);
        } catch (error) {
            console.error("Error al obtener contadores:", error);
        }
    }

    const handleSearchNameChange = (e) => {
        setSearchName(e.target.value);
    };

    const handleSearchRUTChange = (e) => {
        const value = e.target.value.replace(/\./g, '');
        setSearchRUT(value);
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
            fetchContadores();
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

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div>
            <div className="slider-container">
                <Slider className="custom-slider" {...settings}>
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
                </Slider>
            </div>
            <br />
            <div className="table-frame sm-col-4">
                <div className="search-container">
                    <input
                        type="text"
                        value={searchRUT}
                        onChange={handleSearchRUTChange}
                        placeholder="RUT"
                        className="search-input"
                        maxLength={10}
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
                                <th>Apellido paterno</th>
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
                                        <td>{ingreso.paciente && ingreso.paciente.rut.documento}-{ingreso.paciente && ingreso.paciente.rut.digito}</td>
                                        <td>{ingreso.paciente && ingreso.paciente.nombre}</td>
                                        <td>{ingreso.paciente && ingreso.paciente.apellidoPaterno}</td>
                                        <td>{getNombreEstado(ingreso.idEstado)}</td>
                                        <td>{ingreso.unidad && ingreso.unidad.nombre}</td>
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