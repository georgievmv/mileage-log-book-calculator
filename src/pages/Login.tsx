import { FC, FormEvent, useState } from "react";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { authenticationMessage } from "../firebase";

const Login: FC<{ auth: Auth; authPersistenceReady: Promise<void> }> = ({ auth, authPersistenceReady }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await authPersistenceReady;
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (signInError) {
      setError(authenticationMessage(signInError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>Дневник за пробег</h1>
        <p>Влезте със служебния споделен профил.</p>
        <label htmlFor="email">Имейл</label>
        <input autoComplete="username" id="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
        <label htmlFor="password">Парола</label>
        <input autoComplete="current-password" id="password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
        {error && <p role="alert">{error}</p>}
        <button className="primary-button" disabled={isSubmitting} type="submit">{isSubmitting ? "Влизане…" : "Вход"}</button>
      </form>
    </main>
  );
};

export default Login;
