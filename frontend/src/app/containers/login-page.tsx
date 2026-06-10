import { Link, useNavigate } from "react-router";
import AuthShell from "../components/auth/auth-shell";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsLoggedIn,
  useAppDispatch,
  useAppSelector,
} from "../data/store";
import { useEffect, useState } from "react";
import { AuthUsecase } from "../usecases/auth.usecase";
import { toast } from "react-toastify";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const loggedIn = useAppSelector(selectIsLoggedIn);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!attempted) return;
    if (loggedIn) {
      navigate("/");
    }
    if (authError) {
    }
  }, [loggedIn, authError, attempted, navigate]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttempted(true);
    new AuthUsecase(dispatch).login({ email, password });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-sage-400 hover:text-sage-300">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Inline error for accessibility — toast shows it too */}
        {authError && attempted && (
          <p
            className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2"
            role="alert"
          >
            {authError}
          </p>
        )}
        <div className="space-y-1">
          <label className="text-xs text-stone-500 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
            required
            autoFocus
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-stone-500 uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-xs text-stone-600 text-center">
          Demo: demo@wellness.test / password
        </p>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
