export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
export const OBJECT_ID_RULE_MESSAGE =
  "Your string fails to match the Object Id pattern!";

export const REG_EMAIL = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const REG_EMAIL_MESSAGE = "Your email does not match the expression!";

export const REG_PASSWORD =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[ !#$%&*?@^-]).{8,}$/;
export const REG_PASSWORD_MESSAGE =
  "Your password does not match the expression!";
