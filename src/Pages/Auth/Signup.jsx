import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../Contexts/AuthContext";

import AuthInput from "./Components/AuthInput";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();

  const navigate = useNavigate();

  const accountSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match.");
    }

    try {
      setError("");
      setLoading(true);

      await signup(emailRef.current.value, passwordRef.current.value);

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
          Sign Up
        </h2>
        <AuthInput type="email" placeholder="Email" ref={emailRef} />
        <AuthInput type="password" placeholder="Password" ref={passwordRef} />
        <AuthInput
          type="password"
          placeholder="Confirm Password"
          ref={passwordConfirmRef}
        />
        <button
          disabled={loading}
          className="bg-brand disabled:bg-brand/50 ml-auto mt-4 rounded-lg px-6 py-2 font-sans text-white"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <span className="text-editor mt-4 font-serif text-sm">
        Already have an account? Log in{" "}
        <Link className="underline" to="/login">
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
