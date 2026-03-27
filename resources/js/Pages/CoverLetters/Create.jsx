import Layout from '../Dashboard/Components/Layout';
import { useForm, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Select from 'react-select';
import {
    ArrowLeftIcon, PlusIcon, DocumentTextIcon,
    CheckIcon, ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.clc-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Loading overlay ── */
.clc-loading {
    position:fixed; inset:0; z-index:50;
    background:rgba(0,0,0,0.55); backdrop-filter:blur(3px);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
}
.clc-spinner {
    width:52px; height:52px; border-radius:50%;
    border:4px solid rgba(255,255,255,0.10);
    border-top-color:#38bdf8;
    animation:clc-spin 0.9s linear infinite;
}
@keyframes clc-spin { to { transform:rotate(360deg); } }
.clc-spinner-label { font-size:13px; color:#94a3b8; font-weight:500; }

/* ── Header ── */
.clc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
.clc-title    { font-size:22px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; }
.clc-subtitle { font-size:13px; color:#6e7e95; margin-top:3px; }

/* ── Card ── */
.clc-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:28px;
}

/* ── Section label ── */
.clc-label {
    display:block; font-size:12px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.7px; margin-bottom:10px;
}

/* ── Field spacing ── */
.clc-field { margin-bottom:24px; }

/* ── react-select dark theme ── */
.clc-select .react-select__control {
    background:#0f172a; border:1px solid rgba(255,255,255,0.10);
    border-radius:10px; box-shadow:none; min-height:42px;
    font-size:13px; font-family:'Inter',sans-serif;
}
.clc-select .react-select__control:hover { border-color:rgba(56,189,248,0.35); }
.clc-select .react-select__control--is-focused {
    border-color:rgba(56,189,248,0.35) !important;
    box-shadow:0 0 0 3px rgba(56,189,248,0.08) !important;
}
.clc-select .react-select__placeholder { color:#6e7e95; }
.clc-select .react-select__single-value { color:#e2e8f0; }
.clc-select .react-select__input-container { color:#e2e8f0; }
.clc-select .react-select__menu {
    background:#1e293b; border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; overflow:hidden; font-size:13px;
}
.clc-select .react-select__option { background:transparent; color:#94a3b8; padding:9px 14px; cursor:pointer; }
.clc-select .react-select__option:hover,
.clc-select .react-select__option--is-focused  { background:rgba(56,189,248,0.08); color:#e2e8f0; }
.clc-select .react-select__option--is-selected  { background:rgba(56,189,248,0.15); color:#38bdf8; }
.clc-select .react-select__indicator-separator  { background:rgba(255,255,255,0.08); }
.clc-select .react-select__dropdown-indicator,
.clc-select .react-select__clear-indicator { color:#6e7e95; }
.clc-select .react-select__dropdown-indicator:hover,
.clc-select .react-select__clear-indicator:hover { color:#94a3b8; }

/* ── Resume grid (Interview Prep style) ── */
.clc-resume-grid-wrap {
    border:1px solid rgba(255,255,255,0.07);
    border-radius:12px; max-height:300px; overflow-y:auto;
    padding:12px; background:rgba(0,0,0,0.15);
}
.clc-resume-grid-wrap::-webkit-scrollbar { width:4px; }
.clc-resume-grid-wrap::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:10px; }

.clc-resume-grid {
    display:grid; grid-template-columns:repeat(3,1fr); gap:10px;
}
@media(max-width:900px){ .clc-resume-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:540px){ .clc-resume-grid { grid-template-columns:1fr; } }

.clc-resume-card {
    background:#1a2640; border:1px solid rgba(255,255,255,0.07);
    border-radius:12px; padding:14px;
    cursor:pointer; transition:all 0.18s;
    display:flex; flex-direction:column; gap:8px; position:relative;
}
.clc-resume-card:hover { border-color:rgba(255,255,255,0.14); background:rgba(255,255,255,0.04); }
.clc-resume-card-active {
    border-color:rgba(56,189,248,0.45) !important;
    background:rgba(56,189,248,0.07) !important;
    box-shadow:0 0 0 3px rgba(56,189,248,0.07);
}
.clc-resume-card-top {
    display:flex; align-items:center; justify-content:space-between;
}
.clc-resume-icon {
    width:28px; height:28px; border-radius:8px;
    background:rgba(129,140,248,0.12); border:1px solid rgba(129,140,248,0.20);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.clc-resume-check {
    width:20px; height:20px; border-radius:6px;
    background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.35);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.clc-resume-placeholder { width:20px; height:20px; }
.clc-resume-name {
    font-size:13px; font-weight:600; color:#e2e8f0; line-height:1.4;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.clc-resume-link {
    display:inline-flex; align-items:center; gap:4px;
    font-size:11px; color:#38bdf8; text-decoration:none; font-weight:500;
    transition:color 0.15s;
}
.clc-resume-link:hover { color:#7dd3fc; }
.clc-resume-empty {
    color:#6e7e95; font-size:13px; text-align:center; padding:32px 0;
}

/* ── Company name input ── */
.clc-input {
    width:100%; padding:10px 14px;
    background:#0f172a; border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; color:#e2e8f0; font-size:13px;
    font-family:'Inter',sans-serif; outline:none; transition:all 0.18s;
}
.clc-input:focus {
    border-color:rgba(56,189,248,0.40);
    box-shadow:0 0 0 3px rgba(56,189,248,0.08);
}
.clc-input::placeholder { color:#6e7e95; }
.clc-input-error {
    border-color:rgba(248,113,113,0.50) !important;
    box-shadow:0 0 0 3px rgba(248,113,113,0.08) !important;
}
.clc-error { font-size:12px; color:#f87171; margin-top:5px; }

/* ── Template grid ── */
.clc-template-grid {
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:16px;
}
@media(max-width:900px){ .clc-template-grid { grid-template-columns:repeat(3,1fr); } }
@media(max-width:640px){ .clc-template-grid { grid-template-columns:repeat(2,1fr); } }

.clc-template-card {
    cursor:pointer; border-radius:12px; border:2px solid rgba(255,255,255,0.08);
    overflow:hidden; transition:all 0.20s;
}
.clc-template-card:hover {
    transform:scale(1.03);
    box-shadow:0 8px 24px rgba(0,0,0,0.35);
    border-color:rgba(255,255,255,0.18);
}
.clc-template-card-active {
    border-color:#3b82f6 !important;
    box-shadow:0 0 0 3px rgba(59,130,246,0.25), 0 8px 24px rgba(0,0,0,0.35) !important;
}
.clc-template-img-wrap {
    display:flex; align-items:center; justify-content:center;
    background:#0f172a; padding:12px; position:relative;
}
.clc-template-img {
    width:100%; object-fit:contain; border-radius:6px;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    aspect-ratio:3/4;
}
.clc-template-overlay {
    position:absolute; inset:0;
    background:rgba(59,130,246,0.50);
    display:flex; align-items:center; justify-content:center;
    pointer-events:none; transition:all 0.3s;
}
.clc-template-info {
    padding:10px 12px; text-align:center;
    background:#1e293b; border-top:1px solid rgba(255,255,255,0.06);
}
.clc-template-name {
    font-size:12px; font-weight:600; color:#e2e8f0;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.clc-template-empty { font-size:13px; color:#6e7e95; }

/* ── Divider ── */
.clc-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:24px 0; }

/* ── Actions ── */
.clc-actions { display:flex; align-items:center; gap:10px; }
.clc-btn-submit {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 22px; border-radius:10px;
    background:linear-gradient(135deg,#0ea5e9,#6366f1);
    color:#fff; font-size:13px; font-weight:700;
    border:none; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(14,165,233,0.25);
    font-family:'Inter',sans-serif;
}
.clc-btn-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
.clc-btn-submit:disabled { opacity:0.50; cursor:not-allowed; transform:none; }
.clc-btn-cancel {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 18px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#94a3b8; font-size:13px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.clc-btn-cancel:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }
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

export default function Create({ jobs, resumes, templates }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        job_id: '',
        resume_id: '',
        template_id: templates && templates.length > 0 ? templates[0].id : null,
    });

    const [selectedJob,    setSelectedJob]    = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const [loading,        setLoading]        = useState(false);

    /* ── unchanged logic ── */
    const jobOptions = jobs.map(job => ({ value: job.id, label: job.title }));

    const handleChange = (selectedOption) => setSelectedJob(selectedOption);

    const handleResumeSelect = (id) => {
        setSelectedResume(prev => (prev === id ? null : id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedJob)                          { toast.error('Please select a job.');       return; }
        if (!selectedResume)                       { toast.error('Please select a resume.');    return; }
        if (!data.name || data.name.trim() === '') { toast.error('Please add company name.');   return; }
        if (data.template_id == null)              { toast.error('Please select a template.');  return; }

        setLoading(true);
        router.post('/cover-letters', {
            job_id:       selectedJob.value,
            resume_id:    selectedResume,
            company_name: data.name,
            template_id:  data.template_id,
        }, {
            preserveScroll: false,
            onSuccess: () => router.get('/cover-letters'),
            onError:   () => setLoading(false),
        });
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Create Cover Letter" />

            {/* ── Loading overlay ── */}
            {loading && (
                <div className="clc-loading">
                    <div className="clc-spinner" />
                    <span className="clc-spinner-label">Generating your cover letter…</span>
                </div>
            )}

            <div className="clc-root">

                {/* ── Header ── */}
                <div className="clc-header">
                    <div>
                        <div className="clc-title">Create Cover Letter</div>
                        <div className="clc-subtitle">Select a job, resume, and template to generate your cover letter.</div>
                    </div>
                    <Link href="/cover-letters" className="clc-btn-cancel">
                        <ArrowLeftIcon style={{ width: 14, height: 14 }} />
                        Back
                    </Link>
                </div>

                <div className="clc-card">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">

                        {/* ── Job Selection ── */}
                        <div className="clc-field">
                            <span className="clc-label">Select Job</span>
                            <div className="clc-select">
                                <Select
                                    value={selectedJob}
                                    onChange={handleChange}
                                    options={jobOptions}
                                    placeholder="Search and select a job…"
                                    classNamePrefix="react-select"
                                    isClearable
                                    isSearchable
                                />
                            </div>
                        </div>

                        {/* ── Resume Selection (Interview Prep card style) ── */}
                        <div className="clc-field">
                            <span className="clc-label">Select Resume</span>
                            <div className="clc-resume-grid-wrap">
                                {resumes.length > 0 ? (
                                    <div className="clc-resume-grid">
                                        {resumes.map(resume => {
                                            const isActive = selectedResume === resume.id;
                                            return (
                                                <div
                                                    key={resume.id}
                                                    onClick={() => handleResumeSelect(resume.id)}
                                                    className={`clc-resume-card${isActive ? ' clc-resume-card-active' : ''}`}
                                                >
                                                    {/* Top: icon + check */}
                                                    <div className="clc-resume-card-top">
                                                        <div className="clc-resume-icon">
                                                            <DocumentTextIcon style={{ width: 15, height: 15, color: '#818cf8' }} />
                                                        </div>
                                                        {isActive
                                                            ? <div className="clc-resume-check"><CheckIcon style={{ width: 12, height: 12, color: '#38bdf8' }} /></div>
                                                            : <div className="clc-resume-placeholder" />
                                                        }
                                                    </div>
                                                    {/* Name */}
                                                    <div className="clc-resume-name" title={resume.name}>{resume.name}</div>
                                                    {/* View link */}
                                                    {resume.file_url && (
                                                        <a
                                                            href={resume.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="clc-resume-link"
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
                                    <div className="clc-resume-empty">
                                        <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                                        No resumes found.{' '}
                                        <Link href="/resumes/create" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
                                            Upload one
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Company Name ── */}
                        <div className="clc-field">
                            <span className="clc-label">Company Name</span>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. Google, Anthropic, Stripe…"
                                className={`clc-input${errors.name ? ' clc-input-error' : ''}`}
                            />
                            {errors.name && <div className="clc-error">{errors.name}</div>}
                        </div>

                        {/* ── Template Selection ── */}
                        <div className="clc-field">
                            <span className="clc-label">Choose Template</span>
                            {(!templates || templates.length === 0) ? (
                                <div className="clc-template-empty">No templates available.</div>
                            ) : (
                                <div className="clc-template-grid">
                                    {templates.map(tpl => (
                                        <div
                                            key={tpl.id}
                                            onClick={() => setData('template_id', tpl.id)}
                                            className={`clc-template-card${data.template_id === tpl.id ? ' clc-template-card-active' : ''}`}
                                        >
                                            {/* Image + overlay */}
                                            <div className="clc-template-img-wrap">
                                                <img
                                                    src={tpl.preview}
                                                    alt={tpl.name}
                                                    className="clc-template-img"
                                                />
                                                {data.template_id === tpl.id && (
                                                    <div className="clc-template-overlay">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            style={{ width: 40, height: 40, color: '#fff' }}
                                                            fill="none" viewBox="0 0 24 24"
                                                            stroke="currentColor" strokeWidth={2}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Name */}
                                            <div className="clc-template-info">
                                                <div className="clc-template-name">{tpl.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr className="clc-divider" />

                        {/* ── Actions ── */}
                        <div className="clc-actions">
                            <button
                                type="submit"
                                className="clc-btn-submit"
                                disabled={processing}
                            >
                                <PlusIcon style={{ width: 14, height: 14 }} />
                                {processing ? 'Creating…' : 'Create Cover Letter'}
                            </button>
                            <Link href="/cover-letters" className="clc-btn-cancel">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}