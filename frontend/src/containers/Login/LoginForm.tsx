import { useState, useEffect } from 'react';
import isUsernamePasswordValid from './FormValidation';
import apiCalls from '../../Requests/apiCalls';

function LoginForm() {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ responseMessage, setResponseMessage ] = useState("");
  const [ disableForm, setDisableForm ] = useState(false);

  useEffect(() => {
    if (responseMessage !== "") {
      setDisableForm(true);
      console.log("response message", responseMessage);

    }
  }, [responseMessage])

  function handleUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function clearForm() {
    document.getElementById("login-form").reset()
    setUsername("");
    setPassword("");
  };

  async function handleLogin(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (!isUsernamePasswordValid(username, password)) {
      return;
    };
    try {
      const response = await apiCalls.login({ 
        username: username, 
        password: password 
      });

      if (!response.success) {
        alert(response.message);
      } else {
        setResponseMessage(response.message);
        // setTimeout(()=> window.location.reload(), 2500);
      }

    } catch (error) {
      console.error("login error line 28", error);
    };
  };

  async function handleSignUp(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (!isUsernamePasswordValid(username, password)) {
      return;
    };
    // Send request to sign up
    try {
      const response = await apiCalls.register({ 
        username: username, 
        password: password 
      });

      if (!response.success) {
        alert(response.message);
      } else {
        setResponseMessage(response.message);
        setTimeout(()=> window.location.reload(), 2500);
      }

    } catch (error) {
      console.error("signup error line 60", error);
    };
  };

  return (
    <form className="login-form" id="login-form" action="/login" method="POST">
      <fieldset disabled={disableForm}>
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
          password="password" 
          // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}" 
          title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
          onChange={handlePassword}
          required/>
        <div className="login-buttons">
          <button onClick={handleLogin}>Log in</button>
          <button onClick={handleSignUp}>Sign up</button>
        </div>
        <p><i>{responseMessage}</i></p>
      </fieldset>
    </form>
  );
}

export default LoginForm;