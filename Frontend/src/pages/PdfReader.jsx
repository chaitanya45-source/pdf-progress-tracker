import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Mic, MicOff, Keyboard, FileText, Sparkles, X, Minus, Plus } from "lucide-react";

import { getCurrentUser } from "../api/auth.api";
import { getMyPdfs } from "../api/upload.api.js";

import { Document, Page, pdfjs } from "react-pdf";
import { getProgress, saveProgress } from "../api/progress.api.js";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const PdfReader = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [currentPage, setCurrentPage] = useState(1);

    const [isListening, setIsListening] = useState(false);
    const [spokenText, setSpokenText] = useState("");

    const [pdfWords, setPdfWords] = useState([]);
    const [matchedWords, setMatchedWords] = useState([]);
    const [matchedIndex, setMatchedIndex] = useState(0);

    const [lastMatchContext, setLastMatchContext] = useState(null);

    const hasRestoredHighlightRef = useRef(false);

    const [inputMode, setInputMode] = useState("voice");

    const [typedText, setTypedText] = useState("");

    const recognitionRef = useRef(null);

    const pdfContainerRef = useRef(null);
    const [pdfWidth, setPdfWidth] = useState(650);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        const node = pdfContainerRef.current;
        if (!node) return;

        const updateWidth = () => {
            const available = node.clientWidth;
            if (available > 0) {
                setPdfWidth(Math.min(available, 650));
            }
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (inputMode !== "type") return;

        const timer = setTimeout(() => {
            setSpokenText(typedText);
        }, 500);

        return () => clearTimeout(timer);
    }, [typedText, inputMode]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            let transcript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            setSpokenText(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const clearHighlights = () => {
        setMatchedWords([]);
        setMatchedIndex(0);
        setSpokenText("");
        setTypedText("");
    };

    const handleModeChange = (mode) => {
        if (mode === "type" && isListening) {
            recognitionRef.current?.stop();
        }
        setTypedText("");
        setSpokenText("");
        setInputMode(mode);
    };

    const normalizeWord = (word) => {
        return word
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .trim();
    };

    const levenshtein = (a, b) => {
        const dp = Array.from({ length: a.length + 1 }, (_, i) =>
            Array(b.length + 1).fill(0)
        );

        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                dp[i][j] = a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : 1 + Math.min(
                        dp[i - 1][j - 1],
                        dp[i - 1][j],
                        dp[i][j - 1]
                    );
            }
        }

        return dp[a.length][b.length];
    };

    const isFuzzyMatch = (wordA, wordB) => {
        if (wordA === wordB) return true;

        const maxLen = Math.max(wordA.length, wordB.length);
        if (maxLen <= 3) return false;

        const tolerance = maxLen <= 6 ? 1 : 2;

        return levenshtein(wordA, wordB) <= tolerance;
    };

    useEffect(() => {
        if (!spokenText || pdfWords.length === 0) return;

        const spokenWords = normalizeWord(spokenText)
            .split(/\s+/)
            .filter(Boolean);

        console.log("Spoken words:", spokenWords);

        const pdfText = pdfWords.map((span) =>
            normalizeWord(span.textContent)
        );

        console.log("PDF words:", pdfText);

        const matches = [];

        let searchFrom = matchedIndex;

        for (const spokenWord of spokenWords) {
            for (let i = searchFrom; i < pdfText.length; i++) {
                const wordsInsideSpan = pdfText[i]
                    .split(/\s+/)
                    .filter(Boolean);

                const wordIndex = wordsInsideSpan.findIndex((pdfWord) =>
                    isFuzzyMatch(pdfWord, spokenWord)
                );

                if (wordIndex !== -1) {
                    matches.push({
                        spanIndex: i,
                        wordIndex: wordIndex,
                        word: wordsInsideSpan[wordIndex],
                    });

                    searchFrom = i;

                    break;
                }
            }
        }

        console.log("Matched words:", matches);

        if (matches.length > 0) {
            setMatchedWords(matches);

            const lastMatchEntry = matches[matches.length - 1];

            setMatchedIndex(lastMatchEntry.spanIndex);

            const spanEl = pdfWords[lastMatchEntry.spanIndex];

            if (spanEl) {
                const rect = spanEl.getBoundingClientRect();

                setLastMatchContext({
                    selectedText: lastMatchEntry.word,
                    surroundingText: spanEl.textContent,
                    position: {
                        x: Math.round(rect.left),
                        y: Math.round(rect.top),
                    },
                });
            }
        }
    }, [spokenText, pdfWords, matchedIndex]);

    useEffect(() => {
        console.log("Effect 2 running");
        console.log("Matched words:", matchedWords);

        const textLayer = document.querySelector(
            ".react-pdf__Page__textContent"
        );

        if (!textLayer) {
            console.log("No text layer found");
            return;
        }

        textLayer.querySelectorAll("mark.spoken-highlight").forEach((mark) => {
            mark.replaceWith(document.createTextNode(mark.textContent));
        });

        if (matchedWords.length === 0) {
            console.log("No matched words");
            return;
        }

        const liveSpans = textLayer.querySelectorAll("span[role='presentation']");

        console.log("Live PDF spans:", liveSpans.length);

        const matchesBySpan = new Map();

        matchedWords.forEach(({ spanIndex, word }) => {
            if (!matchesBySpan.has(spanIndex)) {
                matchesBySpan.set(spanIndex, new Set());
            }
            matchesBySpan.get(spanIndex).add(word);
        });

        matchesBySpan.forEach((words, spanIndex) => {
            const span = liveSpans[spanIndex];

            if (!span) {
                console.log("No live span at index", spanIndex);
                return;
            }

            const original = span.textContent;

            console.log("MATCH:", {
                words: Array.from(words),
                spanIndex,
                actualSpan: original
            });

            const sortedWords = Array.from(words).sort(
                (a, b) => b.length - a.length
            );

            const combinedPattern = sortedWords
                .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
                .join("|");

            const regex = new RegExp(`\\b(${combinedPattern})\\b`, "gi");

            if (regex.test(original)) {
                span.innerHTML = original.replace(
                    regex,
                    `<mark class="spoken-highlight">$1</mark>`
                );
                console.log("Highlighted:", sortedWords.join(", "), "in span", spanIndex);
            } else {
                console.log("Words not found in live span text:", sortedWords, original);
            }
        });
    }, [matchedWords]);

    const { pdfId } = useParams({
        from: "/reader/$pdfId",
    });

    useEffect(() => {
        hasRestoredHighlightRef.current = false;
        setZoomLevel(1);
    }, [pdfId]);

    useEffect(() => {
        setMatchedIndex(0);
        setMatchedWords([]);
        setPdfWords([]);

        recognitionRef.current?.stop();
    }, [pdfId, currentPage]);

    useEffect(() => {
        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    const {
        data: userData,
        isLoading: userLoading,
        isError: userError,
    } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });

    const {
        data: pdfData,
        isLoading: pdfLoading,
        isError: pdfError,
    } = useQuery({
        queryKey: ["myPdfs"],
        queryFn: getMyPdfs,
        enabled: !!userData?.user,
    });

    const {
        data: progressData,
        isLoading: progressLoading,
    } = useQuery({
        queryKey: ["progress", pdfId],
        queryFn: () => getProgress(pdfId),
        enabled: !!userData?.user && !!pdfId,
    });

    useEffect(() => {
        if (progressLoading) return;

        if (progressData?.progress?.pageNumber) {
            setCurrentPage(progressData.progress.pageNumber);
        }
    }, [progressData, progressLoading]);

    useEffect(() => {
        if (hasRestoredHighlightRef.current) return;
        if (!progressData?.progress?.selectedText) return;
        if (pdfWords.length === 0) return;
        if (currentPage !== progressData.progress.pageNumber) return;

        const savedWord = normalizeWord(progressData.progress.selectedText);

        const foundSpanIndex = pdfWords.findIndex((span) => {
            const spanWords = normalizeWord(span.textContent).split(/\s+/);
            return spanWords.includes(savedWord);
        });

        if (foundSpanIndex !== -1) {
            setMatchedWords([
                { spanIndex: foundSpanIndex, wordIndex: 0, word: savedWord },
            ]);
            setMatchedIndex(foundSpanIndex);
        } else {
            console.log(
                "Saved word not found on this page's re-render:",
                savedWord
            );
        }

        hasRestoredHighlightRef.current = true;
    }, [pdfWords, progressData, currentPage]);

    useEffect(() => {
        if (progressLoading || !pdfId || !currentPage) {
            return;
        }

        const timer = setTimeout(() => {
            saveProgress({
                pdfId,
                pageNumber: currentPage,
                ...(lastMatchContext && {
                    selectedText: lastMatchContext.selectedText,
                    surroundingText: lastMatchContext.surroundingText,
                    position: lastMatchContext.position,
                }),
            })
                .then(() => {
                    queryClient.invalidateQueries({
                        queryKey: ["allProgress"],
                    });
                })
                .catch((error) => {
                    console.error("Failed to save progress:", error);
                });
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [currentPage, lastMatchContext, pdfId, progressLoading, queryClient]);

    useEffect(() => {
        if (userError) {
            navigate({ to: "/auth" });
        }
    }, [userError, navigate]);

    const pdf = pdfData?.pdfs?.find((p) => p._id === pdfId);

    const fileUrl = useMemo(
        () => pdf?.fileUrl || null,
        [pdf?.fileUrl]
    );

    const handleTextLayerSuccess = useCallback(() => {
        setTimeout(() => {
            const textLayer = document.querySelector(
                ".react-pdf__Page__textContent"
            );

            if (!textLayer) return;

            const spans = Array.from(
                textLayer.querySelectorAll("span[role='presentation']")
            );

            setPdfWords(spans);

            console.log("PDF spans:", spans);
        }, 100);
    }, []);

    if (userLoading) {
        return (
            <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
                <div className="flex items-center gap-3 text-stone-500">
                    <div className="w-4 h-4 rounded-full border-2 border-stone-300 border-t-[#BD5D35] animate-spin" />
                    <span className="text-sm">Checking authentication...</span>
                </div>
            </div>
        );
    }

    if (userError) {
        return null;
    }

    if (pdfLoading) {
        return (
            <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
                <div className="flex items-center gap-3 text-stone-500">
                    <div className="w-4 h-4 rounded-full border-2 border-stone-300 border-t-[#BD5D35] animate-spin" />
                    <span className="text-sm">Loading your document...</span>
                </div>
            </div>
        );
    }

    if (progressLoading) {
        return (
            <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
                <div className="flex items-center gap-3 text-stone-500">
                    <div className="w-4 h-4 rounded-full border-2 border-stone-300 border-t-[#BD5D35] animate-spin" />
                    <span className="text-sm">Loading progress...</span>
                </div>
            </div>
        );
    }

    if (pdfError) {
        return (
            <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-stone-700 font-medium">Couldn't load this document</p>
                    <p className="text-sm text-stone-500 mt-1">Try going back and opening it again.</p>
                </div>
            </div>
        );
    }

    if (!pdf) {
        return (
            <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-stone-700 font-medium">Document not found</p>
                    <p className="text-sm text-stone-500 mt-1">It may have been moved or deleted.</p>
                </div>
            </div>
        );
    }

    const progress = Math.round(
        (currentPage / pdf.totalPages) * 100
    );

    return (
        <div className="min-h-screen bg-[#F7F3EC]">

            <style>{`
                @keyframes wave-bar {
                    0%, 100% { transform: scaleY(0.3); }
                    50% { transform: scaleY(1); }
                }
                .wave-bar {
                    animation: wave-bar 0.9s ease-in-out infinite;
                    transform-origin: center;
                }
            `}</style>

            <div className="border-b border-stone-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                onClick={() => navigate({ to: "/library" })}
                                className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition"
                                aria-label="Back to library"
                            >
                                <ArrowLeft size={18} />
                            </button>

                            <div className="min-w-0">
                                <h1 className="text-base sm:text-lg font-semibold text-stone-900 truncate">
                                    {pdf.title}
                                </h1>
                                <p className="text-xs text-stone-500 mt-0.5 font-mono tabular-nums">
                                    Page {currentPage} of {pdf.totalPages}
                                </p>
                            </div>
                        </div>

                        <div className="w-40 sm:w-52 shrink-0">
                            <div className="flex justify-between items-baseline text-xs mb-1.5">
                                <span className="text-stone-400 uppercase tracking-wide text-[10px] font-medium">
                                    Progress
                                </span>
                                <span className="font-mono tabular-nums font-semibold text-[#BD5D35]">
                                    {progress}%
                                </span>
                            </div>
                            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-[#BD5D35] transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-3 sm:px-8 py-4 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

                    <div className="min-w-0">
                        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-stone-100 p-3 sm:p-8 flex justify-center overflow-auto">
                                <div ref={pdfContainerRef} className="w-full flex justify-center">
                                    <Document
                                        file={fileUrl}
                                        loading={
                                            <div className="py-16 flex flex-col items-center gap-3 text-stone-400">
                                                <div className="w-5 h-5 rounded-full border-2 border-stone-300 border-t-[#BD5D35] animate-spin" />
                                                <span className="text-sm">Loading PDF...</span>
                                            </div>
                                        }
                                        error={
                                            <div className="py-16 flex flex-col items-center gap-2 text-red-400">
                                                <FileText size={28} />
                                                <span className="text-sm">Failed to load PDF.</span>
                                            </div>
                                        }
                                    >
                                        <div className="shadow-md">
                                            <Page
                                                pageNumber={currentPage}
                                                width={Math.round(pdfWidth * zoomLevel)}
                                                renderTextLayer={true}
                                                renderAnnotationLayer={false}
                                                onRenderTextLayerSuccess={handleTextLayerSuccess}
                                            />
                                        </div>
                                    </Document>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            <div className="inline-flex items-center gap-1 bg-white border border-stone-200 rounded-full px-1.5 py-1.5 shadow-sm">
                                <button
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(page - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-3.5 py-2 rounded-full text-stone-600 hover:bg-stone-100 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent text-sm font-medium"
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>

                                <div className="px-3 text-xs text-stone-400 font-mono tabular-nums select-none">
                                    {currentPage} / {pdf.totalPages}
                                </div>

                                <button
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(page + 1, pdf.totalPages)
                                        )
                                    }
                                    disabled={currentPage === pdf.totalPages}
                                    className="flex items-center gap-1 px-3.5 py-2 rounded-full text-stone-600 hover:bg-stone-100 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent text-sm font-medium"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="inline-flex items-center gap-1 bg-white border border-stone-200 rounded-full px-1.5 py-1.5 shadow-sm">
                                <button
                                    onClick={() =>
                                        setZoomLevel((z) => Math.max(z - 0.15, 0.5))
                                    }
                                    disabled={zoomLevel <= 0.5}
                                    aria-label="Zoom out"
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                >
                                    <Minus size={15} />
                                </button>

                                <div className="px-2 text-xs text-stone-400 font-mono tabular-nums select-none w-12 text-center">
                                    {Math.round(zoomLevel * 100)}%
                                </div>

                                <button
                                    onClick={() =>
                                        setZoomLevel((z) => Math.min(z + 0.15, 2))
                                    }
                                    disabled={zoomLevel >= 2}
                                    aria-label="Zoom in"
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                >
                                    <Plus size={15} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:sticky lg:top-24">
                        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={14} className="text-[#BD5D35]" />
                                <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                    Voice Tracking
                                </span>
                            </div>

                            <div className="flex items-center gap-1 mb-4 bg-stone-100 rounded-xl p-1">
                                <button
                                    onClick={() => handleModeChange("voice")}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                                        inputMode === "voice"
                                            ? "bg-white text-stone-900 shadow-sm"
                                            : "text-stone-500 hover:text-stone-700"
                                    }`}
                                >
                                    <Mic size={13} />
                                    Speak
                                </button>

                                <button
                                    onClick={() => handleModeChange("type")}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                                        inputMode === "type"
                                            ? "bg-white text-stone-900 shadow-sm"
                                            : "text-stone-500 hover:text-stone-700"
                                    }`}
                                >
                                    <Keyboard size={13} />
                                    Type
                                </button>
                            </div>

                            {inputMode === "voice" ? (
                                <button
                                    onClick={toggleListening}
                                    className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-white font-medium text-sm transition ${isListening
                                        ? "bg-[#BD5D35]"
                                        : "bg-stone-900 hover:bg-stone-800"
                                        }`}
                                >
                                    {isListening ? (
                                        <>
                                            <span className="flex items-end gap-[3px] h-3.5">
                                                <span className="wave-bar w-[3px] h-full bg-white/90 rounded-full" style={{ animationDelay: "0ms" }} />
                                                <span className="wave-bar w-[3px] h-full bg-white/90 rounded-full" style={{ animationDelay: "150ms" }} />
                                                <span className="wave-bar w-[3px] h-full bg-white/90 rounded-full" style={{ animationDelay: "300ms" }} />
                                                <span className="wave-bar w-[3px] h-full bg-white/90 rounded-full" style={{ animationDelay: "450ms" }} />
                                            </span>
                                            Listening... (tap to stop)
                                        </>
                                    ) : (
                                        <>
                                            <Mic size={16} />
                                            Start Listening
                                        </>
                                    )}
                                </button>
                            ) : (
                                <>
                                    <textarea
                                        value={typedText}
                                        onChange={(e) => setTypedText(e.target.value)}
                                        placeholder="Type a word or line from the page..."
                                        rows={3}
                                        className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#BD5D35]/30 focus:border-[#BD5D35]"
                                    />
                                    <p className="mt-2 text-[11px] text-stone-400">
                                        Matches after you pause typing for a moment.
                                    </p>
                                </>
                            )}

                            {inputMode === "voice" && (
                                <div className="mt-4 pt-4 border-t border-stone-100">
                                    <p className="text-[11px] uppercase tracking-wide text-stone-400 font-medium mb-1.5">
                                        Recognized speech
                                    </p>
                                    <p className={`text-sm leading-relaxed ${spokenText ? "text-stone-800" : "text-stone-400"}`}>
                                        {spokenText || "Start speaking..."}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
                            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                This Match
                            </span>

                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-sm text-stone-500">Words highlighted</span>
                                <span className="font-mono tabular-nums font-semibold text-stone-900">
                                    {matchedWords.length}
                                </span>
                            </div>

                            {matchedWords.length > 0 && (
                                <button
                                    onClick={clearHighlights}
                                    className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-stone-500 border border-stone-200 hover:bg-stone-50 hover:text-stone-700 transition"
                                >
                                    <X size={12} />
                                    Clear Highlights
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </main>

        </div>
    );
};

export default PdfReader;