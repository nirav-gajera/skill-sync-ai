import Layout from "../Dashboard/Components/Layout";
import { Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import {
    ArrowLeftIcon,
    PencilIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/outline";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.js-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Header ── */
.js-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
.js-title    { font-size:22px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; }
.js-subtitle { font-size:13px; color:#6e7e95; margin-top:3px; }
.js-header-actions { display:flex; align-items:center; gap:10px; }

/* ── Two-col layout ── */
.js-two-col { display:grid; gap:20px; grid-template-columns:1.3fr 0.7fr; }
@media(max-width:900px){ .js-two-col { grid-template-columns:1fr; } }

/* ── Card ── */
.js-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:28px;
}

/* ── Field blocks ── */
.js-field { margin-bottom:24px; }
.js-field:last-child { margin-bottom:0; }
.js-field-label {
    font-size:11px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.7px; margin-bottom:10px;
}
.js-field-val {
    font-size:14px; color:#e2e8f0; line-height:1.8;
    white-space:pre-wrap; word-break:break-word;
}
.js-field-title-val {
    font-size:18px; font-weight:700; color:#f1f5f9; line-height:1.4;
}

.js-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:20px 0; }

/* ── Action buttons ── */
.js-btn-back {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 18px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#94a3b8; font-size:13px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.js-btn-back:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }

.js-btn-edit {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 18px; border-radius:10px;
    background:linear-gradient(135deg,#059669,#0ea5e9);
    color:#fff; font-size:13px; font-weight:700;
    text-decoration:none; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(5,150,105,0.22); border:none;
}
.js-btn-edit:hover { opacity:0.9; transform:translateY(-1px); }

/* ── Meta aside ── */
.js-aside-title    { font-size:15px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.js-aside-subtitle { font-size:12px; color:#6e7e95; margin-bottom:18px; }

.js-meta-item {
    background:#0f172a; border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:13px 15px; margin-bottom:10px;
}
.js-meta-label { font-size:11px; font-weight:600; color:#6e7e95; text-transform:uppercase; letter-spacing:0.6px; margin-bottom:5px; }
.js-meta-val   { font-size:13px; color:#e2e8f0; font-weight:500; }

.js-notice {
    background:rgba(56,189,248,0.07); border:1px solid rgba(56,189,248,0.18);
    border-radius:10px; padding:12px 14px;
    font-size:12px; color:#7dd3fc; line-height:1.6; margin-top:14px;
}
`;

export default function Show({ job }) {
    return (
        <Layout>
            <style>{styles}</style>
            <Head title="View Job" />

            <div className="js-root">
                {/* ── Header ── */}
                <div className="js-header">
                    <div>
                        <div className="js-title">Job Details</div>
                        <div className="js-subtitle">Viewing job #{job.id}</div>
                    </div>
                    <div className="js-header-actions">
                        <Link
                            href={`/jobs/${job.id}/edit`}
                            className="js-btn-edit"
                        >
                            <PencilIcon style={{ width: 14, height: 14 }} />
                            Edit Job
                        </Link>
                        <Link href="/jobs" className="js-btn-back">
                            <ArrowLeftIcon style={{ width: 14, height: 14 }} />
                            Back
                        </Link>
                    </div>
                </div>

                <div className="js-two-col">
                    {/* ── Main content card ── */}
                    <div className="js-card">
                        {/* Title */}
                        <div className="js-field">
                            <div className="js-field-label">Job Title</div>
                            <div className="js-field-title-val">
                                {job.title}
                            </div>
                        </div>

                        <hr className="js-divider" />

                        {/* Description */}
                        <div className="js-field">
                            <div className="js-field-label">
                                Job Description
                            </div>
                            <div className="js-field-val">
                                {job.description}
                            </div>
                        </div>
                    </div>

                    {/* ── Meta aside ── */}
                    <div className="js-card">
                        <div className="js-aside-title">Job Info</div>
                        <div className="js-aside-subtitle">
                            Details about this job entry.
                        </div>

                        <div className="js-meta-item">
                            <div className="js-meta-label">Job ID</div>
                            <div className="js-meta-val">#{job.id}</div>
                        </div>

                        <div className="js-meta-item">
                            <div className="js-meta-label">Title</div>
                            <div className="js-meta-val">{job.title}</div>
                        </div>

                        {job.created_at && (
                            <div className="js-meta-item">
                                <div className="js-meta-label">Created</div>
                                <div className="js-meta-val">
                                    {new Date(
                                        job.created_at,
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        )}

                        {job.updated_at && (
                            <div className="js-meta-item">
                                <div className="js-meta-label">
                                    Last Updated
                                </div>
                                <div className="js-meta-val">
                                    {new Date(
                                        job.updated_at,
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        )}

                        <hr className="js-divider" />

                        <div className="js-notice">
                            This job is used for resume matching, cover letter
                            generation, interview prep, and online exams.
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
