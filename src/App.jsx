import {Routes, Route} from 'react-router-dom'
import {Login} from './componentes/Login/Login'
import {Layout} from './componentes/Layout/Layout'

export function App() {
  return(
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/Home" element={<Layout />}></Route>
    </Routes>
  )
}
