const URL = 'https://api-bedmanagement.azurewebsites.net/api/'
//const URL = 'http://localhost:5220/api/'


export function login(email, contrasena){
    let credential = {email, contrasena}
    return fetch(URL+'Login',{
        method:'POST',
        body:JSON.stringify(credential),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(response => response.json())
}

export function GetUsers(token){
    return fetch(URL+'Usuario',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function GetUsersByFilters(rut, nombre, token){
    let url = URL + 'Usuario/rut/nombre';

    if (rut) {
        url = url + '?rut=' + rut;
    }

    if (nombre) {
        if(rut){
            url = url + '&nombre=' + nombre;
        }
        else{
            url = url + '?nombre=' + nombre;
        }
    }

    return fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function UserCreate(rut, nombre, contrasena, email, idRol, token){
    let user = {rut, nombre, contrasena, email, idRol}
    return fetch(URL+'Usuario',{
        method:'POST',
        body:JSON.stringify(user),
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function UserUpdate(rut, nombre, contrasena, email, idRol, token){
    let user = {rut, nombre, contrasena, email, idRol}
    return fetch(URL+'Usuario',{
        method:'PUT',
        body:JSON.stringify(user),
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function UserDelete(rut, token){
    return fetch(URL+'Usuario/rut?rut='+rut,{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function GetRoles(token){
    return fetch(URL+'Rol',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function GetIngresosGestion(token){
    return fetch(URL+'Ingreso',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function GetIngresosByFilters(rut, nombre, token){
    let url = URL + 'Ingreso/rut/nombre';

    if (rut) {
        url = url + '?rut=' + rut;
    }

    if (nombre) {
        if(rut){
            url = url + '&nombre=' + nombre;
        }
        else{
            url = url + '?nombre=' + nombre;
        }
    }

    return fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function IngresoUpdate(idIngreso, idCama, idUsuario, token){
    let ingreso = {idIngreso, idCama, idUsuario}
    return fetch(URL+'Ingreso',{
        method:'PUT',
        body:JSON.stringify(ingreso),
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function GetSalaByUnidad(idUnidad, token){
    return fetch(URL+'Sala/unidadId?unidadId='+ idUnidad,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}


export function GetCamaBySala(idSala, token){
    return fetch(URL+'Cama/salaId?salaId='+ idSala,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function CountsCamaByUnidad(idUnidad, token){
    return fetch(`${URL}Cama/unidadId?unidadId=${idUnidad}`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}

export function CountsIngresosPendientes(token){
    return fetch(`${URL}Ingreso/counter`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
}