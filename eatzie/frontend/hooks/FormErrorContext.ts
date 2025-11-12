import { createContext, useContext } from "react";

export const FormErrorContext = createContext({
  showError: false,
});

export const useFormError = () => useContext(FormErrorContext);
