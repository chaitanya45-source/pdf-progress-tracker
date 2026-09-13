import React from "react";
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesColumn,
  Mic,
  Upload,
} from "lucide-react";
import { Link } from "@tanstack/react-router";


const Home = () => {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-stone-900 overflow-x-hidden">

      {/* Hero */}
      <section className="relative">

        {/* Decorative dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #D9CBBF 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 30% 20%, black 40%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 30% 20%, black 40%, transparent 90%)",
          }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-16 sm:py-20 lg:flex-row lg:px-8 lg:py-28">

          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#D9B8A8] bg-[#F3E4DC] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E4D30]">
              <Mic size={12} />
              Voice-Tracked Reading
            </span>

            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
              Read out loud.
              <br />
              <span className="text-[#B85C38]">Watch it follow along.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-stone-600 lg:mx-0 md:text-lg">
              PDFTracker listens as you read and highlights each word in
              real time — then remembers exactly where you stopped, every
              time.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                to="/auth"
                className="group flex items-center justify-center gap-2 rounded-full bg-[#B85C38] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B85C38]/20 transition hover:bg-[#9E4D30] hover:shadow-xl hover:shadow-[#B85C38]/25"
              >
                Get Started
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Product Preview — shows the actual highlight behavior */}
          <div className="w-full max-w-md flex-1">
            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-2xl shadow-stone-300/40 transition-transform duration-500 hover:-translate-y-1">

              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-medium text-stone-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B85C38] opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#B85C38]" />
                    </span>
                    LISTENING
                  </p>
                  <h3 className="mt-1 font-semibold text-stone-900">
                    System Design.pdf
                  </h3>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3E4DC] text-[#B85C38]">
                  <Mic size={16} />
                </div>
              </div>

              {/* Highlighted text mockup */}
              <div className="mt-5 rounded-2xl bg-[#F8F5EF] p-6">
                <div className="mx-auto max-w-70 rounded-lg border border-stone-200 bg-white px-5 py-5 shadow-sm">
                  <p className="text-[13px] leading-relaxed text-stone-400">
                    A <span className="rounded bg-stone-100 px-0.5">full-stack</span>{" "}
                    <mark className="rounded bg-[#FACC15] px-0.5 text-stone-900">
                      accommodation
                    </mark>{" "}
                    <mark className="rounded bg-[#FACC15] px-0.5 text-stone-900">
                      booking
                    </mark>{" "}
                    <span className="rounded bg-stone-100 px-0.5">platform</span>,
                    inspired by Airbnb, built on an{" "}
                    <span className="rounded bg-stone-100 px-0.5">MVC</span>{" "}
                    architecture.
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-700">
                    Reading Progress
                  </span>
                  <span className="font-mono font-bold tabular-nums text-[#B85C38]">
                    72%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full w-[72%] rounded-full bg-[#B85C38] transition-all duration-1000 ease-out" />
                </div>

                <p className="mt-2 font-mono text-xs tabular-nums text-stone-400">
                  Page 86 of 120
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#F8F5EF]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#B85C38]">
              Why PDFTracker?
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Everything you need to keep reading
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-stone-500">
              A simple place to manage your PDFs and understand your reading
              progress.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Feature 1 */}
            <div className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3E4DC] text-[#B85C38] transition-colors group-hover:bg-[#B85C38] group-hover:text-white">
                <Mic size={21} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Voice-Tracked Highlighting
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Read aloud and watch the page highlight along with your
                voice, word by word.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3E4DC] text-[#B85C38] transition-colors group-hover:bg-[#B85C38] group-hover:text-white">
                <BookOpen size={21} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                PDF Library
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Keep your reading material organized and easy to access.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3E4DC] text-[#B85C38] transition-colors group-hover:bg-[#B85C38] group-hover:text-white">
                <ChartNoAxesColumn size={21} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                Progress Tracking
              </h3>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Know exactly how much you have read and where you stopped.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#B85C38]">
            How It Works
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Three simple steps
          </h2>
        </div>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">

          <div className="absolute top-6 left-[16.5%] right-[16.5%] hidden h-px bg-stone-300 sm:block" />

          <div className="relative text-center">
            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#B85C38] text-white ring-4 ring-[#F8F5EF]">
              <Upload size={20} />
            </div>

            <p className="mt-3 font-mono text-xs font-semibold tabular-nums text-[#B85C38]">
              STEP 01
            </p>
            <h3 className="mt-1 font-semibold">Upload</h3>
            <p className="mt-2 text-sm text-stone-500">
              Add your PDF to your library.
            </p>
          </div>

          <div className="relative text-center">
            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#B85C38] text-white ring-4 ring-[#F8F5EF]">
              <Mic size={20} />
            </div>

            <p className="mt-3 font-mono text-xs font-semibold tabular-nums text-[#B85C38]">
              STEP 02
            </p>
            <h3 className="mt-1 font-semibold">Read aloud</h3>
            <p className="mt-2 text-sm text-stone-500">
              Start listening — highlights follow every word you say.
            </p>
          </div>

          <div className="relative text-center">
            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#B85C38] text-white ring-4 ring-[#F8F5EF]">
              <ChartNoAxesColumn size={20} />
            </div>

            <p className="mt-3 font-mono text-xs font-semibold tabular-nums text-[#B85C38]">
              STEP 03
            </p>
            <h3 className="mt-1 font-semibold">Track</h3>
            <p className="mt-2 text-sm text-stone-500">
              Your reading progress is saved automatically.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16 sm:pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#3C302A] px-6 py-14 text-center text-white">

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to start reading?
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-300">
              Create your account and start keeping track of your PDF reading
              progress.
            </p>

            <Link
              to="/auth"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#B85C38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#9E4D30]"
            >
              Get Started
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;