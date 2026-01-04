import { useState } from 'react';
import isUsernamePasswordValid from './FormValidation';
import apiCalls from './../../Requests/apiCalls';

function LoginForm() {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");

  function handleUsername(e) {
    setUsername(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!isUsernamePasswordValid(username, password)) {
      return;
    };
    try {
      const response = apiCalls.login({ 
        username: username, 
        password: password 
      })
    } catch (error) {
      console.error(error);
    }
  };

  function handleSignUp(e) {
    e.preventDefault();
    if (!isUsernamePasswordValid(username, password)) {
      return;
    };
    // Send request to sign up
  };

  return (
    <form className="login-form" action="/login" method="POST">
        <label htmlFor="username">Username:</label>
        <input 
          username="username" 
          // minLength="5" 
          // maxLength="15" 
          title="Must contain 5 to 15 characters"
          onChange={handleUsername}
          required />
        <br/>
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          username="password" 
          // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}" 
          title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
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