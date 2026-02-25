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
    <form className="mt-6" id="login-form" action="/login" method="POST">
      <fieldset disabled={disableForm}>
        <label htmlFor="username" className="mb-1 block text-sm font-medium text-zinc-200">Username</label>
        <input 
          id="username"
          name="username"
          className="mb-3 w-full rounded-md border border-zinc-500 bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 disabled:cursor-not-allowed disabled:opacity-70"
          title="Must contain 5 to 15 characters"
          onChange={handleUsername}
          required />
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-200">Password</label>
        <input 
          id="password"
          name="password"
          type="password" 
          className="mb-3 w-full rounded-md border border-zinc-500 bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 disabled:cursor-not-allowed disabled:opacity-70"
          title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
          onChange={handlePassword}
          required/>
        <div className="mt-5 flex justify-between gap-3">
          <button className="control-button flex-1" onClick={handleLogin}>Log in</button>
          <button className="control-button flex-1" onClick={handleSignUp}>Sign up</button>
        </div>
        <p className="mt-4 min-h-5 text-sm italic text-emerald-300">{responseMessage}</p>
      </fieldset>
    </form>
  );
}

export default LoginForm;