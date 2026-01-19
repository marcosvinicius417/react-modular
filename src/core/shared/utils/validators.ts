type stringValidator = (_?: string) => boolean;

export const shortRequiredErrorMsg = "Obrigatório.";

export const requiredErrorMsg = "Preenchimento obrigatório";

export const invalidErrorMsg = "Campo inválido.";

export const incompleteErrorMsg = "Preenchimento obrigatório";

export const emailRegex = /\S+@\S+\.\S+/;

export const isStringWithSameRepeatingCharacter = (s: string): boolean => {
  for (let i = 1; i < s.length; i++) {
    if (s[i] != s[0]) return false;
  }

  return true;
};

export const isCnpj = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj.length != 14 || isStringWithSameRepeatingCharacter(cnpj)) {
    return false;
  }

  let length = cnpj.length - 2;
  let number = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(number.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }

  length = length + 1;
  number = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(number.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return result === parseInt(digits.charAt(1));
};

export const isCpf = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11 || isStringWithSameRepeatingCharacter(cpf)) {
    return false;
  }

  let add = 0;
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;

  if (rev !== parseInt(cpf.charAt(9))) {
    return false;
  }

  add = 0;

  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }

  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;

  return rev === parseInt(cpf.charAt(10));
};

export const isLenBetween =
  ({ min, max }: { min: number; max: number }): stringValidator =>
  (v?: string) =>
    !!v && v.length >= min && v.length <= max;

export const isValidDatePeriod =
  (opts: {
    required: boolean;
    validateYear: boolean;
    requiredErrorMsg?: string;
    incompleteErrorMsg?: string;
    periodTooShortErrorMsg?: string;
    invalidEndDateErrorMsg?: string;
    invalidStartDateErrorMsg?: string;
  }) =>
  (v?: string) => {
    const parseDate = (v: string) => {
      const [day, month, year] = v.split("/");

      if (opts.validateYear && (!year || year.length !== 4)) {
        return { isValid: false, ellapsed: 0 };
      }

      const dtStr = opts.validateYear
        ? `${month}/${day}/${year}`
        : `${month}/${day}/2010`;

      const ellapsed = Date.parse(dtStr);
      const isValid = !Number.isNaN(ellapsed);

      return { isValid, ellapsed };
    };

    if (!v) {
      return opts.required
        ? opts.requiredErrorMsg ?? "Preenchimento obrigatório"
        : true;
    }

    const [ini, fim] = v.split(" - ");

    if ((ini && !fim) || (!ini && fim)) {
      return opts.incompleteErrorMsg ?? "Período incompleto";
    }

    const { isValid: inicioIsValid, ellapsed: iniEllapsed } = parseDate(ini);

    if (!inicioIsValid) {
      return opts.invalidStartDateErrorMsg ?? "Data de início inválida";
    }

    const { isValid: fimIsValid, ellapsed: fimEllapsed } = parseDate(fim);

    if (!fimIsValid) {
      return opts.invalidEndDateErrorMsg ?? "Data final inválida";
    }

    if (iniEllapsed === fimEllapsed) {
      return (
        opts.periodTooShortErrorMsg ?? "Período deve conter ao menos um dia"
      );
    }

    if (iniEllapsed > fimEllapsed) {
      return "Data de início deve anteceder data final";
    }

    return true;
  };

export const withMessage =
  (validator: stringValidator, message: string) => (v?: string) =>
    validator(v) || message;
