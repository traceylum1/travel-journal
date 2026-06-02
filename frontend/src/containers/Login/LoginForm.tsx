import { useState } from 'react';
import { getLoginFieldErrors } from './FormValidation';
import { useAuth } from '../../context/useAuth';

type FieldErrors = {
  username?: string;
  password?: string;
};

function LoginForm() {
  const { login, register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [responseMessage, setResponseMessage] = useState("");
  const [responseIsError, setResponseIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
    if (fieldErrors.username) {
      setFieldErrors((prev) => ({ ...prev, username: undefined }));
    }
  }

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  }

  function validateFields(): boolean {
    const errors = getLoginFieldErrors(username, password);
    setFieldErrors(errors);
    if (errors.username || errors.password) {
      setResponseMessage("");
      setResponseIsError(false);
      return false;
    }
    return true;
  }

  async function handleLogin() {
    if (!validateFields()) {
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setResponseMessage("");
    setResponseIsError(false);
    try {
      const response = await login({
        username: username,
        password: password,
      });

      if (!response.success) {
        setResponseMessage(response.message);
        setResponseIsError(true);
      } else {
        setResponseMessage(response.message);
        setResponseIsError(false);
      }
    } catch (error) {
      console.error("login error", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignUp() {
    if (!validateFields()) {
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setResponseMessage("");
    setResponseIsError(false);
    try {
      const response = await register({
        username: username,
        password: password,
      });

      if (!response.success) {
        setResponseMessage(response.message);
        setResponseIsError(true);
      } else {
        setResponseMessage(response.message);
        setResponseIsError(false);
      }
    } catch (error) {
      console.error("signup error", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  const inputBorderClass = (hasError: boolean) =>
    hasError ? "border-red-500" : "border-zinc-500";

  return (
    <form className="mt-6" id="login-form" onSubmit={handleSubmit} noValidate>
      <fieldset disabled={isSubmitting}>
        <label htmlFor="username" className="mb-1 block text-sm font-medium text-zinc-200">Username</label>
        <input
          id="username"
          name="username"
          className={`mb-1 w-full rounded-md border bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 disabled:cursor-not-allowed disabled:opacity-70 ${inputBorderClass(Boolean(fieldErrors.username))}`}
          title="Must contain 5 to 15 characters"
          onChange={handleUsername}
          aria-invalid={fieldErrors.username ? true : undefined}
          aria-describedby={fieldErrors.username ? "username-error" : undefined}
          required
        />
        <p
          id="username-error"
          className="mb-3 min-h-5 text-sm text-red-400"
          role="alert"
        >
          {fieldErrors.username ?? ""}
        </p>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-200">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className={`mb-1 w-full rounded-md border bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 disabled:cursor-not-allowed disabled:opacity-70 ${inputBorderClass(Boolean(fieldErrors.password))}`}
          title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
          onChange={handlePassword}
          aria-invalid={fieldErrors.password ? true : undefined}
          aria-describedby={fieldErrors.password ? "password-error" : undefined}
          required
        />
        <p
          id="password-error"
          className="mb-3 min-h-5 text-sm text-red-400"
          role="alert"
        >
          {fieldErrors.password ?? ""}
        </p>
        <div className="mt-5 flex justify-between gap-3">
          <button
            type="button"
            className="control-button flex-1"
            disabled={isSubmitting}
            onClick={() => void handleLogin()}
          >
            {isSubmitting ? "Logging in…" : "Log in"}
          </button>
          <button
            type="button"
            className="control-button flex-1"
            disabled={isSubmitting}
            onClick={() => void handleSignUp()}
          >
            {isSubmitting ? "Signing up…" : "Sign up"}
          </button>
        </div>
        <p
          className={`mt-4 min-h-5 text-sm italic ${responseIsError ? "text-red-400" : "text-emerald-300"}`}
          role={responseMessage ? "status" : undefined}
        >
          {responseMessage}
        </p>
      </fieldset>
    </form>
  );
}

export default LoginForm;
