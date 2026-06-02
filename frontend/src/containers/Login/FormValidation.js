export const USERNAME_ERROR =
  "Username must contain between 5 and 15 alphanumeric characters or underscores.";

export const PASSWORD_ERROR =
  "Password must contain at least one number, one special character, one uppercase and lowercase letter, and at least 8 or more characters.";

function isUsernameValid(username) {
  /*
        Usernames can only have:
        - Lowercase Letters (a-z)
        - Uppercase Letters (A-Z)
        - Numbers (0-9)
        - Underscores (_)
    */
  const re = {
    alphanum: /^[a-zA-Z0-9_]+$/,
    length: /(?=.{5,15}$)/,
  };
  return re.alphanum.test(username) && re.length.test(username);
}

function isPasswordValid(password) {
  /*
        Password must include:
        - A lowercase letter
        - An uppercase letter
        - 8-20 characters
        - A special char
        - A numerical digit
    */
  const re = {
    lowercase: /(?=.*[a-z])/,
    uppercase: /(?=.*[A-Z])/,
    length: /(?=.{8,20}$)/,
    specialChar: /[ -/:-@[-`{-~]/,
    digit: /(?=.*[0-9])/,
  };
  return (
    re.lowercase.test(password) &&
    re.uppercase.test(password) &&
    re.length.test(password) &&
    re.specialChar.test(password) &&
    re.digit.test(password)
  );
}

/** @returns {{ username?: string, password?: string }} */
export function getLoginFieldErrors(username, password) {
  const errors = {};
  if (!isUsernameValid(username)) {
    errors.username = USERNAME_ERROR;
  }
  if (!isPasswordValid(password)) {
    errors.password = PASSWORD_ERROR;
  }
  return errors;
}
