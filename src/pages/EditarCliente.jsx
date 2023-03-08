import {
  Form,
  useNavigate,
  useLoaderData,
  useActionData,
  redirect,
} from "react-router-dom";
import { obtenerCliente, actualizarCliente } from "../api/clientes";
import Error from "../components/Error";
import Formulario from "../components/Formulario";

export async function loader({ params }) {
  const cliente = await obtenerCliente(params.clienteId);
  if (Object.values(cliente).length === 0) {
    throw new Response("", { status: 404, statusText: "Cliente no existente" });
  }
  return cliente;
}
export async function action({ request, params }) {
  const formData = await request.formData();
  const datos = Object.fromEntries(formData);
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

  //actualizar cliente
  await actualizarCliente(params.clienteId, datos);
  return redirect("/");
}

const EditarCliente = () => {
  const navigate = useNavigate();
  const cliente = useLoaderData();
  const errores = useActionData();
  return (
    <>
      <h1 className=" font-black text-4xl text-blue-900">Editar Cliente</h1>
      <p className=" mt-3">
        Modifica los campos de un
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
          <Formulario cliente={cliente} />

          <input
            type="submit"
            className=" mt-5 w-full bg-blue-800 font-bold text-white text-lg rounded-xl p-3  "
            value="Actualizar Cliente"
          />
        </Form>
      </div>
    </>
  );
};

export default EditarCliente;
