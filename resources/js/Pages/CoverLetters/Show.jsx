import Layout from '../Dashboard/Components/Layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, PencilIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.cls-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Header ── */
.cls-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
.cls-title    { font-size:22px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; }
.cls-subtitle { font-size:13px; color:#6e7e95; margin-top:3px; }
.cls-header-actions { display:flex; align-items:center; gap:10px; }

/* ── Action buttons ── */
.cls-btn-edit {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:10px;
    background:linear-gradient(135deg,#059669,#0ea5e9);
    color:#fff; font-size:13px; font-weight:700;
    text-decoration:none; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(5,150,105,0.22); border:none;
}
.cls-btn-edit:hover { opacity:0.9; transform:translateY(-1px); }

.cls-btn-back {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#94a3b8; font-size:13px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.cls-btn-back:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }

/* ── Outer card ── */
.cls-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; overflow:hidden;
}

/* ── Card top bar ── */
.cls-card-bar {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 22px; border-bottom:1px solid rgba(255,255,255,0.06);
    flex-wrap:wrap; gap:10px;
}
.cls-card-bar-left { display:flex; align-items:center; gap:10px; }
.cls-card-dot {
    width:10px; height:10px; border-radius:50%;
    background:linear-gradient(135deg,#0ea5e9,#6366f1); flex-shrink:0;
}
.cls-card-bar-title { font-size:13px; font-weight:700; color:#94a3b8; }
.cls-card-bar-id    { font-size:12px; color:#475569; }

/* download link in bar */
.cls-btn-download {
    display:inline-flex; align-items:center; gap:6px;
    padding:6px 14px; border-radius:8px;
    background:rgba(52,211,153,0.09); border:1px solid rgba(52,211,153,0.20);
    color:#34d399; font-size:12px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.cls-btn-download:hover { background:rgba(52,211,153,0.18); }

/* ── White preview area ── */
.cls-preview-wrap {
    padding:28px;
    background:#0f172a; /* light bg so cover letter renders correctly */
}
.cls-preview-inner {
    background:#fff;
    border-radius:10px;
    padding:32px;
    box-shadow:0 2px 16px rgba(0,0,0,0.10);
    max-width:860px;
    margin:0 auto;
    overflow:auto;
}
`;

export default function Show({ coverLetter }) {
    return (
        <Layout>
            <style>{styles}</style>
            <Head title={`Cover Letter - ${coverLetter.company_name || 'View'}`} />

            <div className="cls-root">

                {/* ── Header ── */}
                <div className="cls-header">
                    <div>
                        <div className="cls-title">
                            Cover Letter{coverLetter.company_name ? ` — ${coverLetter.company_name}` : ''}
                        </div>
                        <div className="cls-subtitle">Preview #{coverLetter.id}</div>
                    </div>
                    <div className="cls-header-actions">
                        <Link href={`/cover-letters/${coverLetter.id}/edit`} className="cls-btn-edit">
                            <PencilIcon style={{ width: 14, height: 14 }} />
                            Edit
                        </Link>
                        <Link href="/cover-letters" className="cls-btn-back">
                            <ArrowLeftIcon style={{ width: 14, height: 14 }} />
                            Back
                        </Link>
                    </div>
                </div>

                {/* ── Preview card ── */}
                <div className="cls-card">

                    {/* Top bar */}
                    <div className="cls-card-bar">
                        <div className="cls-card-bar-left">
                            <div className="cls-card-dot" />
                            <span className="cls-card-bar-title">
                                {coverLetter.company_name || 'Cover Letter'}
                            </span>
                            <span className="cls-card-bar-id">#{coverLetter.id}</span>
                        </div>
                        {/* Download if file exists */}
                        {coverLetter.file_url && (
                            <a
                                href={coverLetter.file_url}
                                download
                                className="cls-btn-download"
                            >
                                <ArrowDownTrayIcon style={{ width: 13, height: 13 }} />
                                Download PDF
                            </a>
                        )}
                    </div>

                    {/* White preview area — cover letter HTML renders in light context */}
                    <div className="cls-preview-wrap">
                        <div className="cls-preview-inner">
                            <div dangerouslySetInnerHTML={{ __html: coverLetter.html }} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}