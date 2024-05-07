//const URL = 'https://api-bedmanagement.azurewebsites.net/api/'
const URL = process.env.REACT_API_URL

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

