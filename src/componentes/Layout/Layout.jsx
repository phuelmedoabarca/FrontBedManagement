import { NavMenu } from '../Menu/Menu';
import React, { useState, useEffect } from "react";
import { TableUsuario } from "../Usuarios/Usuario";
import "./Layout.css";
import { useNavigate } from 'react-router-dom';

export function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const [rolId, setRolId] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRolId = localStorage.getItem('rolId');
        setRolId(storedRolId);
        if (storedRolId === null) {
            navigate("/");
        }
    }, [navigate]);

    const handleCollapsedChange = (newCollapsed) => {
        setCollapsed(newCollapsed);
    };

    const handleMenuSelection = (option) => {
        setSelectedMenu(option);
      };

    return (
        <div className={`layout-container ${collapsed ? 'collapsed' : ''}`}>
            <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <NavMenu rolId={rolId} onMenuSelection={handleMenuSelection} onCollapsedChange={handleCollapsedChange} />
            </div>
            <div className={`content ${collapsed ? 'collapsed' : ''}`}>
                {/* Muestra el texto de bienvenida cuando no se ha seleccionado una opción del menú */}
                {selectedMenu === null && (
                    <div className="welcome-message">

                    </div>
                )}

                {/* Muestra la tabla de usuarios cuando se selecciona la opción "usuarios" en el menú */}
                {selectedMenu === 'usuarios' && <TableUsuario />}
            </div>
        </div>
      );
}