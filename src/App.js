import React, { useState, useEffect } from "react";
import { store } from "./firebaseconfig";
import swal from 'sweetalert';


function App() {

  const [idUsuario, setIdUsuario] = useState("")
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [usuario, setUsuario] = useState([]);
  const [error, setError] = useState("");
  const [modoEdicion, setModoEdicion] = useState(null);

  const setUsuarios = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      swal("El campo nombre esta vacío!");
      return;
    } else if (!telefono.trim()) {
      swal("El campo telefono esta vacío!");
      return;
    }
    const usuario = {
      nombre: nombre,
      telefono: telefono
    }
    try {
      const data = await store.collection("agenda").add(usuario);
      console.log("usuario añadido");
      const { docs } = await store.collection("agenda").get();
      const nuevoArray = docs.map(item => ({
        id: item.id,
        ...item.data()
      }))
      setUsuario(nuevoArray);
      swal("¡Bien hecho!", "Agregaste un contacto exitosamente", "success");
    } catch (e) {
      console.log(e)
    }
    setNombre("");
    setTelefono("")
  }

  useEffect(() => {
    const setUsuarios = async (e) => {
      const { docs } = await store.collection("agenda").get();
      const nuevoArray = docs.map(item => ({
        id: item.id,
        ...item.data()
      }))
      setUsuario(nuevoArray)
    }
    setUsuarios();
  }, [])

  const borrarUsuario = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    try {
      await store.collection("agenda").doc(id).delete()
      const { docs } = await store.collection("agenda").get();
      const nuevoArray = docs.map(item => ({
        id: item.id,
        ...item.data()
      }))
      setUsuario(nuevoArray)
    } catch (e) {
      console.log(e)
    }
  }

  const actualizar = async (id) => {
    try {
      const data = await store.collection("agenda").doc(id).get();
      const { nombre, telefono } = data.data()
      console.log(nombre,telefono)
      setNombre(nombre);
      setTelefono(telefono);
      setIdUsuario(id);
      console.log(id);
      setModoEdicion(true);
    } catch (e) {
      console.log(e)
    }
  }

  const setUpdate = async (e) =>{
    e.preventDefault()
    if (!nombre.trim()) {
      setError("El campo nombre está vacio")
    } else if (!telefono.trim()) {
      setError("El campo telefono está vacio")
    }
    const usuarioEditado = {
      nombre: nombre,
      telefono : telefono
    }
    try{
      await store.collection("agenda").doc(idUsuario).set(usuarioEditado);
      const { docs } = await store.collection("agenda").get();
      const nuevoArray = docs.map(item => ({
        id: item.id,
        ...item.data()
      }))
      setUsuario(nuevoArray);
      swal("¡Bien hecho!", "Contacto modificado exitosamente", "success");
    }catch(e){
      console.log(e)
    }
    setNombre("");
    setTelefono("");
    setIdUsuario("");
    setModoEdicion(null)
  }

  const cancelarModificacion = () =>{
    setNombre("");
    setTelefono("")
    setModoEdicion(null);
    console.log("tocado")
  }
 
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Agregar un nuevo contacto.</h2>
          <form
            onSubmit={
              modoEdicion ? setUpdate : setUsuarios}
            className="form.group">
            <input
              value={nombre}
              onChange={(e) => { setNombre(e.target.value) }}
              className="form-control"
              type="text"
              placeholder="Introduce el nombre"
            ></input>
            <input
              value={telefono}
              maxlength="12"
              onChange={(e) => { setTelefono(e.target.value) }}
              className="form-control mt-3"
              placeholder="Introduce el teléfono"
            ></input>
            {
              modoEdicion ?
                (
                <div>
                <input
                  className="btn btn-outline-light btn-block mt-3"
                  type="submit"
                  value="Editar"
                >
                </input>
                <button
                  className="btn btn-outline-light btn-block mt-3"
                  onClick={cancelarModificacion}
                >Cancelar
                </button>
                </div>
                )
                :
                (<input
                  className="btn btn-outline-light btn-block mt-3"
                  type="submit"
                  value="Registrar"
                ></input>)
            }

          </form>
          {
            error ?
              (
                <div>
                  <p>{error}</p>
                </div>
              )
              :
              (<span>

              </span>)
          }
        </div>
        <div className="col">
          <h2>Contactos agendados.</h2>
          {
            usuario.length !== 0 ?
              (
                usuario.map(item => (
                  <ul className="list-group">
                    <li className="list-group-item" key={item.id}>{item.nombre} - {item.telefono}
                      <button
                        onClick={(id) => { swal({
                          title: "Estás seguro que queres eliminar este contacto?",
                          text: "Una vez borrado no podrás recuperarlo!",
                          icon: "warning",
                          buttons: true,
                          dangerMode: borrarUsuario,
                        })
                        .then((willDelete) => {
                          if (willDelete) {
                            borrarUsuario(item.id);
                            swal("Contacto eliminado!", {
                              icon: "success",
                            });
                          } else {
                            swal("Contacto a salvo!");
                          }
                        }) }}
                        className="btn btn-outline-secondary btn-sm float-right">ELIMINAR CONTACTO</button>
                      <button
                        onClick={(id) => { actualizar(item.id) }}
                        className="btn btn-outline-warning btn-sm float-right mr-1">EDITAR</button>
                    </li>
                  </ul>
                ))
              )
              :
              (
                <span>
                  Todavía no has agregado ningún usuario a tu agenda.
                </span>
              )
          }
        </div>
      </div>
    </div>
  );
}

export default App;
