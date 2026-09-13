import React, { useEffect, useRef, useState } from "react";
import { Upload, FileText, MoreVertical, Trash2, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { getCurrentUser } from "../api/auth.api";
import {
    uploadPdf,
    getMyPdfs,
    deletePdf
} from "../api/upload.api.js";

import { getAllProgress } from "../api/progress.api.js";

const MyLibrary = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Which card's kebab menu is currently open (UI-only state)
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    // ================================
    // CURRENT USER
    // ================================

    const {
        data,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });


    // ================================
    // GET USER PDFs
    // ================================

    const {
        data: pdfData,
        isLoading: pdfsLoading,
    } = useQuery({
        queryKey: ["myPdfs"],
        queryFn: getMyPdfs,
        retry: false,
    });


    // ================================
    // GET ALL PROGRESS
    // ================================

    const {
        data: progressData,
        isLoading: progressLoading,
    } = useQuery({
        queryKey: ["allProgress"],
        queryFn: getAllProgress,
        enabled: !!data?.user,
    });


    // ================================
    // UPLOAD PDF
    // ================================

    const uploadMutation = useMutation({
        mutationFn: uploadPdf,

        onSuccess: (data) => {

            console.log("PDF uploaded:", data);

            queryClient.invalidateQueries({
                queryKey: ["myPdfs"],
            });

        },

        onError: (error) => {

            console.log(
                error.response?.data?.message ||
                "PDF upload failed"
            );

        },
    });


    // ================================
    // DELETE PDF
    // ================================

    const deleteMutation = useMutation({
        mutationFn: deletePdf,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["myPdfs"],
            });

            queryClient.invalidateQueries({
                queryKey: ["allProgress"],
            });

        },

        onError: (error) => {

            console.error(
                "PDF delete failed",
                error
            );

        },
    });


    // ================================
    // AUTH CHECK
    // ================================

    useEffect(() => {

        if (!isLoading && isError) {

            navigate({
                to: "/auth"
            });

        }

    }, [isLoading, isError, navigate]);


    // ================================
    // CLOSE KEBAB MENU ON OUTSIDE CLICK
    // ================================

    useEffect(() => {

        if (!openMenuId) return;

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [openMenuId]);


    // ================================
    // FUNCTIONS
    // ================================

    const handleUpload = () => {

        fileInputRef.current?.click();

    };


    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {

            console.error(
                "Please select a PDF file"
            );

            return;

        }

        uploadMutation.mutate(file);

        e.target.value = "";

    };


    // ================================
    // LOADING / ERROR
    // ================================

    if (isLoading) {

        return (
            <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
                <div className="flex items-center gap-3 text-stone-500">
                    <div className="w-4 h-4 rounded-full border-2 border-stone-300 border-t-[#BD5D35] animate-spin" />
                    <span className="text-sm">Loading...</span>
                </div>
            </div>
        );

    }

    if (isError) {

        return null;

    }


    // ================================
    // UI
    // ================================

    return (

        <div className="min-h-screen bg-[#F7F3EC] px-6 sm:px-8 py-10">

            <div className="max-w-7xl mx-auto">


                {/* ================================
                    HEADER
                ================================= */}

                <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">

                    <div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                            My Library
                        </h1>

                        <p className="mt-1.5 text-stone-500 text-sm sm:text-base">
                            Manage and track your PDF documents.
                        </p>

                    </div>


                    {/* Upload */}

                    <button
                        onClick={handleUpload}
                        disabled={uploadMutation.isPending}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#BD5D35] text-white text-sm font-medium hover:bg-[#a94f2d] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >

                        <Upload size={17} />

                        {uploadMutation.isPending ? "Uploading..." : "Upload PDF"}

                    </button>


                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                </div>


                {/* ================================
                    PDF SECTION
                ================================= */}

                <div className="mt-8">


                    {/* Empty Library */}

                    {pdfData?.pdfs?.length === 0 ? (

                        <div className="bg-white border border-stone-200 rounded-2xl min-h-100 flex items-center justify-center">

                            <div className="text-center px-6">

                                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#F4E3D3] text-[#BD5D35] flex items-center justify-center">

                                    <FileText size={30} />

                                </div>


                                <h2 className="mt-5 text-xl font-semibold text-stone-900">

                                    Your library is empty

                                </h2>


                                <p className="mt-2 text-sm text-stone-500">

                                    Upload your first PDF to start tracking your progress.

                                </p>


                                <button
                                    onClick={handleUpload}
                                    className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#BD5D35] text-white text-sm font-medium hover:bg-[#a94f2d] transition"
                                >

                                    <Upload size={17} />

                                    Upload PDF

                                </button>

                            </div>

                        </div>

                    ) : (

                        /* PDFs exist */

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            {pdfData?.pdfs?.map((pdf) => {

                                const pdfProgress = progressData?.progress?.find(
                                    (progress) =>
                                        String(progress.pdfId) === String(pdf._id)
                                );
                                const currentPage = pdfProgress?.pageNumber || 1;

                                const progressPercentage = pdfProgress
                                    ? Math.round((currentPage / pdf.totalPages) * 100)
                                    : 0;

                                const isComplete = progressPercentage === 100;
                                const isMenuOpen = openMenuId === pdf._id;

                                return (
                                    <div
                                        key={pdf._id}
                                        onClick={() =>
                                            navigate({
                                                to: "/reader/$pdfId",
                                                params: {
                                                    pdfId: pdf._id,
                                                },
                                            })
                                        }
                                        className="group relative bg-white border border-stone-200 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:border-stone-300 transition"
                                    >

                                        {/* Kebab menu */}
                                        <div
                                            className="absolute top-4 right-4"
                                            ref={isMenuOpen ? menuRef : null}
                                        >

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(isMenuOpen ? null : pdf._id);
                                                }}
                                                aria-label="More options"
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                                                    isMenuOpen
                                                        ? "bg-stone-100 text-stone-700"
                                                        : "text-stone-300 hover:bg-stone-100 hover:text-stone-600"
                                                }`}
                                            >
                                                <MoreVertical size={16} />
                                            </button>

                                            {isMenuOpen && (
                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="absolute top-full right-0 mt-1 w-40 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-20"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            deleteMutation.mutate(pdf._id);
                                                        }}
                                                        disabled={deleteMutation.isPending}
                                                        className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={14} />
                                                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            )}

                                        </div>

                                        <div className="flex items-start justify-between pr-8">

                                            <div className="w-12 h-12 rounded-xl bg-[#F4E3D3] text-[#BD5D35] flex items-center justify-center shrink-0">
                                                <FileText size={22} />
                                            </div>

                                            {isComplete && (
                                                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                                    <CheckCircle2 size={12} />
                                                    Done
                                                </span>
                                            )}

                                        </div>

                                        <h2 className="mt-4 font-semibold text-stone-900 truncate pr-4">
                                            {pdf.title}
                                        </h2>

                                        <p className="mt-1.5 text-xs text-stone-400 font-mono tabular-nums">
                                            {pdf.totalPages} pages · {(pdf.fileSize / 1024).toFixed(1)} KB
                                        </p>

                                        {/* Progress */}

                                        <div className="mt-5">

                                            <div className="flex justify-between items-baseline text-xs mb-1.5">
                                                <span className="text-stone-400 uppercase tracking-wide text-[10px] font-medium">
                                                    Progress
                                                </span>

                                                <span className="font-mono tabular-nums font-semibold text-[#BD5D35]">
                                                    {progressPercentage}%
                                                </span>
                                            </div>

                                            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">

                                                <div
                                                    className="h-full rounded-full bg-[#BD5D35] transition-all duration-500 ease-out"
                                                    style={{
                                                        width: `${progressPercentage}%`
                                                    }}
                                                />

                                            </div>

                                            <p className="mt-2 text-xs text-stone-400 font-mono tabular-nums">
                                                Page {currentPage} of {pdf.totalPages}
                                            </p>

                                        </div>

                                        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">

                                            <p className="text-sm font-medium text-[#BD5D35] group-hover:translate-x-0.5 transition-transform">
                                                {pdfProgress
                                                    ? "Continue Reading →"
                                                    : "Start Reading →"}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                    )}

                </div>

            </div>

        </div>

    );
};

export default MyLibrary;