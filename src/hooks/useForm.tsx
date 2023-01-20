import { useState } from "react";

const types: any = {
  email: {
    regex: /^\S+@\S+\.\S+$/,
    message: "Preencha um e-mail válido",
  },
  password: {
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    message:
      "A senha precisa ter 1 carácter maiúsculo, 1 carácter minúsculo e 1 número. Com no mínimo 8 caracteres.",
  },
};

const useForm = (type?: any) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function validate(value: string) {
    if (type === false) return true;
    if (value.length === 0) {
      setError("Preencha um valor");
      return false;
    } else if (types[type] && !types[type].regex.test(value)) {
      setError(types[type].message);
      return false;
    } else {
      setError("");
      return true;
    }
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (error) validate(target.value);
    setValue(target.value);
  };

  return {
    value,
    setValue,
    onChange,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value),
  };
};

export default useForm;
