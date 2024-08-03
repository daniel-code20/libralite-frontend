import { gql } from "@apollo/client";
import client from "../main";

// Define el tipo de datos para representar los roles de usuario
export const UserRoles = {
  CLIENT: "CLIENT",
  ADMIN: "ADMIN",
} as const;
export type UserRole = keyof typeof UserRoles;

// Define la interfaz para el objeto de usuario
interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Función para autenticar al usuario
export const authenticateUser = async (
  email: string,
  password: string
): Promise<AuthenticatedUser> => {
  const LOGIN_MUTATION = gql`
    mutation AuthenticateUser($email: String!, $password: String!) {
      authenticateUserWithPassword(email: $email, password: $password) {
        ... on UserAuthenticationWithPasswordSuccess {
          item {
            id
            name
            email
            role
          }
          sessionToken
        }
      }
    }
  `;
  try {
    const { data } = await client.mutate<{
      authenticateUserWithPassword: { item: AuthenticatedUser };
    }>({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });
  
    console.log('Data from server:', data);
  
    if (
      data &&
      data.authenticateUserWithPassword &&
      data.authenticateUserWithPassword.item
    ) {
      return data.authenticateUserWithPassword.item;
    }
  
    throw new Error("Invalid email or password");
  } catch (error) {
    console.error('Error from server:', error);
    throw new Error("Authentication failed");
  }
  
};

// Función para verificar el rol de un usuario autenticado
export const checkUserRole = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  return userRole === requiredRole;
};

export const logoutUser = () => {
  localStorage.removeItem('userId');
};
