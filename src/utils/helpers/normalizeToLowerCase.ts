export const normalizeStringToLowerCase = (str?: string): string => {
  if (!str) {
    return ""; // Devuelve una cadena vacía si el valor es undefined o null
  }
  return str.toString().toLowerCase().trim(); // Convierte a minúsculas y elimina espacios extra
};
