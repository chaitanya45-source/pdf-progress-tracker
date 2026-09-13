import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import { useNavigate } from "@tanstack/react-router";

const Login = ({ state }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      navigate({ to: "/dashboard" });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleToggle = (showLogin) => {
    if (typeof state === "function") {
      state(showLogin);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">

          {/* Toggle */}
          <div className="flex bg-stone-100 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => handleToggle(true)}
              className="flex-1 py-2.5 rounded-lg bg-white text-[#bd5d35] font-semibold shadow-sm"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => handleToggle(false)}
              className="flex-1 py-2.5 rounded-lg text-stone-500 hover:text-stone-900"
            >
              Register
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-7">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-[#f5e4db] text-[#bd5d35] flex items-center justify-center">
              <LogIn size={24} />
            </div>

            <h1 className="text-2xl font-bold text-stone-900">
              Welcome Back
            </h1>

            <p className="text-sm text-stone-500 mt-1">
              <i>Login to access your PDFs</i>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#bd5d35] focus:ring-4 focus:ring-[#bd5d35]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-11 text-sm outline-none focus:border-[#bd5d35] focus:ring-4 focus:ring-[#bd5d35]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {loginMutation.isError && (
              <p className="text-center text-sm text-red-500">
                {loginMutation.error.message}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#bd5d35] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#a94f2d] transition disabled:opacity-60"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}

              {!loginMutation.isPending && <ArrowRight size={18} />}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;