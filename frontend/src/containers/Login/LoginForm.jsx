import { useState } from 'react';

function LoginForm() {
  const [ name, setName ] = useState("");
  const [ password, setPassword ] = useState("");

  function handleUsername(e) {
    setName(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function handleLogin(e) {
    e.preventDefault();
    alert(name);
  }

  function handleSignUp(e) {
    e.preventDefault();
    alert(name);
  }

  return (
    <form className="login-form" action="/login" method="POST">
        <label htmlFor="username">Username:</label>
        <input 
          name="username" 
          minlength="5" 
          maxlength="15" 
          title="Must contain 5 to 15 characters"
          onChange={handleUsername}
          required />
        <br/>
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          name="password" 
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
          onChange={handlePassword}
          required/>
        <div className="login-buttons">
          <button onClick={handleLogin}>Log in</button>
          <button onClick={handleSignUp}>Sign up</button>
        </div>
        
    </form>
  );
}

export default LoginForm;