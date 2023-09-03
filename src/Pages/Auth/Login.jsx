import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../Contexts/AuthContext";

import AuthInput from "./Components/AuthInput";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const accountSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      await login(emailRef.current.value, passwordRef.current.value);

      navigate("/");
    } catch (err) {
      const e = err.message;
      const msg = e.substring(e.indexOf(":") + 2, e.indexOf("("));
      const type = e
        .substring(e.indexOf("/") + 1, e.lastIndexOf(")"))
        .replaceAll("-", " ");

      setError(`${msg} - ${type}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <form
        onSubmit={accountSubmit}
        className="flex flex-col gap-4 rounded-lg px-12 py-8 shadow-lg"
      >
        <h2 className="text-text-dark mb-4 text-center font-serif text-2xl">
          Log In
        </h2>
        <AuthInput type="email" placeholder="Email" ref={emailRef} />
        <AuthInput type="password" placeholder="Password" ref={passwordRef} />
        <div className="mt-4 flex items-center justify-between">
          <Link to="/reset" className="text-brand font-sans text-sm">
            Reset Password
          </Link>
          <button
            disabled={loading}
            className="bg-brand disabled:bg-brand/50 rounded-lg px-6 py-2 font-sans text-white"
            type="submit"
          >
            Log In
          </button>
        </div>
      </form>
      <span className="text-editor mt-4 font-serif text-sm">
        Need an account? Sign up{" "}
        <Link className="underline" to="/signup">
          here
        </Link>
        .
      </span>
      {error && (
        <div className="font-roboto mt-4 text-sm text-red-500">{error}</div>
      )}
    </div>
  );
}
