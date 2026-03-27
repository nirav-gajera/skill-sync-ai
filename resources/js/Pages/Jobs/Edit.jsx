import Layout from "../Dashboard/Components/Layout";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import { PencilIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.je-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Header ── */
.je-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
.je-title    { font-size:22px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; }
.je-subtitle { font-size:13px; color:#6e7e95; margin-top:3px; }

/* ── Two-col layout ── */
.je-two-col { display:grid; gap:20px; grid-template-columns:1.3fr 0.7fr; }
@media(max-width:900px){ .je-two-col { grid-template-columns:1fr; } }

/* ── Card ── */
.je-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:28px;
}

/* ── Form headings ── */
.je-form-title    { font-size:17px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.je-form-subtitle { font-size:12px; color:#6e7e95; margin-bottom:24px; }

/* ── Fields ── */
.je-field { margin-bottom:20px; }
.je-label {
    display:block; font-size:12px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.7px; margin-bottom:8px;
}
.je-input, .je-textarea {
    width:100%; padding:10px 14px;
    background:#0f172a; border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; color:#e2e8f0; font-size:13px;
    font-family:'Inter',sans-serif; outline:none; transition:all 0.18s;
}
.je-input:focus, .je-textarea:focus {
    border-color:rgba(56,189,248,0.40);
    box-shadow:0 0 0 3px rgba(56,189,248,0.08);
}
.je-input::placeholder, .je-textarea::placeholder { color:#6e7e95; }
.je-input-error {
    border-color:rgba(248,113,113,0.50) !important;
    box-shadow:0 0 0 3px rgba(248,113,113,0.08) !important;
}
.je-textarea { resize:vertical; min-height:180px; line-height:1.7; }
.je-error { font-size:12px; color:#f87171; margin-top:5px; }

/* ── Actions ── */
.je-actions { display:flex; align-items:center; gap:10px; padding-top:4px; }
.je-btn-submit {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 22px; border-radius:10px;
    background:linear-gradient(135deg,#059669,#0ea5e9);
    color:#fff; font-size:13px; font-weight:700;
    border:none; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(5,150,105,0.25);
    font-family:'Inter',sans-serif;
}
.je-btn-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
.je-btn-submit:disabled { opacity:0.50; cursor:not-allowed; transform:none; }
.je-btn-cancel {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 18px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#94a3b8; font-size:13px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.je-btn-cancel:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }

/* ── Info aside ── */
.je-aside-title    { font-size:15px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.je-aside-subtitle { font-size:12px; color:#6e7e95; margin-bottom:18px; }

/* current values preview */
.je-preview-label { font-size:11px; font-weight:600; color:#6e7e95; text-transform:uppercase; letter-spacing:0.7px; margin-bottom:6px; }
.je-preview-val {
    background:#0f172a; border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:12px 14px;
    font-size:13px; color:#94a3b8; line-height:1.6;
    margin-bottom:16px; word-break:break-word;
    max-height:120px; overflow-y:auto;
}
.je-preview-val::-webkit-scrollbar { width:4px; }
.je-preview-val::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.10); border-radius:4px; }

.je-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:20px 0; }

/* ── Edit notice ── */
.je-notice {
    background:rgba(56,189,248,0.07); border:1px solid rgba(56,189,248,0.18);
    border-radius:10px; padding:12px 14px;
    font-size:12px; color:#7dd3fc; line-height:1.6;
}
`;

export default function Edit({ job }) {
    const { data, setData, put, processing, errors } = useForm({
        title: job.title,
        description: job.description,
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
        put(`/jobs/${job.id}`, { preserveScroll: true });
    };

    const hasError = (field) => !!(clientErrors[field] || errors[field]);
    const getError = (field) => clientErrors[field] || errors[field];

    return (
        <Layout>
            <style>{styles}</style>
            <Head title="Edit Job" />

            <div className="je-root">
                {/* ── Header ── */}
                <div className="je-header">
                    <div>
                        <div className="je-title">Edit Job</div>
                        <div className="je-subtitle">
                            Update the job title or description below.
                        </div>
                    </div>
                    <Link href="/jobs" className="je-btn-cancel">
                        <ArrowLeftIcon style={{ width: 14, height: 14 }} />
                        Back to Jobs
                    </Link>
                </div>

                <div className="je-two-col">
                    {/* ── Form card ── */}
                    <div className="je-card">
                        <div className="je-form-title">Job Details</div>
                        <div className="je-form-subtitle">
                            Edit the fields below and save your changes.
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            {/* Title */}
                            <div className="je-field">
                                <label htmlFor="title" className="je-label">
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
                                    className={`je-input${hasError("title") ? " je-input-error" : ""}`}
                                />
                                {hasError("title") && (
                                    <div className="je-error">
                                        {getError("title")}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="je-field">
                                <label
                                    htmlFor="description"
                                    className="je-label"
                                >
                                    Job Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Paste or write the full job description…"
                                    className={`je-textarea${hasError("description") ? " je-input-error" : ""}`}
                                    rows={8}
                                />
                                {hasError("description") && (
                                    <div className="je-error">
                                        {getError("description")}
                                    </div>
                                )}
                            </div>

                            <hr className="je-divider" />

                            {/* Actions */}
                            <div className="je-actions">
                                <button
                                    type="submit"
                                    className="je-btn-submit"
                                    disabled={processing}
                                >
                                    <PencilIcon
                                        style={{ width: 14, height: 14 }}
                                    />
                                    {processing ? "Updating…" : "Update Job"}
                                </button>
                                <Link href="/jobs" className="je-btn-cancel">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* ── Aside: current values preview ── */}
                    <div className="je-card">
                        <div class="je-aside-title">Current Values</div>
                        <div className="je-aside-subtitle">
                            Reference the original content while you edit.
                        </div>

                        <div className="je-preview-label">Title</div>
                        <div className="je-preview-val">{job.title || "—"}</div>

                        <div className="je-preview-label">Description</div>
                        <div className="je-preview-val">
                            {job.description || "—"}
                        </div>

                        <hr className="je-divider" />

                        <div className="je-notice">
                            Changes will apply immediately to all resumes and
                            analytics scans that reference this job.
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
