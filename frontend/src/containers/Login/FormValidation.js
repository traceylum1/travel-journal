function isUsernameValid(username) {
    /* 
        Usernames can only have: 
        - Lowercase Letters (a-z) 
        - Numbers (0-9)
        - Dots (.)
        - Underscores (_)
    */
    const re = {
        alphanum: /^[a-z0-9]+$/,
        length: /(?=.{5,15}$)/,
    };
    return (
        re.alphanum.test(username) &&
        re.length.test(username)
    );
};

function isPasswordValid(password) {
    const re = {
        capital: /(?=.*[A-Z])/,
        length: /(?=.{8,20}$)/,
        specialChar: /[ -/:-@[-`{-~]/,
        digit: /(?=.*[0-9])/,
    };
    return (
        re.capital.test(password) &&
        re.length.test(password) &&
        re.specialChar.test(password) &&
        re.digit.test(password)
    );
};

function isUsernamePasswordValid(username, password) {
    if (!isUsernameValid(username)) {
        alert("Username must contain between 5 and 15 alphanumeric characters.");
        return false;
    }
    if (!isPasswordValid(password)) {
        alert("Password must contain at least one number, one special character, one uppercase and lowercase letter, and at least 8 or more characters.");
        return false;
    }
    return true;
};

export default isUsernamePasswordValid;