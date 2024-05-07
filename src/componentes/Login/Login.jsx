import { useState } from 'react'
import * as API from '../../servicios/data';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Modal from "../Modals/Alerts/Modal";
import { jwtDecode } from "jwt-decode";

export function Login(){
    const [credentials, setCredentials] = useState({email:'',password:''})
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };

    const validateEmail = (email) => {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return pattern.test(email);
    };

    const validateForm = () => {
      const newErrors = {};

      if (!credentials.email) {
          newErrors.email = 'El email es obligatorio.';
      } else if (!validateEmail(credentials.email)) {
          newErrors.email = 'El email no es válido.';
      }

      if (!credentials.password) {
          newErrors.password = 'La clave es obligatoria.';
      } else if (credentials.password.length < 6) {
          newErrors.password = 'La clave debe tener al menos 6 caracteres.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleModalClose = () => {
      setIsModalOpen(false);
    };

    async function handlerSubmit(e){
      e.preventDefault();
      if (!validateForm()) {
        return;
      }
      try {
        const data = await API.login(credentials.email, credentials.password);
        if (data.token != null) {
          console.log("Inicio de sesión exitoso:", data);
          const decodedToken = jwtDecode(data.token);
          const rolid = decodedToken.RolId;
          localStorage.setItem('rolId', rolid);
          localStorage.setItem('token', data.token);
          navigate('/Home');
        } else {
            console.error("Error al iniciar sesion:", data.Message);
            setIsModalOpen(true);
            setErrorMessage(data.Message);
            setIsError(true);
        }
      } catch (error) {
          console.error("Error durante el inicio de sesión:", data);
          setIsModalOpen(true);
          setErrorMessage(error);
          setIsError(true);
      }
    }
  
    return (
        <>
            <div className="container">
                <div className="form-box">
                    <h1></h1>
                    <form id="formulario" onSubmit={handlerSubmit}>
                        <label>
                            Email
                            <input
                                type="text"
                                id="email"
                                placeholder="Ingresa tu email"
                                value={credentials.email}
                                onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
                                maxLength={40} 
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </label>
                        <br/>
                        <label>
                            Clave
                            <div className="password-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="contrasena"
                                    placeholder="Ingresa tu clave"
                                    value={credentials.password}
                                    onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                                    maxLength={40}
                                />
                                <FontAwesomeIcon
                                    className="eye-icon"
                                    icon={showPassword ? faEye : faEyeSlash}
                                    onClick={togglePasswordVisibility}
                                />
                            </div>
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </label>
                        <br/>
                        <div className="center-button">
                            <input type="submit" id="submit" value="Iniciar Sesión" />
                        </div>
                    </form>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleModalClose} isError={isError}>
              <div>
                  <br/>
                  <p>{errorMessage}</p>
              </div>
          </Modal>
        </>
  );
}