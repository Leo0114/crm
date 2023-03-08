const Error = ({ children }) => {
  return (
    <div className=" text-center my-4 p-3 uppercase text-white bg-red-600 rounded-lg font-bold">
      {children}
    </div>
  );
};

export default Error;
