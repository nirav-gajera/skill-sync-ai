import Layout from '../Dashboard/Components/Layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftIcon, ClipboardDocumentListIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/* ── Unchanged constants ── */
const timeLimitOptions = [
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 20, label: '20 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' },
];
const questionCountOptions = [5, 8, 10, 12, 15, 20];

const featureList = [
    'AI-generated MCQs based on the selected resume and JD',
    'Countdown timer with enforced duration',
    'Question navigation and progress tracking',
    'Submission review with score, answers, and correctness',
    'Persistent history on the exam listing page',
];

/* ─────────────────────────────────────────────
   Styles  (oec- prefix = online exam create)
───────────────────────────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.oec-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Loading overlay ── */
.oec-loading {
    position:fixed; inset:0; z-index:50;
    background:rgba(0,0,0,0.55); backdrop-filter:blur(3px);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
}
.oec-spinner {
    width:52px; height:52px; border-radius:50%;
    border:4px solid rgba(255,255,255,0.10);
    border-top-color:#38bdf8;
    animation:oec-spin 0.9s linear infinite;
}
@keyframes oec-spin { to { transform:rotate(360deg); } }
.oec-spinner-label { font-size:13px; color:#94a3b8; font-weight:500; }

/* ── Hero banner ── */
.oec-hero {
    border-radius:16px; overflow:hidden; margin-bottom:20px;
    background:linear-gradient(135deg,#0f2744 0%,#0f172a 50%,#0c2340 100%);
    border:1px solid rgba(56,189,248,0.15);
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
}
.oec-hero-inner {
    display:grid; gap:24px; padding:32px;
    grid-template-columns:1.2fr 0.8fr;
}
@media(max-width:900px){ .oec-hero-inner { grid-template-columns:1fr; } }

.oec-hero-badge {
    display:inline-flex; align-items:center; gap:7px;
    padding:4px 12px; border-radius:20px;
    background:rgba(56,189,248,0.10); border:1px solid rgba(56,189,248,0.25);
    color:#7dd3fc; font-size:10px; font-weight:700;
    text-transform:uppercase; letter-spacing:0.3em; margin-bottom:14px;
}
.oec-hero-title {
    font-size:24px; font-weight:800; color:#f1f5f9;
    line-height:1.35; letter-spacing:-0.5px; max-width:560px; margin-bottom:10px;
}
.oec-hero-desc {
    font-size:13px; color:#7b94b7; line-height:1.7; max-width:520px;
}

/* hero right stats box */
.oec-stats-box {
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    border-radius:14px; padding:22px; backdrop-filter:blur(8px);
    display:flex; flex-direction:column; gap:16px;
}
.oec-stat-val   { font-size:30px; font-weight:800; color:#f1f5f9; line-height:1; }
.oec-stat-label { font-size:12px; color:#7b94b7; margin-top:4px; }
.oec-stat-note  { font-size:12px; color:#6e7e95; line-height:1.6; }

/* ── Two-col layout ── */
.oec-two-col {
    display:grid; gap:20px;
    grid-template-columns:1.2fr 0.8fr;
}
@media(max-width:900px){ .oec-two-col { grid-template-columns:1fr; } }

/* ── Shared card ── */
.oec-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:28px;
}

/* ── Form headings ── */
.oec-form-title    { font-size:18px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.oec-form-subtitle { font-size:12px; color:#6e7e95; margin-bottom:24px; }

/* ── Form fields ── */
.oec-field { margin-bottom:18px; }
.oec-label {
    display:block; font-size:12px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.7px; margin-bottom:8px;
}
.oec-select, .oec-textarea {
    width:100%; padding:10px 14px;
    background:#0f172a; border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; color:#e2e8f0; font-size:13px;
    font-family:'Inter',sans-serif; outline:none; transition:all 0.18s;
    appearance:none; -webkit-appearance:none;
}
.oec-select:focus, .oec-textarea:focus {
    border-color:rgba(56,189,248,0.40);
    box-shadow:0 0 0 3px rgba(56,189,248,0.08);
}
.oec-select option { background:#1e293b; color:#e2e8f0; }
.oec-textarea {
    resize:vertical; min-height:100px; line-height:1.6;
}
.oec-textarea::placeholder { color:#6e7e95; }
.oec-error { font-size:12px; color:#f87171; margin-top:5px; }

/* grid for 2 selects side by side */
.oec-two-fields { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:600px){ .oec-two-fields { grid-template-columns:1fr; } }

/* ── Form actions ── */
.oec-actions { display:flex; flex-wrap:wrap; align-items:center; gap:10px; padding-top:8px; }
.oec-btn-submit {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 22px; border-radius:10px;
    background:linear-gradient(135deg,#0ea5e9,#6366f1);
    color:#fff; font-size:13px; font-weight:700;
    border:none; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(14,165,233,0.25);
    font-family:'Inter',sans-serif;
}
.oec-btn-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
.oec-btn-submit:disabled { opacity:0.50; cursor:not-allowed; transform:none; }
.oec-btn-back {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 18px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#94a3b8; font-size:13px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.oec-btn-back:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }

/* ── Aside ── */
.oec-aside-title    { font-size:16px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.oec-aside-subtitle { font-size:12px; color:#6e7e95; margin-bottom:18px; }

.oec-feature-list { display:flex; flex-direction:column; gap:10px; margin-bottom:18px; }
.oec-feature-item {
    display:flex; align-items:flex-start; gap:10px;
    background:#0f172a; border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:12px 14px;
    font-size:13px; color:#94a3b8; line-height:1.5;
}
.oec-feature-icon { color:#34d399; flex-shrink:0; margin-top:1px; }

.oec-warning-box {
    background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.20);
    border-radius:12px; padding:14px 16px;
    font-size:13px; color:#fbbf24; line-height:1.7;
}
`;

export default function Create({ jobs, resumes }) {
    const { data, setData, post, processing, errors } = useForm({
        job_id: '',
        resume_id: '',
        focus: '',
        time_limit_minutes: 20,
        question_count: 10,
    });

    const [loading, setLoading] = useState(false);

    /* ── unchanged logic ── */
    const canStartExam = jobs.length > 0 && resumes.length > 0;

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        post('/online-exams', {
            preserveScroll: true,
            onSuccess: () => setLoading(false),
            onError:   () => setLoading(false),
        });
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Head title="Take Exam" />

            {/* ── Loading overlay ── */}
            {loading && (
                <div className="oec-loading">
                    <div className="oec-spinner" />
                    <span className="oec-spinner-label">Generating your exam…</span>
                </div>
            )}

            <div className="oec-root">

                {/* ── Hero banner ── */}
                <div className="oec-hero">
                    <div className="oec-hero-inner">
                        <div>
                            <div className="oec-hero-badge">
                                <ClipboardDocumentListIcon style={{ width: 12, height: 12 }} />
                                Real-time Examination
                            </div>
                            <div className="oec-hero-title">
                                Start an AI-generated MCQ exam from a resume and job description.
                            </div>
                            <div className="oec-hero-desc">
                                Choose one resume, choose one job description, set the exam duration, and generate a timed screening test tailored to that profile.
                            </div>
                        </div>

                        {/* right stats box */}
                        <div className="oec-stats-box">
                            <div>
                                <div className="oec-stat-val">{jobs.length}</div>
                                <div className="oec-stat-label">job descriptions available</div>
                            </div>
                            <div>
                                <div className="oec-stat-val">{resumes.length}</div>
                                <div className="oec-stat-label">resumes ready to use</div>
                            </div>
                            <div className="oec-stat-note">
                                The exam is locked to the selected resume and JD, then stored for review in the exam history.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Form + Aside ── */}
                <div className="oec-two-col">

                    {/* ── Exam Setup form ── */}
                    <div className="oec-card">
                        <div className="oec-form-title">Exam Setup</div>
                        <div className="oec-form-subtitle">Both selections are required before the exam can start.</div>

                        <form onSubmit={handleSubmit}>

                            {/* Job Description */}
                            <div className="oec-field">
                                <label htmlFor="job_id" className="oec-label">Job Description</label>
                                <select
                                    id="job_id"
                                    className="oec-select"
                                    value={data.job_id}
                                    onChange={e => setData('job_id', e.target.value)}
                                >
                                    <option value="">Select job description</option>
                                    {jobs.map(job => (
                                        <option key={job.id} value={job.id}>{job.title}</option>
                                    ))}
                                </select>
                                {errors.job_id && <div className="oec-error">{errors.job_id}</div>}
                            </div>

                            {/* Resume */}
                            <div className="oec-field">
                                <label htmlFor="resume_id" className="oec-label">Resume</label>
                                <select
                                    id="resume_id"
                                    className="oec-select"
                                    value={data.resume_id}
                                    onChange={e => setData('resume_id', e.target.value)}
                                >
                                    <option value="">Select resume</option>
                                    {resumes.map(resume => (
                                        <option key={resume.id} value={resume.id}>{resume.name}</option>
                                    ))}
                                </select>
                                {errors.resume_id && <div className="oec-error">{errors.resume_id}</div>}
                            </div>

                            {/* Time Limit + Question Count side by side */}
                            <div className="oec-two-fields" style={{ marginBottom: 18 }}>
                                <div>
                                    <label htmlFor="time_limit_minutes" className="oec-label">Time Limit</label>
                                    <select
                                        id="time_limit_minutes"
                                        className="oec-select"
                                        value={data.time_limit_minutes}
                                        onChange={e => setData('time_limit_minutes', Number(e.target.value))}
                                    >
                                        {timeLimitOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {errors.time_limit_minutes && <div className="oec-error">{errors.time_limit_minutes}</div>}
                                </div>
                                <div>
                                    <label htmlFor="question_count" className="oec-label">Number of MCQs</label>
                                    <select
                                        id="question_count"
                                        className="oec-select"
                                        value={data.question_count}
                                        onChange={e => setData('question_count', Number(e.target.value))}
                                    >
                                        {questionCountOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt} questions</option>
                                        ))}
                                    </select>
                                    {errors.question_count && <div className="oec-error">{errors.question_count}</div>}
                                </div>
                            </div>

                            {/* Focus Area */}
                            <div className="oec-field">
                                <label htmlFor="focus" className="oec-label">Focus Area <span style={{ color:'#475569', textTransform:'none', letterSpacing:0 }}>(optional)</span></label>
                                <textarea
                                    id="focus"
                                    className="oec-textarea"
                                    value={data.focus}
                                    onChange={e => setData('focus', e.target.value)}
                                    rows={4}
                                    placeholder="Optional: emphasize frontend, debugging, leadership, product thinking, or any custom topic."
                                />
                                {errors.focus && <div className="oec-error">{errors.focus}</div>}
                            </div>

                            {/* Actions */}
                            <div className="oec-actions">
                                <button
                                    type="submit"
                                    className="oec-btn-submit"
                                    disabled={processing || !canStartExam}
                                >
                                    <ClipboardDocumentListIcon style={{ width: 15, height: 15 }} />
                                    {processing ? 'Generating exam…' : 'Start Exam'}
                                </button>
                                <Link href="/online-exams" className="oec-btn-back">
                                    <ArrowLeftIcon style={{ width: 14, height: 14 }} />
                                    Back to History
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* ── Aside: What the exam includes ── */}
                    <div className="oec-card">
                        <div className="oec-aside-title">What the exam includes</div>
                        <div className="oec-aside-subtitle">
                            The generated exam is optimized for quick candidate screening and review.
                        </div>

                        <div className="oec-feature-list">
                            {featureList.map(item => (
                                <div key={item} className="oec-feature-item">
                                    <CheckCircleIcon className="oec-feature-icon" style={{ width: 15, height: 15 }} />
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* Warning if no jobs or resumes */}
                        {!canStartExam && (
                            <div className="oec-warning-box">
                                Upload at least one resume and create at least one job description before starting an exam.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}