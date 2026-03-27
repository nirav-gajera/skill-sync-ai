import Layout from "../Dashboard/Components/Layout";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    PlusIcon,
    ArrowLeftIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/outline";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.jc-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Header ── */
.jc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
.jc-title    { font-size:22px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; }
.jc-subtitle { font-size:13px; color:#6e7e95; margin-top:3px; }

/* ── Two-col layout ── */
.jc-two-col {
    display:grid; gap:20px;
    grid-template-columns:1.3fr 0.7fr;
}
@media(max-width:900px){ .jc-two-col { grid-template-columns:1fr; } }

/* ── Card ── */
.jc-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:28px;
}

/* ── Form headings ── */
.jc-form-title    { font-size:17px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.jc-form-subtitle { font-size:12px; color:#6e7e95; margin-bottom:24px; }

/* ── Fields ── */
.jc-field  { margin-bottom:20px; }
.jc-label  {
    display:block; font-size:12px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.7px; margin-bottom:8px;
}
.jc-input, .jc-textarea {
    width:100%; padding:10px 14px;
    background:#0f172a; border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; color:#e2e8f0; font-size:13px;
    font-family:'Inter',sans-serif; outline:none; transition:all 0.18s;
}
.jc-input:focus, .jc-textarea:focus {
    border-color:rgba(56,189,248,0.40);
    box-shadow:0 0 0 3px rgba(56,189,248,0.08);
}
.jc-input::placeholder, .jc-textarea::placeholder { color:#6e7e95; }
.jc-input-error  {
    border-color:rgba(248,113,113,0.50) !important;
    box-shadow:0 0 0 3px rgba(248,113,113,0.08) !important;
}
.jc-textarea { resize:vertical; min-height:180px; line-height:1.7; }
.jc-error { font-size:12px; color:#f87171; margin-top:5px; }

/* ── Actions ── */
.jc-actions { display:flex; align-items:center; gap:10px; padding-top:4px; }
.jc-btn-submit {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 22px; border-radius:10px;
    background:linear-gradient(135deg,#0ea5e9,#6366f1);
    color:#fff; font-size:13px; font-weight:700;
    border:none; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(14,165,233,0.25);
    font-family:'Inter',sans-serif;
}
.jc-btn-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
.jc-btn-submit:disabled { opacity:0.50; cursor:not-allowed; transform:none; }
.jc-btn-cancel {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 18px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#94a3b8; font-size:13px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.jc-btn-cancel:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }

/* ── Tips aside ── */
.jc-aside-title    { font-size:15px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.jc-aside-subtitle { font-size:12px; color:#6e7e95; margin-bottom:18px; }
.jc-tip-list       { display:flex; flex-direction:column; gap:10px; }
.jc-tip-item {
    background:#0f172a; border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:13px 15px;
}
.jc-tip-title { font-size:12px; font-weight:700; color:#e2e8f0; margin-bottom:4px; }
.jc-tip-desc  { font-size:12px; color:#6e7e95; line-height:1.6; }

/* ── Divider inside card ── */
.jc-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:20px 0; }
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

const tips = [
    {
        title: "Write a clear job title",
        desc: 'Use standard titles like "Senior Frontend Engineer" or "Product Manager" so the AI can match skills accurately.',
    },
    {
        title: "Be specific in the description",
        desc: "Include required skills, responsibilities, and qualifications. The more detail, the better the resume matching.",
    },
    {
        title: "Include tech stack & tools",
        desc: "Mention specific frameworks, languages, or tools (e.g. React, Python, Figma) for precise keyword scoring.",
    },
    {
        title: "Add experience requirements",
        desc: "Specifying years of experience and seniority level improves ATS score calibration.",
    },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
    });

    /* ── unchanged client-side validation ── */
    const [clientErrors, setClientErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newClientErrors = {};
        if (!data.title.trim()) newClientErrors.title = "Title is required";
        if (!data.description.trim())
            newClientErrors.description = "Description is required";
        setClientErrors(newClientErrors);
        if (Object.keys(newClientErrors).length > 0) return;
        post("/jobs", { preserveScroll: true });
    };

    const hasError = (field) => !!(clientErrors[field] || errors[field]);
    const getError = (field) => clientErrors[field] || errors[field];

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Create Job" />

            <div className="jc-root">
                {/* ── Header ── */}
                <div className="jc-header">
                    <div>
                        <div className="jc-title">Create Job</div>
                        <div className="jc-subtitle">
                            Add a new job description to use for resume matching
                            and exams.
                        </div>
                    </div>
                    <Link href="/jobs" className="jc-btn-cancel">
                        <ArrowLeftIcon style={{ width: 14, height: 14 }} />
                        Back to Jobs
                    </Link>
                </div>

                <div className="jc-two-col">
                    {/* ── Form card ── */}
                    <div className="jc-card">
                        <div className="jc-form-title">Job Details</div>
                        <div className="jc-form-subtitle">
                            Both fields are required to save the job.
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            {/* Title */}
                            <div className="jc-field">
                                <label htmlFor="title" className="jc-label">
                                    Job Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="e.g. Senior Frontend Engineer"
                                    className={`jc-input${hasError("title") ? " jc-input-error" : ""}`}
                                />
                                {hasError("title") && (
                                    <div className="jc-error">
                                        {getError("title")}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="jc-field">
                                <label
                                    htmlFor="description"
                                    className="jc-label"
                                >
                                    Job Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Paste or write the full job description including responsibilities, requirements, and skills…"
                                    className={`jc-textarea${hasError("description") ? " jc-input-error" : ""}`}
                                    rows={8}
                                />
                                {hasError("description") && (
                                    <div className="jc-error">
                                        {getError("description")}
                                    </div>
                                )}
                            </div>

                            <hr className="jc-divider" />

                            {/* Actions */}
                            <div className="jc-actions">
                                <button
                                    type="submit"
                                    className="jc-btn-submit"
                                    disabled={processing}
                                >
                                    <PlusIcon
                                        style={{ width: 14, height: 14 }}
                                    />
                                    {processing ? "Saving…" : "Save Job"}
                                </button>
                                <Link href="/jobs" className="jc-btn-cancel">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* ── Tips aside ── */}
                    <div className="jc-card">
                        <div className="jc-aside-title">
                            Tips for better results
                        </div>
                        <div className="jc-aside-subtitle">
                            Well-structured job descriptions improve AI matching
                            accuracy.
                        </div>
                        <div className="jc-tip-list">
                            {tips.map((tip) => (
                                <div key={tip.title} className="jc-tip-item">
                                    <div className="jc-tip-title">
                                        {tip.title}
                                    </div>
                                    <div className="jc-tip-desc">
                                        {tip.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
