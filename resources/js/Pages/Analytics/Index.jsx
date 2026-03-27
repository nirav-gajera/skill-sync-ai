import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { usePage, router } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import Layout from '../Dashboard/Components/Layout';
import {
    EyeIcon, CheckIcon, TrashIcon, XMarkIcon,
    ArrowDownTrayIcon, MagnifyingGlassIcon,
    DocumentTextIcon, ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Select from 'react-select';

/* ─────────────────────────────────────────────
   Styles  (ai- prefix = analytics index)
───────────────────────────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.ai-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Header ── */
.ai-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
.ai-title    { font-size:22px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; }
.ai-subtitle { font-size:13px; color:#6e7e95; margin-top:3px; }

/* ── Cards / panels ── */
.ai-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:24px; margin-bottom:20px;
}

/* ── Section label ── */
.ai-label {
    display:block; font-size:12px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.8px; margin-bottom:10px;
}

/* ── react-select dark theme ── */
.ai-select .react-select__control {
    background:#0f172a; border:1px solid rgba(255,255,255,0.10);
    border-radius:10px; box-shadow:none; min-height:40px;
    font-size:13px; font-family:'Inter',sans-serif;
}
.ai-select .react-select__control:hover { border-color:rgba(56,189,248,0.35); }
.ai-select .react-select__control--is-focused {
    border-color:rgba(56,189,248,0.35) !important;
    box-shadow:0 0 0 3px rgba(56,189,248,0.08) !important;
}
.ai-select .react-select__placeholder { color:#6e7e95; }
.ai-select .react-select__single-value { color:#e2e8f0; }
.ai-select .react-select__input-container { color:#e2e8f0; }
.ai-select .react-select__menu {
    background:#1e293b; border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; overflow:hidden; font-size:13px;
}
.ai-select .react-select__option { background:transparent; color:#94a3b8; padding:9px 14px; cursor:pointer; }
.ai-select .react-select__option:hover,
.ai-select .react-select__option--is-focused  { background:rgba(56,189,248,0.08); color:#e2e8f0; }
.ai-select .react-select__option--is-selected  { background:rgba(56,189,248,0.15); color:#38bdf8; }
.ai-select .react-select__indicator-separator  { background:rgba(255,255,255,0.08); }
.ai-select .react-select__dropdown-indicator,
.ai-select .react-select__clear-indicator { color:#6e7e95; }
.ai-select .react-select__dropdown-indicator:hover,
.ai-select .react-select__clear-indicator:hover { color:#94a3b8; }

/* ── Resume grid ── */
.ai-resume-grid-wrap {
    border:1px solid rgba(255,255,255,0.07);
    border-radius:12px; max-height:300px; overflow-y:auto;
    padding:12px; background:rgba(0,0,0,0.15);
}
.ai-resume-grid-wrap::-webkit-scrollbar { width:4px; }
.ai-resume-grid-wrap::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:10px; }

.ai-resume-grid {
    display:grid; grid-template-columns:repeat(3,1fr); gap:10px;
}
@media(max-width:900px){ .ai-resume-grid { grid-template-columns:repeat(2,1fr); } }
@media(max-width:540px){ .ai-resume-grid { grid-template-columns:1fr; } }

.ai-resume-card {
    background:#1a2640; border:1px solid rgba(255,255,255,0.07);
    border-radius:12px; padding:14px;
    cursor:pointer; transition:all 0.18s;
    display:flex; flex-direction:column; gap:8px; position:relative;
}
.ai-resume-card:hover { border-color:rgba(255,255,255,0.14); background:rgba(255,255,255,0.04); }
.ai-resume-card.selected {
    border-color:rgba(56,189,248,0.45) !important;
    background:rgba(56,189,248,0.07) !important;
    box-shadow:0 0 0 3px rgba(56,189,248,0.07);
}

.ai-resume-card-top {
    display:flex; align-items:center; justify-content:space-between;
}
.ai-resume-icon {
    width:28px; height:28px; border-radius:8px;
    background:rgba(129,140,248,0.12); border:1px solid rgba(129,140,248,0.20);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.ai-resume-check {
    width:20px; height:20px; border-radius:6px;
    background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.35);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.ai-resume-placeholder { width:20px; height:20px; }
.ai-resume-name {
    font-size:13px; font-weight:600; color:#e2e8f0; line-height:1.4;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.ai-resume-link {
    display:inline-flex; align-items:center; gap:4px;
    font-size:11px; color:#38bdf8; text-decoration:none; font-weight:500;
    transition:color 0.15s;
}
.ai-resume-link:hover { color:#7dd3fc; }
.ai-resume-empty {
    color:#6e7e95; font-size:13px; text-align:center;
    padding:32px 0; grid-column:1/-1;
}

/* ── Scan button ── */
.ai-btn-scan {
    display:inline-flex; align-items:center; gap:8px;
    padding:10px 22px; border-radius:10px;
    background:linear-gradient(135deg,#0ea5e9,#6366f1);
    color:#fff; font-size:13px; font-weight:700;
    border:none; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(14,165,233,0.25);
}
.ai-btn-scan:hover { opacity:0.9; transform:translateY(-1px); }
.ai-btn-scan:disabled { opacity:0.55; cursor:not-allowed; transform:none; }

/* ── Scan History table ── */
.ai-table-wrap {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; overflow:hidden; overflow-x:auto;
    box-shadow:0 8px 24px rgba(0,0,0,0.25);
}
.ai-table { width:100%; border-collapse:collapse; min-width:860px; }
.ai-table thead { background:rgba(255,255,255,0.025); }
.ai-table th {
    padding:12px 14px; text-align:left;
    font-size:11px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.8px;
    border-bottom:1px solid rgba(255,255,255,0.05); white-space:nowrap;
}
.ai-table td {
    padding:12px 14px; font-size:13px; color:#94a3b8;
    border-bottom:1px solid rgba(255,255,255,0.04); white-space:nowrap;
}
.ai-table tbody tr:last-child td { border-bottom:none; }
.ai-table tbody tr:hover td { background:rgba(255,255,255,0.025); }
.ai-table td.ai-td-name { color:#e2e8f0; font-weight:500; white-space:normal; }
.ai-table td.ai-td-link a {
    color:#38bdf8; text-decoration:none; font-size:13px; transition:color 0.15s;
}
.ai-table td.ai-td-link a:hover { color:#7dd3fc; }

/* ── Score badges ── */
.ai-score {
    display:inline-flex; align-items:center;
    padding:3px 9px; border-radius:20px; font-size:12px; font-weight:600;
}
.ai-score-blue   { background:rgba(56,189,248,0.10);  color:#38bdf8; }
.ai-score-green  { background:rgba(52,211,153,0.10);  color:#34d399; }
.ai-score-purple { background:rgba(139,92,246,0.10);  color:#a78bfa; }
.ai-score-orange { background:rgba(251,146,60,0.10);  color:#fb923c; }
.ai-score-red    { background:rgba(248,113,113,0.10); color:#f87171; }

/* ── Action buttons ── */
.ai-actions { display:flex; align-items:center; gap:6px; }
.ai-action-btn {
    width:30px; height:30px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    border:1px solid transparent; cursor:pointer;
    background:none; transition:all 0.16s; text-decoration:none; flex-shrink:0;
}
.ai-action-view     { color:#38bdf8; background:rgba(56,189,248,0.08);  border-color:rgba(56,189,248,0.15); }
.ai-action-del      { color:#f87171; background:rgba(248,113,113,0.08); border-color:rgba(248,113,113,0.15); }
.ai-action-download { color:#34d399; background:rgba(52,211,153,0.08);  border-color:rgba(52,211,153,0.15); }
.ai-action-view:hover     { background:rgba(56,189,248,0.18); }
.ai-action-del:hover      { background:rgba(248,113,113,0.18); }
.ai-action-download:hover { background:rgba(52,211,153,0.18); }
.ai-action-btn:disabled   { opacity:0.4; cursor:not-allowed; }

/* ── Pagination ── */
.ai-pagination-row {
    display:flex; align-items:center; justify-content:space-between;
    margin-top:18px; flex-wrap:wrap; gap:12px;
}
.ai-per-page { display:flex; align-items:center; gap:8px; font-size:13px; color:#7b94b7; }
.ai-per-page-select {
    background:#1e293b; border:1px solid rgba(255,255,255,0.08);
    color:#94a3b8; border-radius:8px; padding:5px 10px; font-size:13px;
    font-family:'Inter',sans-serif; outline:none; cursor:pointer;
}
.ai-per-page-select:focus { border-color:rgba(56,189,248,0.30); }
.ai-per-page-total { color:#6e7e95; }
.ai-links { display:flex; gap:4px; flex-wrap:wrap; }
.ai-page-btn {
    padding:6px 12px; border-radius:8px; font-size:12px; font-weight:600;
    border:1px solid rgba(255,255,255,0.07);
    background:#1e293b; color:#7b94b7;
    text-decoration:none; cursor:pointer; transition:all 0.16s;
    white-space:nowrap; display:inline-block;
}
.ai-page-btn:hover { background:rgba(255,255,255,0.05); color:#94a3b8; }
.ai-page-btn-active   { background:rgba(14,165,233,0.12) !important; color:#38bdf8 !important; border-color:rgba(14,165,233,0.25) !important; }
.ai-page-btn-disabled { opacity:0.35; pointer-events:none; }

/* ── Delete Modal ── */
.ai-modal-backdrop {
    position:fixed; inset:0; z-index:60;
    background:rgba(0,0,0,0.60); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center;
}
.ai-modal {
    position:relative; z-index:61;
    background:#1e293b; border:1px solid rgba(255,255,255,0.09);
    border-radius:18px; padding:32px 28px;
    width:500px; max-width:90vw;
    box-shadow:0 24px 60px rgba(0,0,0,0.5);
    font-family:'Inter',sans-serif;
}
.ai-modal-close {
    position:absolute; top:14px; right:14px;
    width:28px; height:28px; border-radius:7px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
    color:#7b94b7; cursor:pointer;
    display:flex; align-items:center; justify-content:center; transition:all 0.18s;
}
.ai-modal-close:hover { background:rgba(255,255,255,0.09); color:#94a3b8; }
.ai-modal-icon {
    width:48px; height:48px; border-radius:14px;
    background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.22);
    display:flex; align-items:center; justify-content:center; margin-bottom:16px;
}
.ai-modal-title { font-size:17px; font-weight:700; color:#f1f5f9; margin-bottom:8px; }
.ai-modal-desc  { font-size:14px; color:#7b94b7; line-height:1.6; margin-bottom:24px; }
.ai-modal-actions { display:flex; gap:10px; justify-content:flex-end; }
.ai-modal-cancel {
    padding:9px 20px; border-radius:9px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#64748b; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
    font-family:'Inter',sans-serif;
}
.ai-modal-cancel:hover { background:rgba(255,255,255,0.08); color:#94a3b8; }
.ai-modal-delete {
    padding:9px 20px; border-radius:9px;
    background:linear-gradient(135deg,#dc2626,#b91c1c); border:none;
    color:#fff; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(220,38,38,0.30); font-family:'Inter',sans-serif;
}
.ai-modal-delete:hover { opacity:0.9; transform:translateY(-1px); }

/* ── Full-screen loading overlay ── */
.ai-loading-overlay {
    position:fixed; inset:0; z-index:50;
    background:rgba(0,0,0,0.55); backdrop-filter:blur(3px);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
}
.ai-spinner {
    width:52px; height:52px; border-radius:50%;
    border:4px solid rgba(255,255,255,0.10);
    border-top-color:#38bdf8;
    animation:ai-spin 0.9s linear infinite;
}
.ai-spinner-label { font-size:13px; color:#94a3b8; font-weight:500; }
@keyframes ai-spin { to { transform:rotate(360deg); } }

/* ── Section title inside history card ── */
.ai-section-title { font-size:15px; font-weight:700; color:#f1f5f9; margin-bottom:16px; }
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

/* helper: score → badge class */
const scoreBadge = (val, type = 'blue') => {
    const map = { blue:'ai-score-blue', green:'ai-score-green', purple:'ai-score-purple', orange:'ai-score-orange', red:'ai-score-red' };
    return `ai-score ${map[type] || 'ai-score-blue'}`;
};

export default function Analytics({ jobs, resumes, matchedHistory: initialHistory, pagination }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [selectedJob,     setSelectedJob]     = useState('');
    const [selectedResumes, setSelectedResumes] = useState([]);
    const [matchedHistory,  setMatchedHistory]  = useState(initialHistory || []);
    const [loading,         setLoading]         = useState(false);
    const [isModalOpen,     setIsModalOpen]     = useState(false);
    const [matchToDelete,   setMatchToDelete]   = useState(null);
    const [downloading,     setDownloading]     = useState(null);
    const [perPage,         setPerPage]         = useState(pagination.per_page || 10);
    const [currentPage,     setCurrentPage]     = useState(pagination.current_page || 1);

    /* flash toasts */
    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error)   toast.error(flash.error);
    }, [flash]);

    /* body scroll lock */
    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isModalOpen]);

    /* scroll to history table */
    const scrollToMatchedHistory = () => {
        const el = document.querySelector('.ai-history-anchor');
        if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    };

    /* per-page change */
    const handlePerPageChange = (e) => {
        const newPerPage = e.target.value;
        setPerPage(newPerPage);
        setCurrentPage(1);
        router.get(location.pathname, { per_page: newPerPage, page: 1 });
        setTimeout(scrollToMatchedHistory, 300);
    };

    /* job select options */
    const jobOptions = jobs.map(job => ({ value: job.id, label: job.title }));

    /* resume toggle */
    const handleResumeSelect = (id) => {
        setSelectedResumes(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    /* delete flow */
    const confirmDelete = (matchId) => { setMatchToDelete(matchId); setIsModalOpen(true); };
    const handleDelete  = () => {
        if (!matchToDelete) return;
        router.delete(route('analytics.destroy', matchToDelete), {
            preserveState: true,
            onSuccess: (page) => {
                toast.success(page.props.flash?.success || 'Record successfully deleted');
                setMatchedHistory(prev => prev.filter(m => m.id !== matchToDelete));
                setIsModalOpen(false);
                setMatchToDelete(null);
            },
            onError: () => {
                toast.error('Failed to delete match.');
                setIsModalOpen(false);
                setMatchToDelete(null);
            },
        });
    };

    /* scan */
    const handleScan = () => {
        if (!selectedJob)                { toast.error('Please select a job.');               return; }
        if (selectedResumes.length === 0){ toast.error('Please select at least one resume.'); return; }
        setLoading(true);
        const jobId = typeof selectedJob === 'object' ? selectedJob.value : selectedJob;
        router.post('/analytics/scan', { job_id: jobId, resume_ids: selectedResumes }, {
            preserveState: true,
            replace: true,
            onSuccess: (page) => {
                setLoading(false);
                toast.success(page.props.flash?.success || 'Scanned successfully');
                if (page.props.matchedHistory) setMatchedHistory(page.props.matchedHistory);
                setSelectedResumes([]);
                setSelectedJob([]);
            },
            onError: () => setLoading(false),
        });
    };

    /* PDF download — logic unchanged */
    const handleDownload = async (matchId) => {
        setDownloading(matchId);
        try {
            const match = matchedHistory.find(m => m.id === matchId);
            if (!match) throw new Error('Match not found');

            const reportElement = document.getElementById(`report-content-${matchId}`);
            if (!reportElement) throw new Error('Report not found');

            const cloned = reportElement.cloneNode(true);
            cloned.style.display  = 'block';
            cloned.classList.remove('hidden');
            cloned.style.background = 'white';
            cloned.style.padding    = '20px';
            cloned.querySelectorAll('.strength-weakness').forEach(el => {
                el.style.breakInside = 'avoid';
            });
            document.body.appendChild(cloned);

            const canvas  = await html2canvas(cloned, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf     = new jsPDF('p', 'mm', 'a4');
            const pdfWidth  = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            const pageHeight = pdf.internal.pageSize.getHeight();
            let remainingHeight = pdfHeight;
            let position = 0;
            while (remainingHeight > 0) {
                pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight);
                remainingHeight -= pageHeight;
                position        += pageHeight;
                if (remainingHeight > 0) pdf.addPage();
            }
            pdf.save(`match-report-${matchId}.pdf`);
            document.body.removeChild(cloned);
            toast.success('PDF downloaded successfully!');
        } catch (err) {
            console.error('[PDF] Error during download:', err);
            toast.error('Failed to download PDF.');
        } finally {
            setDownloading(null);
        }
    };

    /* parse ai_result safely */
    const parseAi = (match) =>
        typeof match.ai_result === 'string'
            ? (() => { try { return JSON.parse(match.ai_result); } catch { return { ai_text: match.ai_result }; } })()
            : match.ai_result || { ai_text: 'No report available' };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Analytics" />

            {/* ── Loading overlay ── */}
            {loading && (
                <div className="ai-loading-overlay">
                    <div className="ai-spinner" />
                    <span className="ai-spinner-label">Scanning resumes…</span>
                </div>
            )}

            <div className="ai-root">

                {/* ── Page header ── */}
                <div className="ai-header">
                    <div>
                        <div className="ai-title">Analytics</div>
                        <div className="ai-subtitle">Scan resumes against job descriptions and review match history.</div>
                    </div>
                </div>

                {/* ── Scan panel ── */}
                <div className="ai-card">

                    {/* Job selector */}
                    <div style={{ marginBottom: 20 }}>
                        <span className="ai-label">Select Job</span>
                        <div className="ai-select">
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
                    <div style={{ marginBottom: 20 }}>
                        <span className="ai-label">Select Resumes</span>
                        <div className="ai-resume-grid-wrap">
                            {resumes.length > 0 ? (
                                <div className="ai-resume-grid">
                                    {resumes.map((resume) => {
                                        const isSelected = selectedResumes.includes(resume.id);
                                        return (
                                            <div
                                                key={resume.id}
                                                onClick={() => handleResumeSelect(resume.id)}
                                                className={`ai-resume-card${isSelected ? ' selected' : ''}`}
                                            >
                                                {/* Top row: icon + check */}
                                                <div className="ai-resume-card-top">
                                                    <div className="ai-resume-icon">
                                                        <DocumentTextIcon style={{ width: 15, height: 15, color: '#818cf8' }} />
                                                    </div>
                                                    {isSelected
                                                        ? <div className="ai-resume-check"><CheckIcon style={{ width: 12, height: 12, color: '#38bdf8' }} /></div>
                                                        : <div className="ai-resume-placeholder" />
                                                    }
                                                </div>
                                                {/* Name */}
                                                <div className="ai-resume-name" title={resume.name}>{resume.name}</div>
                                                {/* View link */}
                                                {resume.file_url && (
                                                    <a
                                                        href={resume.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ai-resume-link"
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
                                <div className="ai-resume-empty">
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                                    No resumes found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scan button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="ai-btn-scan" onClick={handleScan} disabled={loading}>
                            <MagnifyingGlassIcon style={{ width: 15, height: 15 }} />
                            {loading ? 'Scanning…' : 'Scan Selected'}
                        </button>
                    </div>
                </div>

                {/* ── Scan History ── */}
                {matchedHistory.length > 0 && (
                    <div className="ai-card ai-history-anchor">
                        <div className="ai-section-title">Scan History</div>

                        <div className="ai-table-wrap">
                            <table className="ai-table">
                                <thead>
                                    <tr>
                                        <th>Resume</th>
                                        <th>Job</th>
                                        <th>Match %</th>
                                        <th>ATS Score %</th>
                                        <th>Semantic %</th>
                                        <th>Keyword %</th>
                                        <th>Keyword Gap</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchedHistory.map((match) => {
                                        const aiData = parseAi(match);
                                        return (
                                            <React.Fragment key={match.id}>
                                                <tr>
                                                    <td className="ai-td-name">{match.resume_name || aiData.resume_name || 'N/A'}</td>
                                                    <td className="ai-td-link">
                                                        <a href={`/jobs/${match.job_description_id}`}>
                                                            {jobs.find(j => j.id === match.job_description_id)?.title || 'N/A'}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <span className={scoreBadge(aiData.overall_match_percentage, 'blue')}>
                                                            {aiData.overall_match_percentage ?? '-'}%
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={scoreBadge(aiData.ats_best_practice?.ats_score, 'green')}>
                                                            {aiData.ats_best_practice?.ats_score ?? 0}%
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={scoreBadge(aiData.scores?.semantic_score, 'purple')}>
                                                            {aiData.scores?.semantic_score ?? '-'}%
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={scoreBadge(aiData.scores?.keyword_score, 'orange')}>
                                                            {aiData.scores?.keyword_score ?? '-'}%
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={scoreBadge(aiData.scores?.keyword_gap, 'red')}>
                                                            {aiData.scores?.keyword_gap ?? '-'}%
                                                        </span>
                                                    </td>
                                                    <td>{new Date(match.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="ai-actions">
                                                            <button
                                                                className="ai-action-btn ai-action-view"
                                                                title="View"
                                                                onClick={() => Inertia.get(`/analytics/match-history/${match.id}`)}
                                                            >
                                                                <EyeIcon style={{ width: 14, height: 14 }} />
                                                            </button>
                                                            <button
                                                                className="ai-action-btn ai-action-del"
                                                                title="Delete"
                                                                onClick={() => confirmDelete(match.id)}
                                                            >
                                                                <TrashIcon style={{ width: 14, height: 14 }} />
                                                            </button>
                                                            <button
                                                                className="ai-action-btn ai-action-download"
                                                                title="Download PDF"
                                                                disabled={downloading === match.id}
                                                                onClick={() => handleDownload(match.id)}
                                                            >
                                                                {downloading === match.id
                                                                    ? <span style={{ fontSize: 10, color: '#34d399' }}>…</span>
                                                                    : <ArrowDownTrayIcon style={{ width: 14, height: 14 }} />
                                                                }
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Pagination ── */}
                        <div className="ai-pagination-row">
                            <div className="ai-per-page">
                                <span>Show</span>
                                <select
                                    className="ai-per-page-select"
                                    value={perPage}
                                    onChange={handlePerPageChange}
                                >
                                    {[10, 25, 50, 100].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                                <span className="ai-per-page-total">of {pagination.total} entries</span>
                            </div>
                            <div className="ai-links">
                                {pagination.links
                                    .filter(l => l.url || l.label === '&laquo; Previous' || l.label === 'Next &raquo;')
                                    .map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            onClick={scrollToMatchedHistory}
                                            className={`ai-page-btn ${link.active ? 'ai-page-btn-active' : ''} ${!link.url ? 'ai-page-btn-disabled' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Hidden PDF report divs (unchanged — required for html2canvas) ── */}
            {matchedHistory.map((match) => {
                const aiData = parseAi(match);
                return (
                    <div
                        key={`report-${match.id}`}
                        id={`report-content-${match.id}`}
                        className="hidden w-full p-6 bg-white"
                        style={{ background: 'white', padding: '20px', fontSize: '20px', lineHeight: 'normal' }}
                    >
                        {/* Logo */}
                        <div className="flex items-center justify-center mb-6">
                            <img src="/images/skillsync-logo.png" alt="SkillSync.ai" className="h-12 object-contain" />
                        </div>

                        <div className="space-y-6" style={{ fontSize: '20px', lineHeight: 'normal' }}>
                            {/* Overall Match & ATS Score */}
                            <div className="flex space-x-4 mb-6">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 mb-3" style={{ fontSize: '20px', lineHeight: 'normal' }}>
                                        Overall Match: {aiData.overall_match_percentage ?? 0}%
                                    </h4>
                                    <div className="w-full bg-gray-200 rounded-full h-5">
                                        <div className="bg-indigo-500 h-5 rounded-full transition-all duration-500"
                                            style={{ width: `${aiData.overall_match_percentage ?? 0}%` }} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 mb-3" style={{ fontSize: '20px', lineHeight: 'normal' }}>
                                        ATS Score: {aiData.ats_best_practice?.ats_score ?? 0}%
                                    </h4>
                                    <div className="w-full bg-gray-200 rounded-full h-5">
                                        <div className="bg-green-500 h-5 rounded-full transition-all duration-500"
                                            style={{ width: `${aiData.ats_best_practice?.ats_score ?? 0}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* Score bars */}
                            <div className="grid grid-cols-3 gap-4">
                                {['semantic_score', 'keyword_score', 'keyword_gap'].map((key) => (
                                    <div key={key}>
                                        <h5 className="text-gray-700 text-base font-medium capitalize mb-3" style={{ fontSize: '20px', lineHeight: 'normal' }}>
                                            {key.replace('_', ' ')}
                                        </h5>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div className="bg-rose-500 h-4 rounded-full transition-all duration-500"
                                                style={{ width: `${aiData.scores?.[key] ?? 0}%` }} />
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1" style={{ fontSize: '16px', lineHeight: 'normal' }}>
                                            {aiData.scores?.[key] ?? 0}%
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* ATS Best Practices */}
                            <div className="mb-6">
                                <h4 className="text-gray-800 font-semibold mb-3">ATS Best Practices</h4>
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {aiData.ats_best_practice &&
                                            Object.entries(aiData.ats_best_practice)
                                                .filter(([key]) => key !== 'ats_score')
                                                .map(([key, value]) => (
                                                    <tr key={key} className="border-b border-gray-200">
                                                        <td className="px-2 py-2 font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</td>
                                                        <td className="px-2 py-2 text-gray-600">{value}</td>
                                                    </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Skills table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left border border-gray-300 rounded" style={{ fontSize: '22px', lineHeight: 'normal' }}>
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2">Skills</th>
                                            <th className="p-2">Resume</th>
                                            <th className="p-2">Job Description</th>
                                            <th className="p-2">Gap</th>
                                            <th className="p-2">Matched</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {aiData.skills_analysis?.map((skill) => (
                                            <tr key={skill.skill} className="border-t border-gray-200">
                                                <td className="p-2">{skill.skill}</td>
                                                <td className="p-2">{skill.resume_count}</td>
                                                <td className="p-2">{skill.job_count}</td>
                                                <td className="p-2">{skill.gap}</td>
                                                <td className="p-2">
                                                    {skill.matched ? <CheckIcon className="h-5 w-5 text-green-500" /> : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Strengths & Weaknesses */}
                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 break-inside-avoid strength-weakness">
                                <div className="flex-1">
                                    <h5 className="text-gray-800 font-semibold mb-3" style={{ fontSize: '22px' }}>Strengths</h5>
                                    <p className="text-gray-700 whitespace-pre-wrap" style={{ fontSize: '20px', lineHeight: 'normal' }}>
                                        {aiData.strengths ?? 'N/A'}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-gray-800 font-semibold mb-3" style={{ fontSize: '22px' }}>Weaknesses</h5>
                                    <p className="text-gray-700 whitespace-pre-wrap" style={{ fontSize: '20px', lineHeight: 'normal' }}>
                                        {aiData.weaknesses ?? 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Detailed AI text */}
                            <div>
                                <h5 className="text-gray-800 font-semibold mb-3" style={{ fontSize: '22px' }}>Detailed Analysis</h5>
                                <p className="text-gray-700 whitespace-pre-wrap" style={{ fontSize: '20px', lineHeight: 'normal' }}>
                                    {aiData.ai_text || 'No report available'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* ── Delete Modal ── */}
            {isModalOpen && (
                <div className="ai-modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    <div className="ai-modal" onClick={e => e.stopPropagation()}>
                        <button className="ai-modal-close" onClick={() => setIsModalOpen(false)}>
                            <XMarkIcon style={{ width: 14, height: 14 }} />
                        </button>
                        <div className="ai-modal-icon">
                            <TrashIcon style={{ width: 22, height: 22, color: '#f87171' }} />
                        </div>
                        <div className="ai-modal-title">Delete Match?</div>
                        <div className="ai-modal-desc">
                            Are you sure you want to delete this match record? This action cannot be undone.
                        </div>
                        <div className="ai-modal-actions">
                            <button className="ai-modal-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="ai-modal-delete" onClick={handleDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}