import Layout from "../Dashboard/Components/Layout";
import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import {
    ChevronLeftIcon,
    QuestionMarkCircleIcon,
    CheckCircleIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/outline";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .ip-root {
        font-family: 'Inter', sans-serif;
        padding: 28px 28px 60px;
        background: #0f172a;
        min-height: 100%;
    }

    /* ── Header ── */
    .ip-header {
        display: flex; align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
    }
    .ip-title    { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
    .ip-subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }
    .ip-back {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; font-weight: 600; color: #38bdf8;
        text-decoration: none; padding: 7px 14px; border-radius: 9px;
        background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.18);
        transition: all 0.18s; white-space: nowrap;
    }
    .ip-back:hover { background: rgba(56,189,248,0.15); }

    /* ── Section card ── */
    .ip-card {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        margin-bottom: 16px;
        overflow: hidden;
    }
    .ip-card-head {
        display: flex; align-items: center; gap: 10px;
        padding: 15px 22px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .ip-card-icon {
        width: 32px; height: 32px; border-radius: 9px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ip-card-title { font-size: 14px; font-weight: 700; color: #e2e8f0; }
    .ip-card-body  { padding: 22px; }

    /* ── Job info rows ── */
    .ip-info-row {
        display: flex; gap: 8px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255,255,255,0.04);
        font-size: 13px; line-height: 1.65;
    }
    .ip-info-row:last-child { border-bottom: none; padding-bottom: 0; }
    .ip-info-key {
        font-weight: 600; color: #94a3b8;
        flex-shrink: 0; width: 100px;
    }
    .ip-info-val { color: #cbd5e1; flex: 1; }

    /* Show more inline button */
    .ip-show-inline {
        background: none; border: none; cursor: pointer;
        font-size: 12px; font-weight: 600; color: #38bdf8;
        padding: 0 4px; transition: color 0.15s; font-family: 'Inter', sans-serif;
    }
    .ip-show-inline:hover { color: #7dd3fc; }

    /* ── Summary text ── */
    .ip-summary-text {
        font-size: 14px; color: #94a3b8; line-height: 1.80;
    }

    /* ── Q&A list ── */
    .ip-qa-list { display: flex; flex-direction: column; gap: 12px; }

    .ip-qa-item {
        background: #151f32;
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 14px; padding: 18px 20px;
        transition: all 0.18s;
    }
    .ip-qa-item:hover {
        border-color: rgb(68 98 143);
        background: rgb(38 56 84 / 83%);
    }

    /* Question row */
    .ip-q-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
    .ip-q-icon-box {
        width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
        background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.22);
        display: flex; align-items: center; justify-content: center;
        margin-top: 1px;
    }
    .ip-q-num {
        font-size: 11px; font-weight: 800; color: #38bdf8;
        font-family: 'Inter', sans-serif; letter-spacing: 0.3px;
    }
    .ip-q-text {
        font-size: 14px; font-weight: 700; color: #e2e8f0; line-height: 1.55; flex: 1;
    }

    /* Answer row */
    .ip-a-row {
        display: flex; align-items: flex-start; gap: 12px;
        padding-top: 14px;
        border-top: 1px solid rgba(255,255,255,0.05);
    }
    .ip-a-icon-box {
        width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
        background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.22);
        display: flex; align-items: center; justify-content: center;
        margin-top: 1px;
    }
    .ip-a-text {
        font-size: 13px; color: #94a3b8; line-height: 1.75; flex: 1;
    }

    /* Show more button */
    .ip-show-more-btn {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        margin: 16px auto 0; padding: 9px 22px; border-radius: 10px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
        color: #94a3b8; font-size: 13px; font-weight: 600; cursor: pointer;
        transition: all 0.18s; font-family: 'Inter', sans-serif;
    }
    .ip-show-more-btn:hover { background: rgba(255,255,255,0.07); color: #cbd5e1; }

    /* Empty state */
    .ip-empty {
        padding: 40px 20px; text-align: center;
        color: #334155; font-size: 14px; font-weight: 500;
    }
    .ip-empty-icon { font-size: 32px; margin-bottom: 10px; }

    /* Count badge */
    .ip-count-badge {
        margin-left: auto;
        font-size: 11px; font-weight: 700; padding: 3px 10px;
        border-radius: 20px; color: #818cf8;
        background: rgba(129,140,248,0.12); border: 1px solid rgba(129,140,248,0.22);
    }
`;

function truncate(text, limit) {
    if (!text || text.length <= limit) return text;
    const cut = text.substring(0, limit);
    const last = cut.lastIndexOf(' ');
    return cut.substring(0, last > 0 ? last : limit) + '…';
}

function SectionCard({ iconBg, iconColor, icon: Icon, title, badge, children }) {
    return (
        <div className="ip-card">
            <div className="ip-card-head">
                <div className="ip-card-icon" style={{ background: iconBg }}>
                    <Icon style={{ width: 15, height: 15, color: iconColor }} />
                </div>
                <span className="ip-card-title">{title}</span>
                {badge && <span className="ip-count-badge">{badge}</span>}
            </div>
            <div className="ip-card-body">{children}</div>
        </div>
    );
}

export default function Show({ interviewPrep }) {
    const [showFullDesc,    setShowFullDesc]    = useState(false);
    const [showFullSummary, setShowFullSummary] = useState(false);
    const [showAllQA,       setShowAllQA]       = useState(false);

    const qaList = Array.isArray(interviewPrep.questions_answers)
        ? interviewPrep.questions_answers : [];

    const description = interviewPrep.job?.description || 'N/A';
    const summary     = interviewPrep.summary || 'No summary available.';
    const visibleQA   = showAllQA ? qaList : qaList.slice(0, 10);

    return (
        <Layout>
            <style>{styles}</style>
            <Head title="Interview Prep Details" />

            <div className="ip-root">

                {/* Header */}
                <div className="ip-header">
                    <div>
                        <div className="ip-title">Interview Prep #{interviewPrep.id}</div>
                        <div className="ip-subtitle">AI-generated questions & answers for your target role</div>
                    </div>
                    <Link href="/interview-preps" className="ip-back">
                        <ChevronLeftIcon style={{ width: 14, height: 14 }} />
                        Back to History
                    </Link>
                </div>

                {/* Job Information */}
                <SectionCard
                    icon={BriefcaseIcon}
                    title="Job Information"
                    iconBg="rgba(56,189,248,0.12)"
                    iconColor="#38bdf8"
                >
                    <div>
                        <div className="ip-info-row">
                            <span className="ip-info-key">Title</span>
                            <span className="ip-info-val">
                                {interviewPrep.job?.title || 'N/A'}
                            </span>
                        </div>
                        <div className="ip-info-row">
                            <span className="ip-info-key">Description</span>
                            <span className="ip-info-val">
                                {showFullDesc ? description : truncate(description, 450)}
                                {description.length > 450 && (
                                    <button
                                        className="ip-show-inline"
                                        onClick={() => setShowFullDesc(v => !v)}
                                    >
                                        {showFullDesc ? ' Show less' : ' Show more'}
                                    </button>
                                )}
                            </span>
                        </div>
                    </div>
                </SectionCard>

                {/* Summary */}
                <SectionCard
                    icon={DocumentTextIcon}
                    title="Summary"
                    iconBg="rgba(251,191,36,0.12)"
                    iconColor="#fbbf24"
                >
                    <div className="ip-summary-text">
                        {showFullSummary ? summary : truncate(summary, 500)}
                        {summary.length > 500 && (
                            <button
                                className="ip-show-inline"
                                onClick={() => setShowFullSummary(v => !v)}
                            >
                                {showFullSummary ? ' Show less' : ' Show more'}
                            </button>
                        )}
                    </div>
                </SectionCard>

                {/* Questions & Answers */}
                <SectionCard
                    icon={QuestionMarkCircleIcon}
                    title="Interview Questions & Answers"
                    iconBg="rgba(129,140,248,0.12)"
                    iconColor="#818cf8"
                    badge={qaList.length > 0 ? `${qaList.length} questions` : null}
                >
                    {qaList.length > 0 ? (
                        <>
                            <div className="ip-qa-list">
                                {visibleQA.map((qa, i) => (
                                    <div key={i} className="ip-qa-item">
                                        {/* Question */}
                                        <div className="ip-q-row">
                                            <div className="ip-q-icon-box">
                                                <span className="ip-q-num">Q{i + 1}</span>
                                            </div>
                                            <p className="ip-q-text">
                                                {qa.question || 'No question found'}
                                            </p>
                                        </div>

                                        {/* Answer */}
                                        <div className="ip-a-row">
                                            <div className="ip-a-icon-box">
                                                <CheckCircleIcon style={{ width: 15, height: 15, color: '#34d399' }} />
                                            </div>
                                            <p className="ip-a-text">
                                                {qa.answer || 'No answer provided'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {qaList.length > 10 && (
                                <button
                                    className="ip-show-more-btn"
                                    onClick={() => setShowAllQA(v => !v)}
                                >
                                    {showAllQA
                                        ? <><ChevronUpIcon style={{ width: 14, height: 14 }} /> Show less</>
                                        : <><ChevronDownIcon style={{ width: 14, height: 14 }} /> Show {qaList.length - 10} more questions</>
                                    }
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="ip-empty">
                            <div className="ip-empty-icon">❓</div>
                            No questions and answers available.
                        </div>
                    )}
                </SectionCard>

            </div>
        </Layout>
    );
}