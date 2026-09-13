import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Layers, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { getCurrentUser } from "../api/auth.api.js";
import { getMyPdfs } from "../api/upload.api.js";
import { getAllProgress } from "../api/progress.api.js";

const Dashboard = () => {
  const navigate = useNavigate();

  // Which stat card is currently selected (UI-only state — drives the list below)
  const [selectedFilter, setSelectedFilter] = useState(null); // "all" | "inProgress" | "completed" | null

  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const {
    data: pdfData,
    isLoading: pdfLoading,
    isError: pdfError,
  } = useQuery({
    queryKey: ["myPdfs"],
    queryFn: getMyPdfs,
    enabled: !!data?.user,
  });

  const { data: progressData, isLoading: progressLoading, isError: progressError } = useQuery({
    queryKey: ["allProgress"],
    queryFn: getAllProgress,
    enabled: !!data?.user,
  });

  React.useEffect(() => {
    if (isError) {
      navigate({ to: "/auth" });
    }
  }, [isError, navigate]);

  if (isLoading || pdfLoading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500">
          <div className="w-4 h-4 rounded-full border-2 border-stone-300 border-t-[#BD5D35] animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const allPdfs = pdfData?.pdfs || [];

  // Attach progress info to each pdf once, reused for counts, lists, and cards
  const pdfsWithProgress = allPdfs.map((pdf) => {
    const progress = (progressData?.progress || []).find(
      (p) => p.pdfId === pdf._id
    );

    const currentPage = progress?.pageNumber || 0;
    const status = !progress
      ? "notStarted"
      : currentPage === pdf.totalPages
        ? "completed"
        : "inProgress";

    return { ...pdf, currentPage, status };
  });

  const totalPdfs = allPdfs.length;
  const inProgressList = pdfsWithProgress.filter((p) => p.status === "inProgress");
  const completedList = pdfsWithProgress.filter((p) => p.status === "completed");
  const inProgress = inProgressList.length;
  const completed = completedList.length;

  const listForFilter = {
    all: pdfsWithProgress,
    inProgress: inProgressList,
    completed: completedList,
  };

  const filterMeta = {
    all: { label: "All PDFs", empty: "You haven't uploaded any PDFs yet." },
    inProgress: { label: "In Progress", empty: "Nothing in progress right now." },
    completed: { label: "Completed", empty: "No completed PDFs yet." },
  };

  const visibleList = selectedFilter ? listForFilter[selectedFilter] : [];

  const statCards = [
    {
      key: "all",
      label: "Total PDFs",
      value: totalPdfs,
      icon: Layers,
    },
    {
      key: "inProgress",
      label: "In Progress",
      value: inProgress,
      icon: Clock,
    },
    {
      key: "completed",
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
    },
  ];

  const handleCardClick = (key) => {
    setSelectedFilter((current) => (current === key ? null : key));
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] px-6 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Welcome back <span className="inline-block">👋</span>
        </h1>

        <p className="mt-1.5 text-stone-500 text-sm sm:text-base">
          Continue your PDF reading journey.
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">

          {statCards.map(({ key, label, value, icon: Icon }) => {
            const isActive = selectedFilter === key;

            return (
              <button
                key={key}
                onClick={() => handleCardClick(key)}
                className={`text-left bg-white border rounded-2xl p-6 transition ${
                  isActive
                    ? "border-[#BD5D35] shadow-md ring-1 ring-[#BD5D35]/20"
                    : "border-stone-200 hover:border-stone-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide font-medium text-stone-400">
                    {label}
                  </p>

                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#BD5D35] text-white"
                        : "bg-[#F4E3D3] text-[#BD5D35]"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-stone-900 mt-3 font-mono tabular-nums">
                  {value}
                </h2>

                <p className={`mt-3 text-xs font-medium flex items-center gap-1 transition-colors ${
                  isActive ? "text-[#BD5D35]" : "text-stone-400"
                }`}>
                  {isActive ? "Showing below" : "View PDFs"}
                  <ArrowRight
                    size={12}
                    className={`transition-transform ${isActive ? "rotate-90" : ""}`}
                  />
                </p>
              </button>
            );
          })}

        </div>

        {/* Filtered PDF list */}
        {selectedFilter && (
          <div className="mt-8">

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                {filterMeta[selectedFilter].label}
              </h3>

              <button
                onClick={() => setSelectedFilter(null)}
                className="text-xs text-stone-400 hover:text-stone-600 transition"
              >
                Clear
              </button>
            </div>

            {visibleList.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center">
                <p className="text-sm text-stone-500">
                  {filterMeta[selectedFilter].empty}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {visibleList.map((pdf) => {
                  const percentage = Math.round(
                    (pdf.currentPage / pdf.totalPages) * 100
                  ) || 0;

                  return (
                    <div
                      key={pdf._id}
                      onClick={() =>
                        navigate({
                          to: "/reader/$pdfId",
                          params: { pdfId: pdf._id },
                        })
                      }
                      className="bg-white border border-stone-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-stone-300 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#F4E3D3] text-[#BD5D35] flex items-center justify-center">
                          <FileText size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-stone-900 truncate text-sm">
                            {pdf.title}
                          </h4>
                          <p className="text-xs text-stone-400 font-mono tabular-nums mt-0.5">
                            Page {pdf.currentPage} of {pdf.totalPages}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#BD5D35] transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-right text-xs font-mono tabular-nums text-[#BD5D35] font-semibold">
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;