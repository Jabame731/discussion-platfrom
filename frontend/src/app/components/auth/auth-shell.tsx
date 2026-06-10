import type { ReactNode } from "react";
import { Link } from "react-router";

const AuthShell = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sage-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-900/20 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sage-700 flex items-center justify-center">
              <img src="meditation.png" />
            </div>
            <span className="text-xl text-stone-100">Wellness Hub</span>
          </Link>
        </div>
        <div className="card p-8">
          <h1 className="text-2xl text-stone-100 mb-1">{title}</h1>
          <p className="text-stone-500 text-sm mb-6">{subtitle}</p>
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-stone-600 mt-4">{footer}</p>
        )}
      </div>
    </div>
  );
};

export default AuthShell;
