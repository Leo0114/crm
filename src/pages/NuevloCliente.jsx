import { useNavigate, Form, useActionData, redirect } from "react-router-dom";
import Error from "../components/Error";
import Formulario from "../components/Formulario";
import { agregarCliente } from "../api/clientes";

export async function action({ request }) {
  const formData = await request.formData();
  const datos = Object.fromEntries(formData);

  //validacion de correo
  const email = formData.get("email");

  //Validacion
  const errores = [];
  if (Object.values(datos).includes("")) {
    errores.push("Todos los campos son obligatorios");
  }
  let regex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );
  if (!regex.test(email)) {
    errores.push("El email no es valido");
  }

  //Retornar datos en caso de errores
  if (Object.keys(errores).length) {
    return errores;
  }

  await agregarCliente(datos);
  return redirect("/");
}

const NuevloCliente = () => {
  const errores = useActionData();
  const navigate = useNavigate();
  return (
    <>
      <h1 className=" font-black text-4xl text-blue-900">Nuevo Cliente</h1>
      <p className=" mt-3">
        Llena todos los campos para registar un nuevo
        <span className=" text-blue-900 font-semibold"> cliente</span>
      </p>

      <div className=" flex justify-end">
        <button
          className=" rounded-lg bg-blue-800 text-white px-3 py-1 font-bold uppercase hover:bg-blue-600"
          onClick={() => {
            navigate("/");
          }}
        >
          Volver
        </button>
      </div>
      <div className=" bg-white shadow rounded-xl md:w-3/4 mx-auto px-5 py-10 mt-20">
        {errores?.length &&
          errores.map((error, i) => <Error key={i}>{error}</Error>)}
        <Form method="post" noValidate>
          <Formulario />

          <input
            type="submit"
            className=" mt-5 w-full bg-blue-800 font-bold text-white text-lg rounded-xl p-3  "
            value="Registrar Cliente"
          />
        </Form>
      </div>
    </>
  );
};

export default NuevloCliente;
