import Layout from '../Dashboard/Components/Layout';
import { router, Link, Head } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Select from 'react-select';
import {
    ChevronLeftIcon,
    CheckIcon,
    DocumentTextIcon,
    ArrowTopRightOnSquareIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .ipc-root {
        font-family: 'Inter', sans-serif;
        padding: 28px 28px 60px;
        background: #0f172a;
        min-height: 100%;
    }

    /* ── Header ── */
    .ipc-header {
        display: flex; align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
    }
    .ipc-title    { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
    .ipc-subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }
    .ipc-back {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; font-weight: 600; color: #38bdf8;
        text-decoration: none; padding: 7px 14px; border-radius: 9px;
        background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.18);
        transition: all 0.18s; white-space: nowrap;
    }
    .ipc-back:hover { background: rgba(56,189,248,0.15); }

    /* ── Card ── */
    .ipc-card {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 32px;
        width: 100%; box-sizing: border-box;
    }

    /* ── Field ── */
    .ipc-field { margin-bottom: 28px; }
    .ipc-label {
        display: block; font-size: 13px; font-weight: 600;
        color: #cbd5e1; margin-bottom: 10px;
    }

    /* ── react-select dark override ── */
    .ipc-select .react-select__control {
        background: #0f172a !important;
        border: 1px solid rgba(255,255,255,0.10) !important;
        border-radius: 10px !important;
        box-shadow: none !important;
        min-height: 44px !important;
        transition: border-color 0.18s, box-shadow 0.18s !important;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
    }
    .ipc-select .react-select__control:hover {
        border-color: rgba(255,255,255,0.18) !important;
    }
    .ipc-select .react-select__control--is-focused {
        border-color: rgba(56,189,248,0.45) !important;
        box-shadow: 0 0 0 3px rgba(56,189,248,0.08) !important;
    }
    .ipc-select .react-select__placeholder { color: #6e7e95 !important; }
    .ipc-select .react-select__single-value { color: #e2e8f0 !important; }
    .ipc-select .react-select__input-container { color: #e2e8f0 !important; }
    .ipc-select .react-select__menu {
        background: #1e293b !important;
        border: 1px solid rgba(255,255,255,0.09) !important;
        border-radius: 12px !important;
        box-shadow: 0 16px 40px rgba(0,0,0,0.4) !important;
        overflow: hidden;
        font-size: 14px;
        font-family: 'Inter', sans-serif;
    }
    .ipc-select .react-select__menu-list { padding: 6px !important; }
    .ipc-select .react-select__option {
        background: transparent !important;
        color: #94a3b8 !important;
        border-radius: 8px !important;
        padding: 10px 12px !important;
        cursor: pointer !important;
        transition: all 0.15s !important;
    }
    .ipc-select .react-select__option:hover {
        background: rgba(255,255,255,0.05) !important;
        color: #e2e8f0 !important;
    }
    .ipc-select .react-select__option--is-selected {
        background: rgba(56,189,248,0.12) !important;
        color: #38bdf8 !important;
    }
    .ipc-select .react-select__option--is-focused {
        background: rgba(255,255,255,0.04) !important;
        color: #cbd5e1 !important;
    }
    .ipc-select .react-select__indicator-separator { background: rgba(255,255,255,0.08) !important; }
    .ipc-select .react-select__dropdown-indicator,
    .ipc-select .react-select__clear-indicator { color: #475569 !important; cursor: pointer; }
    .ipc-select .react-select__dropdown-indicator:hover,
    .ipc-select .react-select__clear-indicator:hover { color: #94a3b8 !important; }
    .ipc-select .react-select__no-options-message { color: #475569 !important; font-size: 13px; padding: 12px; }

    /* ── Resume grid ── */
    .ipc-resume-grid-wrap {
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 12px;
        max-height: 300px;
        overflow-y: auto;
        padding: 12px;
        background: rgba(0,0,0,0.15);
    }
    .ipc-resume-grid-wrap::-webkit-scrollbar { width: 4px; }
    .ipc-resume-grid-wrap::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }

    .ipc-resume-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }
    @media (max-width: 900px)  { .ipc-resume-grid { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 540px)  { .ipc-resume-grid { grid-template-columns: 1fr; } }

    .ipc-resume-card {
        background: #1a2640;
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 12px; padding: 14px;
        cursor: pointer; transition: all 0.18s;
        display: flex; flex-direction: column; gap: 8px;
        position: relative;
    }
    .ipc-resume-card:hover {
        border-color: rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.04);
    }
    .ipc-resume-card-active {
        border-color: rgba(56,189,248,0.45) !important;
        background: rgba(56,189,248,0.07) !important;
        box-shadow: 0 0 0 3px rgba(56,189,248,0.07);
    }

    .ipc-resume-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    .ipc-resume-icon {
        width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
        background: rgba(129,140,248,0.12); border: 1px solid rgba(129,140,248,0.20);
        display: flex; align-items: center; justify-content: center;
    }
    .ipc-resume-check {
        width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0;
        background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.35);
        display: flex; align-items: center; justify-content: center;
    }
    .ipc-resume-placeholder {
        width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0;
        border: 1.5px solid rgba(255,255,255,0.10);
    }

    .ipc-resume-name {
        font-size: 13px; font-weight: 600; color: #cbd5e1;
        line-height: 1.4; flex: 1; min-width: 0;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .ipc-resume-card-active .ipc-resume-name { color: #e2e8f0; }

    .ipc-resume-link {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 11px; font-weight: 600; color: #38bdf8;
        text-decoration: none; transition: color 0.15s;
    }
    .ipc-resume-link:hover { color: #38bdf8; }

    .ipc-resume-empty {
        grid-column: 1 / -1; padding: 32px 20px;
        text-align: center; color: #334155; font-size: 13px;
    }

    /* ── Divider ── */
    .ipc-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 28px 0; }

    /* ── Actions ── */
    .ipc-actions { display: flex; align-items: center; gap: 10px; }
    .ipc-btn-submit {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 11px 28px; border-radius: 10px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        color: #fff; font-size: 14px; font-weight: 700;
        border: none; cursor: pointer; transition: all 0.18s;
        box-shadow: 0 4px 14px rgba(14,165,233,0.25);
        font-family: 'Inter', sans-serif;
    }
    .ipc-btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .ipc-btn-submit:disabled { opacity: 0.50; cursor: not-allowed; transform: none; }
    .ipc-btn-cancel {
        display: inline-flex; align-items: center;
        padding: 11px 22px; border-radius: 10px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
        color: #94a3b8; font-size: 14px; font-weight: 600;
        text-decoration: none; transition: all 0.18s;
    }
    .ipc-btn-cancel:hover { background: rgba(255,255,255,0.07); color: #cbd5e1; }

    /* ── Full-screen loader overlay ── */
    .ipc-overlay {
        position: fixed; inset: 0; z-index: 60;
        background: rgba(10,15,30,0.80);
        backdrop-filter: blur(6px);
        display: flex; flex-direction: column;
        align-items: center; justify-content: center; gap: 20px;
    }
    .ipc-overlay-card {
        background: #1e293b; border: 1px solid rgba(255,255,255,0.09);
        border-radius: 20px; padding: 36px 44px;
        display: flex; flex-direction: column; align-items: center; gap: 16px;
        box-shadow: 0 24px 60px rgba(0,0,0,0.5);
    }
    .ipc-spinner-ring {
        width: 52px; height: 52px; border-radius: 50%;
        border: 3px solid rgba(56,189,248,0.15);
        border-top-color: #38bdf8;
        animation: ipc-spin 0.8s linear infinite;
    }
    @keyframes ipc-spin { to { transform: rotate(360deg); } }
    .ipc-overlay-title { font-size: 15px; font-weight: 700; color: #e2e8f0; }
    .ipc-overlay-sub   { font-size: 13px; color: #6e7e95; }
`;

const TOAST_OPTS = {
    style: {
        background: '#1e293b', color: '#e2e8f0',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px', fontSize: '13px',
    },
    success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
    error:   { iconTheme: { primary: '#f87171', secondary: '#1e293b' } },
};

export default function Create({ jobs, resumes }) {
    const [selectedJob,    setSelectedJob]    = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const [loading,        setLoading]        = useState(false);

    const jobOptions = jobs.map(j => ({ value: j.id, label: j.title }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedJob)    { toast.error('Please select a job.');    return; }
        if (!selectedResume) { toast.error('Please select a resume.'); return; }

        setLoading(true);
        router.post('/interview-preps', { job_id: selectedJob.value, resume_id: selectedResume }, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setLoading(false);
                setSelectedJob(null);
                setSelectedResume(null);
            },
            onError: () => {
                setLoading(false);
                toast.error('Something went wrong. Please try again.');
            },
        });
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Create Interview Prep" />

            {/* Full-screen loading overlay */}
            {loading && (
                <div className="ipc-overlay">
                    <div className="ipc-overlay-card">
                        <div className="ipc-spinner-ring" />
                        <div className="ipc-overlay-title">Generating Interview Prep…</div>
                        <div className="ipc-overlay-sub">AI is crafting your questions & answers</div>
                    </div>
                </div>
            )}

            <div className="ipc-root">

                {/* Header */}
                <div className="ipc-header">
                    <div>
                        <div className="ipc-title">Create Interview Prep</div>
                        <div className="ipc-subtitle">Select a job and resume to generate AI-powered interview questions.</div>
                    </div>
                    <Link href="/interview-preps" className="ipc-back">
                        <ChevronLeftIcon style={{ width: 14, height: 14 }} />
                        Back
                    </Link>
                </div>

                <div className="ipc-card">
                    <form onSubmit={handleSubmit}>

                        {/* Job selector */}
                        <div className="ipc-field">
                            <label className="ipc-label">Select Job</label>
                            <div className="ipc-select">
                                <Select
                                    value={selectedJob}
                                    onChange={setSelectedJob}
                                    options={jobOptions}
                                    placeholder="Search and select a job…"
                                    classNamePrefix="react-select"
                                    isClearable
                                    isSearchable
                                />
                            </div>
                        </div>

                        {/* Resume grid */}
                        <div className="ipc-field" style={{ marginBottom: 0 }}>
                            <label className="ipc-label">
                                Select Resume
                                {selectedResume && (
                                    <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: '#38bdf8', background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.20)', padding: '2px 8px', borderRadius: 20 }}>
                                        1 selected
                                    </span>
                                )}
                            </label>

                            <div className="ipc-resume-grid-wrap">
                                {resumes.length > 0 ? (
                                    <div className="ipc-resume-grid">
                                        {resumes.map(resume => {
                                            const isActive = selectedResume === resume.id;
                                            return (
                                                <div
                                                    key={resume.id}
                                                    onClick={() => setSelectedResume(prev => prev === resume.id ? null : resume.id)}
                                                    className={`ipc-resume-card ${isActive ? 'ipc-resume-card-active' : ''}`}
                                                >
                                                    <div className="ipc-resume-card-top">
                                                        <div className="ipc-resume-icon">
                                                            <DocumentTextIcon style={{ width: 15, height: 15, color: '#818cf8' }} />
                                                        </div>
                                                        {isActive
                                                            ? <div className="ipc-resume-check"><CheckIcon style={{ width: 12, height: 12, color: '#38bdf8' }} /></div>
                                                            : <div className="" />
                                                        }
                                                    </div>
                                                    <div className="ipc-resume-name" title={resume.name}>{resume.name}</div>
                                                    {resume.file_url && (
                                                        <a
                                                            href={resume.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ipc-resume-link"
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            <ArrowTopRightOnSquareIcon style={{ width: 11, height: 11 }} />
                                                            View file
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="ipc-resume-empty">
                                        <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                                        No resumes found. <Link href="/resumes/create" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>Upload one</Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="ipc-divider" />

                        {/* Actions */}
                        <div className="ipc-actions">
                            <button type="submit" disabled={loading} className="ipc-btn-submit">
                                {loading
                                    ? 'Generating…'
                                    : <><PencilSquareIcon style={{ width: 15, height: 15 }} /> Generate Interview Prep</>
                                }
                            </button>
                            <Link href="/interview-preps" className="ipc-btn-cancel">Cancel</Link>
                        </div>

                    </form>
                </div>
            </div>
        </Layout>
    );
}