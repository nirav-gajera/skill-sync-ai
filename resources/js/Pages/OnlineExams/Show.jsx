import Layout from "../Dashboard/Components/Layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

/* ─────────────────────────────────────────────
   Unchanged helpers
───────────────────────────────────────────── */
function formatClock(totalSeconds) {
    const safeSeconds = Math.max(totalSeconds, 0);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;
    if (hours > 0) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDuration(totalSeconds) {
    if (typeof totalSeconds !== "number") return "Pending";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

/* ─────────────────────────────────────────────
   Styles  (oes- prefix = online exam show)
───────────────────────────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.oes-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Loading overlay ── */
.oes-loading {
    position:fixed; inset:0; z-index:50;
    background:rgba(0,0,0,0.55); backdrop-filter:blur(3px);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
}
.oes-spinner {
    width:52px; height:52px; border-radius:50%;
    border:4px solid rgba(255,255,255,0.10);
    border-top-color:#38bdf8;
    animation:oes-spin 0.9s linear infinite;
}
@keyframes oes-spin { to { transform:rotate(360deg); } }
.oes-spinner-label { font-size:13px; color:#94a3b8; font-weight:500; }

/* ── Hero banner ── */
.oes-hero {
    border-radius:16px; overflow:hidden; margin-bottom:20px;
    background:linear-gradient(135deg,#0a1628 0%,#0f172a 45%,#0d2015 100%);
    border:1px solid rgba(255,255,255,0.08);
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
}
.oes-hero-inner {
    display:grid; gap:24px; padding:32px;
    grid-template-columns:1.1fr 0.9fr;
}
@media(max-width:900px){ .oes-hero-inner { grid-template-columns:1fr; } }

/* hero left */
.oes-hero-badge {
    display:inline-flex; align-items:center; gap:7px;
    padding:4px 12px; border-radius:20px;
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.14);
    color:#e2e8f0; font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:0.3em; margin-bottom:14px;
}
.oes-dot-live      { width:8px; height:8px; border-radius:50%; background:#f87171; animation:oes-pulse 1.2s infinite; flex-shrink:0; }
.oes-dot-completed { width:8px; height:8px; border-radius:50%; background:#34d399; flex-shrink:0; }
@keyframes oes-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.5; transform:scale(0.85); }
}
.oes-hero-title   { font-size:26px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; line-height:1.3; margin-bottom:10px; }
.oes-hero-subtitle { font-size:13px; color:#7b94b7; line-height:1.7; }

/* hero right stats box */
.oes-stats-box {
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    border-radius:14px; padding:22px; backdrop-filter:blur(8px);
    display:flex; flex-direction:column; gap:18px;
}
.oes-stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.oes-stat-val  { font-size:28px; font-weight:800; color:#f1f5f9; line-height:1; }
.oes-stat-label { font-size:12px; color:#7b94b7; margin-top:4px; }
.oes-progress-header {
    display:flex; justify-content:space-between;
    font-size:10px; font-weight:700; color:#7b94b7;
    text-transform:uppercase; letter-spacing:0.2em; margin-bottom:8px;
}
.oes-progress-track { height:10px; border-radius:99px; background:rgba(255,255,255,0.08); overflow:hidden; }
.oes-progress-fill  { height:100%; border-radius:99px; background:linear-gradient(90deg,#0ea5e9,#34d399); transition:width 0.4s; }

/* ── Shared card ── */
.oes-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:28px;
}

/* ── Two-col grid ── */
.oes-two-col { display:grid; gap:20px; grid-template-columns:0.9fr 1.1fr; }
.oes-two-col-rev { display:grid; gap:20px; grid-template-columns:0.8fr 1.2fr; }
@media(max-width:900px){ .oes-two-col,.oes-two-col-rev { grid-template-columns:1fr; } }

/* ── Result Summary ── */
.oes-result-heading  { font-size:18px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.oes-result-subheading { font-size:12px; color:#6e7e95; margin-bottom:20px; }

.oes-stat-cards { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; }
.oes-stat-card {
    background:#0f172a; border:1px solid rgba(255,255,255,0.06);
    border-radius:12px; padding:16px;
}
.oes-stat-card-label { font-size:11px; color:#6e7e95; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:8px; }
.oes-stat-card-val   { font-size:26px; font-weight:800; color:#f1f5f9; line-height:1; }
.oes-stat-card-val-sm { font-size:14px; font-weight:700; color:#f1f5f9; line-height:1.4; }

.oes-summary-box {
    background:rgba(52,211,153,0.07); border:1px solid rgba(52,211,153,0.18);
    border-radius:12px; padding:14px 16px;
    font-size:13px; color:#6ee7b7; line-height:1.7; margin-bottom:20px;
}

.oes-back-btn {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#94a3b8; font-size:13px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.oes-back-btn:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }

/* ── Q&A review articles ── */
.oes-qa-list { display:flex; flex-direction:column; gap:14px; }
.oes-qa-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; padding:22px;
}
.oes-qa-card-header { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; margin-bottom:14px; }
.oes-qa-number { font-size:10px; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:0.3em; }
.oes-qa-badge {
    display:inline-flex; padding:3px 10px; border-radius:20px;
    font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;
}
.oes-qa-correct   { background:rgba(52,211,153,0.10); color:#34d399; border:1px solid rgba(52,211,153,0.20); }
.oes-qa-incorrect { background:rgba(248,113,113,0.10); color:#f87171; border:1px solid rgba(248,113,113,0.20); }
.oes-qa-question  { font-size:15px; font-weight:700; color:#f1f5f9; margin-bottom:14px; line-height:1.5; }
.oes-qa-answers   { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
@media(max-width:600px){ .oes-qa-answers { grid-template-columns:1fr; } }
.oes-qa-answer-box {
    background:#0f172a; border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:12px 14px;
}
.oes-qa-answer-label { font-size:10px; font-weight:700; color:#6e7e95; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:6px; }
.oes-qa-answer-val   { font-size:13px; font-weight:600; color:#e2e8f0; }
.oes-qa-explanation  {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:12px 14px;
    font-size:13px; color:#94a3b8; line-height:1.7;
}

/* ── In-progress: Navigator aside ── */
.oes-nav-heading    { font-size:16px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.oes-nav-subheading { font-size:12px; color:#6e7e95; margin-bottom:18px; }
.oes-nav-grid       { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; margin-bottom:18px; }
.oes-nav-btn {
    border-radius:10px; padding:12px 6px; font-size:13px; font-weight:700;
    border:1px solid transparent; cursor:pointer; transition:all 0.16s; text-align:center;
}
.oes-nav-btn-default  { background:#0f172a; border-color:rgba(255,255,255,0.07); color:#7b94b7; }
.oes-nav-btn-default:hover { border-color:rgba(56,189,248,0.25); color:#94a3b8; }
.oes-nav-btn-answered { background:rgba(52,211,153,0.10); border-color:rgba(52,211,153,0.25); color:#34d399; }
.oes-nav-btn-active   { background:rgba(56,189,248,0.15); border-color:rgba(56,189,248,0.40); color:#38bdf8; }

.oes-info-box {
    background:#0f172a; border:1px solid rgba(255,255,255,0.06);
    border-radius:12px; padding:14px 16px; margin-bottom:12px;
}
.oes-info-label { font-size:11px; color:#6e7e95; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:6px; }
.oes-info-val   { font-size:18px; font-weight:700; color:#f1f5f9; }

.oes-submit-btn {
    width:100%; padding:12px; border-radius:10px;
    background:linear-gradient(135deg,#059669,#047857); border:none;
    color:#fff; font-size:14px; font-weight:700; cursor:pointer;
    transition:all 0.18s; box-shadow:0 4px 14px rgba(5,150,105,0.25);
    font-family:'Inter',sans-serif;
}
.oes-submit-btn:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
.oes-submit-btn:disabled { opacity:0.55; cursor:not-allowed; transform:none; }

/* ── In-progress: Question panel ── */
.oes-q-header { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; margin-bottom:18px; }
.oes-q-number { font-size:10px; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:0.3em; }
.oes-q-type   {
    padding:3px 10px; border-radius:20px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
    font-size:11px; font-weight:700; color:#7b94b7; text-transform:uppercase; letter-spacing:0.05em;
}
.oes-q-text   { font-size:18px; font-weight:800; color:#f1f5f9; line-height:1.5; margin-bottom:22px; }
.oes-choices  { display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
.oes-choice {
    border-radius:10px; border:1px solid rgba(255,255,255,0.08);
    padding:14px 18px; text-align:left; font-size:13px; font-weight:500;
    background:#0f172a; color:#94a3b8; cursor:pointer; transition:all 0.16s;
    font-family:'Inter',sans-serif;
}
.oes-choice:hover:not(.oes-choice-selected) {
    border-color:rgba(56,189,248,0.25); color:#e2e8f0; background:rgba(56,189,248,0.04);
}
.oes-choice-selected {
    border-color:rgba(56,189,248,0.45) !important;
    background:rgba(56,189,248,0.10) !important; color:#38bdf8 !important;
}
.oes-q-nav { display:flex; justify-content:space-between; gap:12px; padding-top:4px; }
.oes-q-nav-prev {
    padding:9px 20px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#64748b; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.18s;
    font-family:'Inter',sans-serif;
}
.oes-q-nav-prev:hover:not(:disabled) { background:rgba(255,255,255,0.08); color:#94a3b8; }
.oes-q-nav-prev:disabled { opacity:0.35; cursor:not-allowed; }
.oes-q-nav-next {
    padding:9px 20px; border-radius:10px;
    background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.25);
    color:#38bdf8; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.18s;
    font-family:'Inter',sans-serif;
}
.oes-q-nav-next:hover:not(:disabled) { background:rgba(56,189,248,0.20); }
.oes-q-nav-next:disabled { opacity:0.35; cursor:not-allowed; }

/* ── No questions fallback ── */
.oes-no-questions {
    background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.20);
    border-radius:12px; padding:16px 18px;
    font-size:13px; color:#fbbf24; line-height:1.7;
}
`;

const TOAST_OPTS = {
    style: {
        background: "#1e293b",
        color: "#e2e8f0",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        fontSize: "13px",
    },
    success: { iconTheme: { primary: "#22c55e", secondary: "#1e293b" } },
    error: { iconTheme: { primary: "#f87171", secondary: "#1e293b" } },
};

export default function OnlineExamShow() {
    const { props } = usePage();
    const { onlineExam, flash } = props;

    const questions = onlineExam.questions || [];
    const isCompleted = onlineExam.status === "completed";
    const initialAnswers = onlineExam.submitted_answers || {};
    const evaluationResult = onlineExam.evaluation_result || {};

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(initialAnswers);
    const [remainingSeconds, setRemainingSeconds] = useState(() => {
        if (!onlineExam.expires_at) return onlineExam.time_limit_minutes * 60;
        return Math.max(
            0,
            Math.floor(
                (new Date(onlineExam.expires_at).getTime() - Date.now()) / 1000,
            ),
        );
    });
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ── flash toasts ── */
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    /* ── timer countdown ── */
    useEffect(() => {
        if (isCompleted || !onlineExam.expires_at) return undefined;
        const interval = window.setInterval(() => {
            const seconds = Math.max(
                0,
                Math.floor(
                    (new Date(onlineExam.expires_at).getTime() - Date.now()) /
                        1000,
                ),
            );
            setRemainingSeconds(seconds);
        }, 1000);
        return () => window.clearInterval(interval);
    }, [isCompleted, onlineExam.expires_at]);

    /* ── auto-submit when time runs out ── */
    useEffect(() => {
        if (isCompleted || remainingSeconds > 0 || isSubmitting) return;
        toast.error("Time is up! Your exam is being submitted automatically.", {
            duration: 3000,
        });
        handleSubmit();
    }, [isCompleted, remainingSeconds, isSubmitting]);

    /* ── progress ── */
    const answeredCount = useMemo(
        () =>
            Object.values(selectedAnswers).filter(
                (v) => typeof v === "string" && v.trim() !== "",
            ).length,
        [selectedAnswers],
    );
    const progressPercentage =
        questions.length > 0
            ? Math.round((answeredCount / questions.length) * 100)
            : 0;
    const currentQuestion = questions[currentQuestionIndex] || null;

    /* ── handlers ── */
    const handleOptionSelect = (questionIndex, choice) => {
        if (isCompleted) return;
        setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: choice }));
    };

    const handleSubmit = () => {
        if (isSubmitting || isCompleted) return;
        setIsSubmitting(true);
        setLoading(true);
        const answers = questions.map((q) => ({
            question_index: q.question_index,
            selected_option: selectedAnswers[q.question_index] || null,
        }));
        router.put(
            `/online-exams/${onlineExam.id}`,
            { answers },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setLoading(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                    setLoading(false);
                },
            },
        );
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title={isCompleted ? "Exam Result" : "Exam In Progress"} />

            {/* ── Loading overlay ── */}
            {loading && (
                <div className="oes-loading">
                    <div className="oes-spinner" />
                    <span className="oes-spinner-label">Submitting exam…</span>
                </div>
            )}

            <div className="oes-root">
                {/* ── Hero banner ── */}
                <div className="oes-hero">
                    <div className="oes-hero-inner">
                        {/* left */}
                        <div>
                            <div className="oes-hero-badge">
                                <span
                                    className={
                                        isCompleted
                                            ? "oes-dot-completed"
                                            : "oes-dot-live"
                                    }
                                />
                                {isCompleted ? "Result View" : "Live Exam"}
                            </div>
                            <div className="oes-hero-title">
                                {onlineExam.job.title}
                            </div>
                            <div className="oes-hero-subtitle">
                                Resume: {onlineExam.resume.name}
                                {onlineExam.focus
                                    ? ` · Focus: ${onlineExam.focus}`
                                    : ""}
                            </div>
                        </div>

                        {/* right stats box */}
                        <div className="oes-stats-box">
                            <div className="oes-stats-grid">
                                <div>
                                    <div className="oes-stat-val">
                                        {questions.length}
                                    </div>
                                    <div className="oes-stat-label">
                                        questions
                                    </div>
                                </div>
                                <div>
                                    <div className="oes-stat-val">
                                        {answeredCount}
                                    </div>
                                    <div className="oes-stat-label">
                                        answered
                                    </div>
                                </div>
                                <div>
                                    <div className="oes-stat-val">
                                        {isCompleted
                                            ? `${evaluationResult.percentage ?? 0}%`
                                            : formatClock(remainingSeconds)}
                                    </div>
                                    <div className="oes-stat-label">
                                        {isCompleted ? "score" : "time left"}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="oes-progress-header">
                                    <span>Progress</span>
                                    <span>{progressPercentage}%</span>
                                </div>
                                <div className="oes-progress-track">
                                    <div
                                        className="oes-progress-fill"
                                        style={{
                                            width: `${progressPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════
                    COMPLETED VIEW
                ══════════════════════════════════ */}
                {isCompleted ? (
                    <div className="oes-two-col">
                        {/* Result Summary aside */}
                        <div className="oes-card">
                            <div className="oes-result-heading">
                                Result Summary
                            </div>
                            <div className="oes-result-subheading">
                                View-only evaluation generated after submission.
                            </div>

                            <div className="oes-stat-cards">
                                <div className="oes-stat-card">
                                    <div className="oes-stat-card-label">
                                        Score
                                    </div>
                                    <div className="oes-stat-card-val">
                                        {evaluationResult.percentage ?? 0}%
                                    </div>
                                </div>
                                <div className="oes-stat-card">
                                    <div className="oes-stat-card-label">
                                        Time Taken
                                    </div>
                                    <div
                                        className="oes-stat-card-val"
                                        style={{ fontSize: 20 }}
                                    >
                                        {formatDuration(
                                            onlineExam.time_taken_seconds,
                                        )}
                                    </div>
                                </div>
                                <div className="oes-stat-card">
                                    <div className="oes-stat-card-label">
                                        Correct Answers
                                    </div>
                                    <div className="oes-stat-card-val">
                                        {evaluationResult.correct_answers ?? 0}
                                        <span
                                            style={{
                                                fontSize: 14,
                                                color: "#6e7e95",
                                                fontWeight: 600,
                                            }}
                                        >
                                            /
                                            {evaluationResult.total_questions ??
                                                questions.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="oes-stat-card">
                                    <div className="oes-stat-card-label">
                                        Submitted
                                    </div>
                                    <div className="oes-stat-card-val-sm">
                                        {onlineExam.submitted_at
                                            ? new Date(
                                                  onlineExam.submitted_at,
                                              ).toLocaleString()
                                            : "Pending"}
                                    </div>
                                </div>
                            </div>

                            <div className="oes-summary-box">
                                {evaluationResult.summary ||
                                    onlineExam.summary ||
                                    "The exam has been submitted and evaluated."}
                            </div>

                            <Link href="/online-exams" className="oes-back-btn">
                                <ArrowLeftIcon
                                    style={{ width: 14, height: 14 }}
                                />
                                Back to Exam History
                            </Link>
                        </div>

                        {/* Q&A review */}
                        <div className="oes-qa-list">
                            {(evaluationResult.results || []).map(
                                (result, index) => (
                                    <div
                                        key={result.question_index ?? index}
                                        className="oes-qa-card"
                                    >
                                        <div className="oes-qa-card-header">
                                            <span className="oes-qa-number">
                                                Question {index + 1}
                                            </span>
                                            <span
                                                className={`oes-qa-badge ${result.is_correct ? "oes-qa-correct" : "oes-qa-incorrect"}`}
                                            >
                                                {result.is_correct
                                                    ? "Correct"
                                                    : "Incorrect"}
                                            </span>
                                        </div>
                                        <div className="oes-qa-question">
                                            {result.question}
                                        </div>
                                        <div className="oes-qa-answers">
                                            <div className="oes-qa-answer-box">
                                                <div className="oes-qa-answer-label">
                                                    Your Answer
                                                </div>
                                                <div className="oes-qa-answer-val">
                                                    {result.selected_option ||
                                                        "Not answered"}
                                                </div>
                                            </div>
                                            <div className="oes-qa-answer-box">
                                                <div className="oes-qa-answer-label">
                                                    Correct Answer
                                                </div>
                                                <div className="oes-qa-answer-val">
                                                    {result.correct_option ||
                                                        "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="oes-qa-explanation">
                                            {result.explanation}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                ) : (
                    /* ══════════════════════════════════
                    IN-PROGRESS VIEW
                ══════════════════════════════════ */
                    <div className="oes-two-col-rev">
                        {/* Navigator aside */}
                        <div className="oes-card">
                            <div className="oes-nav-heading">
                                Question Navigator
                            </div>
                            <div className="oes-nav-subheading">
                                Jump between questions and submit once you are
                                done.
                            </div>

                            <div className="oes-nav-grid">
                                {questions.map((question, index) => {
                                    const isAnswered = Boolean(
                                        selectedAnswers[
                                            question.question_index
                                        ],
                                    );
                                    const isActive =
                                        index === currentQuestionIndex;
                                    let cls = "oes-nav-btn ";
                                    if (isActive) cls += "oes-nav-btn-active";
                                    else if (isAnswered)
                                        cls += "oes-nav-btn-answered";
                                    else cls += "oes-nav-btn-default";
                                    return (
                                        <button
                                            key={question.question_index}
                                            type="button"
                                            className={cls}
                                            onClick={() =>
                                                setCurrentQuestionIndex(index)
                                            }
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="oes-info-box">
                                <div className="oes-info-label">Time Limit</div>
                                <div className="oes-info-val">
                                    {onlineExam.time_limit_minutes} minutes
                                </div>
                            </div>
                            <div className="oes-info-box">
                                <div className="oes-info-label">
                                    Current Progress
                                </div>
                                <div className="oes-info-val">
                                    {answeredCount}/{questions.length} answered
                                </div>
                            </div>

                            <button
                                type="button"
                                className="oes-submit-btn"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Submitting exam…"
                                    : "Submit Exam"}
                            </button>
                        </div>

                        {/* Question panel */}
                        <div className="oes-card">
                            {currentQuestion ? (
                                <>
                                    <div className="oes-q-header">
                                        <span className="oes-q-number">
                                            Question {currentQuestionIndex + 1}{" "}
                                            of {questions.length}
                                        </span>
                                        <span className="oes-q-type">MCQ</span>
                                    </div>

                                    <div className="oes-q-text">
                                        {currentQuestion.question}
                                    </div>

                                    <div className="oes-choices">
                                        {currentQuestion.choices.map(
                                            (choice) => {
                                                const isSelected =
                                                    selectedAnswers[
                                                        currentQuestion
                                                            .question_index
                                                    ] === choice;
                                                return (
                                                    <button
                                                        key={choice}
                                                        type="button"
                                                        className={`oes-choice${isSelected ? " oes-choice-selected" : ""}`}
                                                        onClick={() =>
                                                            handleOptionSelect(
                                                                currentQuestion.question_index,
                                                                choice,
                                                            )
                                                        }
                                                    >
                                                        {choice}
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>

                                    <div className="oes-q-nav">
                                        <button
                                            type="button"
                                            className="oes-q-nav-prev"
                                            onClick={() =>
                                                setCurrentQuestionIndex((i) =>
                                                    Math.max(i - 1, 0),
                                                )
                                            }
                                            disabled={
                                                currentQuestionIndex === 0
                                            }
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="button"
                                            className="oes-q-nav-next"
                                            onClick={() =>
                                                setCurrentQuestionIndex((i) =>
                                                    Math.min(
                                                        i + 1,
                                                        questions.length - 1,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                currentQuestionIndex ===
                                                questions.length - 1
                                            }
                                        >
                                            Next
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="oes-no-questions">
                                    No questions were generated for this exam.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
