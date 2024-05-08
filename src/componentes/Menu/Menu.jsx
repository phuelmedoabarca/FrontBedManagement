import "./Menu.css";
import React, { useState } from "react";
import { LuUserPlus, LuPanelLeftClose  } from "react-icons/lu";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from 'react-router-dom';
import isotipoMenu from '../../assets/isotipoMenu.png';

export function NavMenu({rolId, onMenuSelection, onCollapsedChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const navigate = useNavigate();

  const handleCollapsedChange = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapsedChange(newCollapsed);
  };
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const handleLogout = () => {
    localStorage.removeItem('rolId');
    navigate("/");
  };

  return (
    <div>
      <Sidebar
        className={`app ${toggled ? "toggled" : ""}`}
        style={{ height: "100%", position: "absolute" }}
        collapsed={collapsed}
        toggled={toggled}
        handleToggleSidebar={handleToggleSidebar}
        handleCollapsedChange={handleCollapsedChange}
      >
        <main>
          <Menu>
            {collapsed ? (
              
              <MenuItem
                icon={<FiChevronsRight />}
                onClick={handleCollapsedChange}
              ></MenuItem>
            ) : (
              <MenuItem
                suffix={<FiChevronsLeft />}
                onClick={handleCollapsedChange}
              >
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: "9px",
                    fontWeight: "bold",
                    fontSize: 14,
                    letterSpacing: "1px",
                    height: '100px',
                    width: '100%'
                  }}
                >
                  <div>
                    <img src={isotipoMenu} alt="Isotipo Menu" style={{ width: '50px', height: '50px', paddingTop: '15px' }} />
                  </div>
                  
                </div>
              </MenuItem>
            )}
            <hr />
          </Menu>

          <Menu>
            {rolId === 'b09fdd55-3bb9-4309-a268-37181cde7cd9' && (
              <MenuItem icon={<LuUserPlus />}>Ingreso</MenuItem>
            )}
            {rolId === '054690f9-7522-4bdb-ad3F-3Ec0fbb2e864' && (
              <MenuItem icon={<LuUserPlus />}>Solicitud Cama</MenuItem>
            )}
            {rolId === '1c750d1a-264d-405e-ae20-365537edb404' && (
              <MenuItem icon={<LuUserPlus />} onClick={() => onMenuSelection('asignacion')}>Asignación</MenuItem>
            )}
            {rolId === '16298d23-cd62-4068-802a-0191e3Aeb4e6' && (
              <MenuItem icon={<LuUserPlus />}>Alta Paciente</MenuItem>
            )}
            {rolId === '7979705f-2d1a-435f-83f4-76fb333a481f' && (
              <MenuItem icon={<LuUserPlus />} onClick={() => onMenuSelection('usuarios')}>Usuarios</MenuItem>
            )}
            <div className="button-layout">
              <MenuItem icon={<LuPanelLeftClose  />} onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </div>
          </Menu>
        </main>
      </Sidebar>
    </div>
  );
}