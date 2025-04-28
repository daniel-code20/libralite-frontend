import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    Input,
    useDisclosure,
  } from "@nextui-org/react";
  import { useState, useRef } from "react";
  import React from "react";
  import { gql, useApolloClient } from "@apollo/client";
  import Swal from "sweetalert2";
  import { GoPlus } from "react-icons/go";
  
  const CREATE_SUCURSAL_MUTATION = gql`
    mutation CreateSucursal($data: SucursalCreateInput!) {
      createSucursal(data: $data) {
        id
        name
        address
        city
        postal
      }
    }
  `;
  
  const AdminSucursalModal: React.FC = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [sucursalData, setSucursalData] = useState({
      name: "",
      address: "",
      city: "",
      postal: "",
    });
    const client = useApolloClient();
    const formRef = useRef<HTMLFormElement>(null);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSucursalData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      try {
        await client.mutate({
          mutation: CREATE_SUCURSAL_MUTATION,
          variables: {
            data: {
              name: sucursalData.name,
              address: sucursalData.address,
              city: sucursalData.city,
              postal: sucursalData.postal,
            },
          },
        });
  
        Swal.fire({
          title: "¡Excelente!",
          text: "Sucursal creada exitosamente",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
  
        setSucursalData({
          name: "",
          address: "",
          city: "",
          postal: "",
        });
        formRef.current?.reset();
      } catch (error) {
        console.error("Error al crear la sucursal:", error);
        Swal.fire({
          title: "Error",
          text: "Error al crear la sucursal",
          icon: "error",
        });
      }
    };
  
    return (
      <>
        <Button
          color="primary"
          radius="sm"
          variant="solid"
          onClick={onOpen}
          className="font-normal flex items-center gap-2"
        >
          <GoPlus size={25} />
          Agregar Sucursal
        </Button>
  
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Agregar Sucursal
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit} ref={formRef}>
                    <div>
                      <label>Nombre</label>
                      <Input
                        type="text"
                        className="w-full p-2 rounded"
                        name="name"
                        value={sucursalData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Dirección</label>
                      <Input
                        type="text"
                        className="w-full p-2 rounded"
                        name="address"
                        value={sucursalData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Ciudad</label>
                      <Input
                        type="text"
                        className="w-full p-2 rounded"
                        name="city"
                        value={sucursalData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Código Postal</label>
                      <Input
                        type="text"
                        className="w-full p-2 rounded"
                        name="postal"
                        value={sucursalData.postal}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
  
                    <Button
                      type="submit"
                      color="primary"
                      radius="sm"
                      variant="flat"
                      className="mr-4 mt-4 mb-4 font-medium"
                    >
                      Agregar
                    </Button>
                    <Button
                      color="danger"
                      variant="light"
                      radius="sm"
                      onClick={onClose}
                    >
                      Cancelar
                    </Button>
                  </form>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default AdminSucursalModal;
  