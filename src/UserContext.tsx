import { createContext, useCallback } from "react";
import { useState } from "react";
import { TOKEN_POST, TOKEN_VALIDATE_POST, USER_GET } from "./api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext(
  {} as {
    userLogin: (username: string, password: string) => Promise<void>;
    data: null | {
      nome: string;
      email: string;
      id: number;
      username: string;
    };
    userLogout: () => void;
    error: null | string;
    loading: boolean;
    login: boolean | null;
  }
);

type UserContextProviderProps = {
  children: React.ReactNode;
};

export const UserStorage = ({ children }: UserContextProviderProps) => {
  const [data, setData] = useState(null);
  const [login, setLogin] = useState(null as boolean | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userLogout = useCallback(async function () {
    setData(null);
    setError(null);
    setLoading(false);
    setLogin(false);
    window.localStorage.removeItem("token");
    navigate("/login");
  }, []);

  const getUser = async (token: string) => {
    const { url, options } = USER_GET(token);
    const response = await fetch(url, options);
    const json = await response.json();
    setData(json);
    setLogin(true);
    console.log(json);
  };

  const userLogin = async (username: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { url, options } = TOKEN_POST({ username, password });
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Erro: usuário ou senha inválidos");
      }
      const { token } = await response.json();
      window.localStorage.setItem("token", token);
      await getUser(token);
      navigate("/conta");
    } catch (error: any) {
      setError(error.message);
      setLogin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const autoLogin = async () => {
      const token = window.localStorage.getItem("token");
      try {
        if (token) {
          setError(null);
          setLoading(true);
          const { url, options } = TOKEN_VALIDATE_POST(token);
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error("Token inválido");
          }
          await getUser(token);
        }
      } catch (error: any) {
        userLogout();
      } finally {
        setLoading(false);
      }
    };
    autoLogin();
  }, [userLogout]);

  return (
    <UserContext.Provider
      value={{ userLogin, data, userLogout, error, loading, login }}
    >
      {children}
    </UserContext.Provider>
  );
};
