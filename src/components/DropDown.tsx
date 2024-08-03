import React, { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import { useQuery, gql } from '@apollo/client';

interface Sucursal {
  id: string;
  name: string;
}

const GET_SUCURSAL = gql`
  query Sucursals {
    sucursals {
      id
      name
    }
  }
`;

interface DropDownProps {
  onSelectSucursal: (id: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({ onSelectSucursal }) => {
  const [selectedSucursal, setSelectedSucursal] = useState<string>('Sucursal');
  const { loading, error, data } = useQuery<{ sucursals: Sucursal[] }>(GET_SUCURSAL);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.sucursals) return <p>No data available</p>;

  const items = data.sucursals.map((sucursal) => ({
    key: sucursal.id,
    label: sucursal.name,
    onClick: () => {
      setSelectedSucursal(sucursal.name);
      onSelectSucursal(sucursal.id);  // Pasar el ID en lugar del nombre
    },
  }));

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="text-black" radius="sm" color='default'>
          {selectedSucursal}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions">
        {items.map((item) => (
          <DropdownItem key={item.key} onClick={item.onClick}>
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDown;
