import Layout from "../Dashboard/Components/Layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    EyeIcon,
    TrashIcon,
    XMarkIcon,
    ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.oe-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Hero banner ── */
.oe-hero {
    border-radius:16px; overflow:hidden; margin-bottom:20px;
    background:linear-gradient(135deg, #0f2744 0%, #0f172a 50%, #0c2340 100%);
    border:1px solid rgba(56,189,248,0.15);
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
}
.oe-hero-inner {
    padding:36px 32px; display:flex; flex-wrap:wrap;
    gap:24px; align-items:flex-end; justify-content:space-between;
}
.oe-hero-badge {
    display:inline-flex; align-items:center;
    padding:4px 12px; border-radius:20px;
    background:rgba(56,189,248,0.10); border:1px solid rgba(56,189,248,0.25);
    color:#7dd3fc; font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:0.3em; margin-bottom:12px;
}
.oe-hero-title {
    font-size:26px; font-weight:800; color:#f1f5f9;
    line-height:1.3; letter-spacing:-0.5px; max-width:620px; margin-bottom:10px;
}
.oe-hero-desc {
    font-size:13px; color:#7b94b7; line-height:1.7; max-width:540px;
}
.oe-btn-take {
    display:inline-flex; align-items:center; gap:7px;
    padding:11px 24px; border-radius:10px; flex-shrink:0;
    background:linear-gradient(135deg,#0ea5e9,#6366f1);
    color:#fff; font-size:13px; font-weight:700;
    text-decoration:none; transition:all 0.18s;
    box-shadow:0 4px 16px rgba(14,165,233,0.30); border:none; cursor:pointer;
    white-space:nowrap;
}
.oe-btn-take:hover { opacity:0.9; transform:translateY(-1px); }

/* ── Section card ── */
.oe-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; overflow:hidden;
}
.oe-card-header {
    padding:18px 22px; border-bottom:1px solid rgba(255,255,255,0.06);
    display:flex; align-items:center; justify-content:space-between;
}
.oe-card-title    { font-size:15px; font-weight:700; color:#f1f5f9; }
.oe-card-subtitle { font-size:12px; color:#6e7e95; margin-top:3px; }

/* ── Table ── */
.oe-table-wrap { overflow-x:auto; }
.oe-table { width:100%; border-collapse:collapse; min-width:860px; }
.oe-table thead { background:rgba(255,255,255,0.025); }
.oe-table th {
    padding:12px 18px; text-align:left;
    font-size:11px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.8px;
    border-bottom:1px solid rgba(255,255,255,0.05); white-space:nowrap;
}
.oe-table td {
    padding:14px 18px; font-size:13px; color:#94a3b8;
    border-bottom:1px solid rgba(255,255,255,0.04);
}
.oe-table tbody tr:last-child td { border-bottom:none; }
.oe-table tbody tr:hover td { background:rgba(255,255,255,0.025); }

/* exam title cell */
.oe-exam-title { font-size:13px; font-weight:600; color:#e2e8f0; }
.oe-exam-id    { font-size:11px; color:#6e7e95; margin-top:2px; }

/* status badges */
.oe-badge {
    display:inline-flex; align-items:center;
    padding:3px 10px; border-radius:20px;
    font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;
}
.oe-badge-completed { background:rgba(52,211,153,0.10); color:#34d399; border:1px solid rgba(52,211,153,0.20); }
.oe-badge-pending   { background:rgba(251,191,36,0.10);  color:#fbbf24; border:1px solid rgba(251,191,36,0.20); }

/* score */
.oe-score { font-size:13px; font-weight:700; color:#f1f5f9; }
.oe-score-pending { color:#6e7e95; font-style:italic; }

/* ── Action buttons ── */
.oe-actions { display:flex; align-items:center; gap:6px; }
.oe-action-btn {
    width:30px; height:30px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    border:1px solid transparent; cursor:pointer;
    background:none; transition:all 0.16s; text-decoration:none; flex-shrink:0;
}
.oe-action-view { color:#38bdf8; background:rgba(56,189,248,0.08);  border-color:rgba(56,189,248,0.15); }
.oe-action-del  { color:#f87171; background:rgba(248,113,113,0.08); border-color:rgba(248,113,113,0.15); }
.oe-action-view:hover { background:rgba(56,189,248,0.18); }
.oe-action-del:hover  { background:rgba(248,113,113,0.18); }

/* ── Empty state ── */
.oe-empty { padding:52px 20px; text-align:center; }
.oe-empty-icon { font-size:36px; margin-bottom:10px; }
.oe-empty-text { font-size:14px; color:#6e7e95; font-weight:500; }

/* ── Delete Modal ── */
.oe-modal-backdrop {
    position:fixed; inset:0; z-index:60;
    background:rgba(0,0,0,0.60); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center;
}
.oe-modal {
    position:relative; z-index:61;
    background:#1e293b; border:1px solid rgba(255,255,255,0.09);
    border-radius:18px; padding:32px 28px;
    width:500px; max-width:90vw;
    box-shadow:0 24px 60px rgba(0,0,0,0.5);
    font-family:'Inter',sans-serif;
}
.oe-modal-close {
    position:absolute; top:14px; right:14px;
    width:28px; height:28px; border-radius:7px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
    color:#7b94b7; cursor:pointer;
    display:flex; align-items:center; justify-content:center; transition:all 0.18s;
}
.oe-modal-close:hover { background:rgba(255,255,255,0.09); color:#94a3b8; }
.oe-modal-icon {
    width:48px; height:48px; border-radius:14px;
    background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.22);
    display:flex; align-items:center; justify-content:center; margin-bottom:16px;
}
.oe-modal-title { font-size:17px; font-weight:700; color:#f1f5f9; margin-bottom:8px; }
.oe-modal-desc  { font-size:14px; color:#7b94b7; line-height:1.6; margin-bottom:24px; }
.oe-modal-actions { display:flex; gap:10px; justify-content:flex-end; }
.oe-modal-cancel {
    padding:9px 20px; border-radius:9px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#64748b; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
    font-family:'Inter',sans-serif;
}
.oe-modal-cancel:hover { background:rgba(255,255,255,0.08); color:#94a3b8; }
.oe-modal-delete {
    padding:9px 20px; border-radius:9px;
    background:linear-gradient(135deg,#dc2626,#b91c1c); border:none;
    color:#fff; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(220,38,38,0.30); font-family:'Inter',sans-serif;
}
.oe-modal-delete:hover { opacity:0.9; transform:translateY(-1px); }
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

/* ── Unchanged helper ── */
function formatDuration(totalSeconds) {
    if (typeof totalSeconds !== "number") return "Pending";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export default function OnlineExamsIndex({ onlineExams }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    /* body scroll lock when modal open */
    useEffect(() => {
        document.body.style.overflow = deleteId ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [deleteId]);

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/online-exams/${deleteId}`, {
            onSuccess: () => setDeleteId(null),
        });
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Online Exams" />

            <div className="oe-root">
                {/* ── Hero / Take Exam banner ── */}
                <div className="oe-hero">
                    <div className="oe-hero-inner">
                        <div>
                            <div className="oe-hero-badge">Exam History</div>
                            <div className="oe-hero-title">
                                Take Exam and review every previous AI-generated
                                attempt in one place.
                            </div>
                            <div className="oe-hero-desc">
                                Each attempt stores the timer, score, resume,
                                job description, and full question-by-question
                                result view.
                            </div>
                        </div>
                        <Link
                            href="/online-exams/create"
                            className="oe-btn-take"
                        >
                            <ClipboardDocumentListIcon
                                style={{ width: 15, height: 15 }}
                            />
                            Take Exam
                        </Link>
                    </div>
                </div>

                {/* ── Previous Exams table card ── */}
                <div className="oe-card">
                    <div className="oe-card-header">
                        <div>
                            <div className="oe-card-title">Previous Exams</div>
                            <div className="oe-card-subtitle">
                                Open any row to review questions, selected
                                answers, score, and timing.
                            </div>
                        </div>
                    </div>

                    <div className="oe-table-wrap">
                        <table className="oe-table">
                            <thead>
                                <tr>
                                    <th>Exam</th>
                                    <th>Resume</th>
                                    <th>Status</th>
                                    <th>Score</th>
                                    <th>Time Taken</th>
                                    <th>Questions</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {onlineExams.data.length > 0 ? (
                                    onlineExams.data.map((exam) => {
                                        const score =
                                            exam.evaluation_result?.percentage;
                                        return (
                                            <tr key={exam.id}>
                                                <td>
                                                    <div className="oe-exam-title">
                                                        {exam.job?.title ||
                                                            "Untitled exam"}
                                                    </div>
                                                    <div className="oe-exam-id">
                                                        #{exam.id}
                                                    </div>
                                                </td>
                                                <td>
                                                    {exam.resume?.name || "N/A"}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`oe-badge ${exam.status === "completed" ? "oe-badge-completed" : "oe-badge-pending"}`}
                                                    >
                                                        {exam.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {typeof score ===
                                                    "number" ? (
                                                        <span className="oe-score">
                                                            {score}%
                                                        </span>
                                                    ) : (
                                                        <span className="oe-score-pending">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {formatDuration(
                                                        exam.time_taken_seconds,
                                                    )}
                                                </td>
                                                <td>
                                                    {exam.question_count ||
                                                        exam.questions
                                                            ?.length ||
                                                        0}
                                                </td>
                                                <td>
                                                    {new Date(
                                                        exam.created_at,
                                                    ).toLocaleString()}
                                                </td>
                                                <td>
                                                    <div className="oe-actions">
                                                        <Link
                                                            href={`/online-exams/${exam.id}`}
                                                            className="oe-action-btn oe-action-view"
                                                            title="View"
                                                        >
                                                            <EyeIcon
                                                                style={{
                                                                    width: 14,
                                                                    height: 14,
                                                                }}
                                                            />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="oe-action-btn oe-action-del"
                                                            title="Delete"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    exam.id,
                                                                )
                                                            }
                                                        >
                                                            <TrashIcon
                                                                style={{
                                                                    width: 14,
                                                                    height: 14,
                                                                }}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8">
                                            <div className="oe-empty">
                                                <div className="oe-empty-icon">
                                                    📋
                                                </div>
                                                <div className="oe-empty-text">
                                                    No exams found yet. Start
                                                    the first one from the Take
                                                    Exam button.
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Delete Modal ── */}
            {deleteId && (
                <div
                    className="oe-modal-backdrop"
                    onClick={() => setDeleteId(null)}
                >
                    <div
                        className="oe-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="oe-modal-close"
                            onClick={() => setDeleteId(null)}
                        >
                            <XMarkIcon style={{ width: 14, height: 14 }} />
                        </button>
                        <div className="oe-modal-icon">
                            <TrashIcon
                                style={{
                                    width: 22,
                                    height: 22,
                                    color: "#f87171",
                                }}
                            />
                        </div>
                        <div className="oe-modal-title">Delete Exam?</div>
                        <div className="oe-modal-desc">
                            This removes the generated questions, submitted
                            answers, score, and exam history entry. This action
                            cannot be undone.
                        </div>
                        <div className="oe-modal-actions">
                            <button
                                className="oe-modal-cancel"
                                onClick={() => setDeleteId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="oe-modal-delete"
                                onClick={handleDelete}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
