import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Beautiful Design Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary/99 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-primary-glow/30 rounded-full blur-xl animate-pulse delay-500" />
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Welcome to Your
              <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
                Course Journey
              </span>
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Experience seamless authentication with our modern, secure platform designed for the future.
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-glow rounded-full animate-pulse" />
                <span className="text-white/90">Secure & Encrypted</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200" />
                <span className="text-white/90">Fast & Reliable</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-400" />
                <span className="text-white/90">Modern Experience</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Login Form Side */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;