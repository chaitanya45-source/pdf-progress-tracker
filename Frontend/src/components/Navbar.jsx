import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  UserRound,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import {
  getCurrentUser,
  logoutUser,
} from "../api/auth.api";

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/library", label: "My Library" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      setOpen(false);
      setMobileOpen(false);
      navigate({ to: "/" });
    },
  });

  const user = data?.user;

  return (
    <header className="w-full bg-[#f8f5ef] border-b border-stone-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between relative">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 min-w-0" onClick={() => setMobileOpen(false)}>
          <div className="bg-[#bd5d35] text-white p-2 rounded-xl flex items-center justify-center h-11 w-11 sm:h-14 sm:w-14 shrink-0">
            <FileText size={22} className="sm:hidden" />
            <FileText size={28} className="hidden sm:block" />
          </div>

          <div className="min-w-0">
            <h1 className="font-bold text-lg sm:text-2xl text-stone-900 truncate">
              PDFTracker
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 truncate hidden sm:block">
              Progress & Reading Analytics
            </p>
          </div>
        </Link>


        {/* CENTER NAVIGATION — desktop */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-stone-200 bg-stone-50 p-1">

            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={link.exact ? { exact: true } : undefined}
                activeProps={{
                  className:
                    "px-5 py-2.5 rounded-xl bg-white text-[#bd5d35] font-medium shadow-sm",
                }}
                inactiveProps={{
                  className:
                    "px-5 py-2.5 rounded-xl text-stone-700 hover:text-[#bd5d35] transition",
                }}
              >
                {link.label}
              </Link>
            ))}

          </nav>
        )}


        {/* RIGHT SIDE — desktop */}
        <div className="hidden md:flex items-center gap-8">

          {user ? (
            <div className="relative">

              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-stone-800 font-medium"
              >
                <UserRound size={18} />

                <span>
                  {user.username}
                </span>

                <ChevronDown
                  size={17}
                  className={`transition ${open ? "rotate-180" : ""
                    }`}
                />
              </button>


              {open && (
                <div className="absolute right-0 mt-3 w-36 bg-white border border-stone-200 rounded-xl shadow-lg p-1 z-50">

                  <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="
                  w-full
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-lg
                  text-sm
                  text-stone-700
                  hover:bg-stone-100
                "
                  >
                    <LogOut size={17} />

                    {logoutMutation.isPending
                      ? "Signing Out..."
                      : "Sign Out"}
                  </button>

                </div>
              )}

            </div>
          ) : (
            !isLoading && (
              <Link
                to="/auth"
                className="
              px-5
              py-2.5
              border
              border-stone-300
              rounded-full
              bg-white
              text-stone-800
              font-medium
              hover:bg-stone-100
            "
              >
                Sign In
              </Link>
            )
          )}

        </div>


        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 transition"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>


      {/* MOBILE SLIDE-DOWN MENU */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          mobileOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-stone-200 px-6 py-4">

          {user && (
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  activeOptions={link.exact ? { exact: true } : undefined}
                  activeProps={{
                    className:
                      "px-4 py-3 rounded-xl bg-white text-[#bd5d35] font-medium shadow-sm",
                  }}
                  inactiveProps={{
                    className:
                      "px-4 py-3 rounded-xl text-stone-700 hover:text-[#bd5d35] transition",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className={user ? "mt-3 pt-3 border-t border-stone-200" : ""}>

            {user ? (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-800 font-medium text-sm">
                  <UserRound size={17} />
                  {user.username}
                </span>

                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-white transition disabled:opacity-60"
                >
                  <LogOut size={15} />
                  {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
                </button>
              </div>
            ) : (
              !isLoading && (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-5 py-2.5 border border-stone-300 rounded-full bg-white text-stone-800 font-medium hover:bg-stone-100"
                >
                  Sign In
                </Link>
              )
            )}

          </div>

        </div>
      </div>

    </header>
  );
};

export default Navbar;