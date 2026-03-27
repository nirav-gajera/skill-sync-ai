import Layout from "../Dashboard/Components/Layout";
import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import {
    ChevronLeftIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    DocumentTextIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/outline";

/*
    TEXT COLOR SCALE (dark bg = #0f172a, card bg = #1e293b)
    ─────────────────────────────────────────────────────────
    #f1f5f9  — headings / primary
    #cbd5e1  — body / main content
    #94a3b8  — secondary labels
    #6e7e95  — tertiary / placeholders  (user's calibration)
    #4a5a6e  — dividers / disabled      (only for borders)
*/

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .mh-root {
        font-family: 'Inter', sans-serif;
        padding: 28px 28px 60px;
        background: #0f172a;
        min-height: 100%;
    }

    /* ── Header ── */
    .mh-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .mh-title    { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
    .mh-subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }

    .mh-back {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; font-weight: 600; color: #38bdf8;
        text-decoration: none; padding: 7px 14px; border-radius: 9px;
        background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.18);
        transition: all 0.18s; white-space: nowrap;
    }
    .mh-back:hover { background: rgba(56,189,248,0.15); }

    /* ── Meta pills ── */
    .mh-meta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
    .mh-meta-pill {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 6px 14px; border-radius: 100px;
        font-size: 12px; font-weight: 600;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.09);
        color: #94a3b8;
    }

    /* ── Score cards ── */
    .mh-scores {
        display: grid; grid-template-columns: repeat(4,1fr);
        gap: 12px; margin-bottom: 16px;
    }
    @media (max-width: 900px) { .mh-scores { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 480px) { .mh-scores { grid-template-columns: 1fr; } }

    .mh-score-card {
        background: #1e293b; border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px; padding: 18px 18px 14px;
        position: relative; overflow: hidden;
        transition: all 0.2s;
    }
    .mh-score-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.3); }
    .mh-score-label {
        font-size: 11px; font-weight: 700; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;
    }
    .mh-score-value { font-size: 34px; font-weight: 800; letter-spacing: -1px; line-height: 1; margin-bottom: 12px; }
    .mh-score-bar-bg { height: 4px; border-radius: 10px; background: rgba(255,255,255,0.08); overflow: hidden; }
    .mh-score-bar-fill { height: 100%; border-radius: 10px; transition: width 0.8s ease; }
    .mh-score-glow { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; border-radius: 0 0 14px 14px; }

    /* ── Section card shell ── */
    .mh-card {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px; margin-bottom: 16px; overflow: hidden;
    }
    .mh-card-head {
        display: flex; align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        gap: 10px;
    }
    .mh-card-icon {
        width: 32px; height: 32px; border-radius: 9px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .mh-card-title { font-size: 14px; font-weight: 700; color: #e2e8f0; }
    .mh-card-body  { padding: 20px; }

    /* ── Keyword gap inline card ── */
    .mh-gap-inner {
        display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
    }
    .mh-gap-label { font-size: 13px; font-weight: 700; color: #cbd5e1; }
    .mh-gap-pct   { font-size: 14px; font-weight: 800; color: #f87171; }
    .mh-gap-desc  { font-size: 12px; color: #94a3b8; margin-top: 7px; }

    /* ── ATS table ── */
    .mh-ats-table { width: 100%; border-collapse: collapse; }
    .mh-ats-table td {
        padding: 10px 12px; font-size: 13px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        vertical-align: top;
    }
    .mh-ats-table tr:last-child td { border-bottom: none; }
    .mh-ats-key { color: #94a3b8; font-weight: 600; text-transform: capitalize; white-space: nowrap; width: 40%; }
    .mh-ats-val { color: #cbd5e1; line-height: 1.6; }

    /* ── Skills table ── */
    .mh-skills-wrap { overflow-x: auto; }
    .mh-skills-table { width: 100%; border-collapse: collapse; min-width: 480px; }
    .mh-skills-table th {
        padding: 10px 14px; text-align: left;
        font-size: 11px; font-weight: 700; color: #94a3b8;
        text-transform: uppercase; letter-spacing: 0.8px;
        background: rgba(255,255,255,0.03);
        border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .mh-skills-table td {
        padding: 11px 14px; font-size: 13px; color: #94a3b8;
        border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .mh-skills-table tbody tr:last-child td { border-bottom: none; }
    .mh-skills-table tbody tr:hover td { background: rgba(255,255,255,0.025); }
    .mh-skill-name { color: #cbd5e1 !important; font-weight: 500; }

    .mh-matched-yes {
        display: inline-flex; align-items: center; justify-content: center;
        width: 22px; height: 22px; border-radius: 6px;
        background: rgba(52,211,153,0.12); border: 1px solid rgba(52,211,153,0.25);
    }
    .mh-matched-no { color: #6e7e95; }

    .mh-show-more-btn {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        margin: 14px auto 0; padding: 8px 20px; border-radius: 9px;
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
        color: #94a3b8; font-size: 13px; font-weight: 600; cursor: pointer;
        transition: all 0.18s; font-family: 'Inter', sans-serif;
    }
    .mh-show-more-btn:hover { background: rgba(255,255,255,0.07); color: #cbd5e1; }

    /* ── Strengths / Weaknesses ── */
    .mh-sw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 640px) { .mh-sw-grid { grid-template-columns: 1fr; } }

    .mh-sw-card { border-radius: 12px; padding: 16px; }
    .mh-sw-title {
        font-size: 13px; font-weight: 700; margin-bottom: 10px;
        display: flex; align-items: center; gap: 7px;
    }
    .mh-sw-body { font-size: 13px; color: #94a3b8; line-height: 1.80; white-space: pre-wrap; }

    /* ── Detailed analysis ── */
    .mh-analysis-text { font-size: 13px; color: #94a3b8; line-height: 1.85; white-space: pre-wrap; }
`;

const SCORE_DEFS = [
    {
        key: "overall",
        label: "Overall Match",
        color: "#38bdf8",
        glow: "#38bdf8",
    },
    { key: "ats", label: "ATS Score", color: "#34d399", glow: "#34d399" },
    {
        key: "semantic",
        label: "Semantic Score",
        color: "#818cf8",
        glow: "#818cf8",
    },
    {
        key: "keyword",
        label: "Keyword Score",
        color: "#fbbf24",
        glow: "#fbbf24",
    },
];

function ScoreCard({ label, value, color, glow }) {
    const pct = value ?? 0;
    return (
        <div className="mh-score-card">
            <div className="mh-score-label">{label}</div>
            <div className="mh-score-value" style={{ color }}>
                {pct}%
            </div>
            <div className="mh-score-bar-bg">
                <div
                    className="mh-score-bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                />
            </div>
            <div
                className="mh-score-glow"
                style={{
                    background: `linear-gradient(90deg, ${glow}50, transparent)`,
                }}
            />
        </div>
    );
}

function SectionCard({
    iconBg,
    iconColor,
    icon: Icon,
    emoji,
    title,
    children,
}) {
    return (
        <div className="mh-card">
            <div className="mh-card-head">
                <div className="mh-card-icon" style={{ background: iconBg }}>
                    {Icon ? (
                        <Icon
                            style={{ width: 15, height: 15, color: iconColor }}
                        />
                    ) : (
                        <span style={{ fontSize: 14 }}>{emoji}</span>
                    )}
                </div>
                <span className="mh-card-title">{title}</span>
            </div>
            <div className="mh-card-body">{children}</div>
        </div>
    );
}

export default function MatchHistory({ match, aiData, jobTitle, resumeName }) {
    const [showAllSkills, setShowAllSkills] = useState(false);

    const scores = [
        { ...SCORE_DEFS[0], value: aiData.overall_match_percentage ?? 0 },
        { ...SCORE_DEFS[1], value: aiData.ats_best_practice?.ats_score ?? 0 },
        { ...SCORE_DEFS[2], value: aiData.scores?.semantic_score ?? 0 },
        { ...SCORE_DEFS[3], value: aiData.scores?.keyword_score ?? 0 },
    ];

    const atsEntries = aiData.ats_best_practice
        ? Object.entries(aiData.ats_best_practice).filter(
              ([k]) => k !== "ats_score",
          )
        : [];

    const skills = aiData.skills_analysis ?? [];
    const visibleSkills = showAllSkills ? skills : skills.slice(0, 6);
    const keywordGap = aiData.scores?.keyword_gap;

    return (
        <Layout>
            <style>{styles}</style>
            <Head title={`Match History #${match.id}`} />

            <div className="mh-root">
                {/* Header */}
                <div className="mh-header">
                    <div>
                        <div className="mh-title">
                            Match History #{match.id}
                        </div>
                        <div className="mh-subtitle">
                            AI resume analysis report
                        </div>
                    </div>
                    <Link href="/analytics" className="mh-back">
                        <ChevronLeftIcon style={{ width: 14, height: 14 }} />
                        Back to History
                    </Link>
                </div>

                {/* Meta pills */}
                {(jobTitle || resumeName) && (
                    <div className="mh-meta">
                        {jobTitle && (
                            <span className="mh-meta-pill">
                                <BriefcaseIcon
                                    style={{ width: 13, height: 13 }}
                                />
                                {jobTitle}
                            </span>
                        )}
                        {resumeName && (
                            <span className="mh-meta-pill">
                                <DocumentTextIcon
                                    style={{ width: 13, height: 13 }}
                                />
                                {resumeName}
                            </span>
                        )}
                    </div>
                )}

                {/* Score cards */}
                <div className="mh-scores">
                    {scores.map((s) => (
                        <ScoreCard
                            key={s.key}
                            label={s.label}
                            value={s.value}
                            color={s.color}
                            glow={s.glow}
                        />
                    ))}
                </div>

                {/* Keyword Gap */}
                {keywordGap !== undefined && (
                    <div className="mh-card">
                        <div
                            className="mh-card-body"
                            style={{ paddingTop: 16, paddingBottom: 16 }}
                        >
                            <div className="mh-gap-inner">
                                <span className="mh-gap-label">
                                    Keyword Gap
                                </span>
                                <span className="mh-gap-pct">
                                    {keywordGap}%
                                </span>
                            </div>
                            <div
                                style={{
                                    height: 6,
                                    borderRadius: 10,
                                    background: "rgba(255,255,255,0.07)",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        width: `${keywordGap}%`,
                                        background: "#f87171",
                                        borderRadius: 10,
                                        transition: "width 0.8s ease",
                                    }}
                                />
                            </div>
                            <div className="mh-gap-desc">
                                Keywords found in the job description but
                                missing from your resume.
                            </div>
                        </div>
                    </div>
                )}

                {/* ATS Best Practices */}
                {atsEntries.length > 0 && (
                    <SectionCard
                        icon={CheckIcon}
                        title="ATS Best Practices"
                        iconBg="rgba(52,211,153,0.12)"
                        iconColor="#34d399"
                    >
                        <table className="mh-ats-table">
                            <tbody>
                                {atsEntries.map(([key, value]) => (
                                    <tr key={key}>
                                        <td className="mh-ats-key">
                                            {key.replace(/_/g, " ")}
                                        </td>
                                        <td className="mh-ats-val">
                                            {String(value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </SectionCard>
                )}

                {/* Skills Gap */}
                {skills.length > 0 && (
                    <SectionCard
                        icon={DocumentTextIcon}
                        title="Skills Gap Analysis"
                        iconBg="rgba(129,140,248,0.12)"
                        iconColor="#818cf8"
                    >
                        <div className="mh-skills-wrap">
                            <table className="mh-skills-table">
                                <thead>
                                    <tr>
                                        <th>Skill</th>
                                        <th>In Resume</th>
                                        <th>In Job Description</th>
                                        <th>Gap</th>
                                        <th>Matched</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleSkills.map((skill) => (
                                        <tr key={skill.skill}>
                                            <td className="mh-skill-name">
                                                {skill.skill}
                                            </td>
                                            <td>{skill.resume_count}</td>
                                            <td>{skill.job_count}</td>
                                            <td
                                                style={{
                                                    color:
                                                        skill.gap > 0
                                                            ? "#f87171"
                                                            : skill.gap === 0
                                                              ? "#34d399"
                                                              : "#94a3b8",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {skill.gap > 0
                                                    ? `−${skill.gap}`
                                                    : skill.gap === 0
                                                      ? "✓"
                                                      : skill.gap}
                                            </td>
                                            <td>
                                                {skill.matched ? (
                                                    <span className="mh-matched-yes">
                                                        <CheckIcon
                                                            style={{
                                                                width: 12,
                                                                height: 12,
                                                                color: "#34d399",
                                                            }}
                                                        />
                                                    </span>
                                                ) : (
                                                    <span className="mh-matched-no">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {skills.length > 6 && (
                            <button
                                className="mh-show-more-btn"
                                onClick={() => setShowAllSkills((v) => !v)}
                            >
                                {showAllSkills ? (
                                    <>
                                        <ChevronUpIcon
                                            style={{ width: 14, height: 14 }}
                                        />{" "}
                                        Show less
                                    </>
                                ) : (
                                    <>
                                        <ChevronDownIcon
                                            style={{ width: 14, height: 14 }}
                                        />{" "}
                                        Show {skills.length - 6} more skills
                                    </>
                                )}
                            </button>
                        )}
                    </SectionCard>
                )}

                {/* Strengths & Weaknesses */}
                {(aiData.strengths || aiData.weaknesses) && (
                    <SectionCard
                        emoji="⚡"
                        title="Strengths & Weaknesses"
                        iconBg="rgba(251,191,36,0.12)"
                    >
                        <div className="mh-sw-grid">
                            <div
                                className="mh-sw-card"
                                style={{
                                    background: "rgba(52,211,153,0.06)",
                                    border: "1px solid rgba(52,211,153,0.14)",
                                }}
                            >
                                <div
                                    className="mh-sw-title"
                                    style={{ color: "#34d399" }}
                                >
                                    <span>💪</span> Strengths
                                </div>
                                <div className="mh-sw-body">
                                    {aiData.strengths ?? "N/A"}
                                </div>
                            </div>
                            <div
                                className="mh-sw-card"
                                style={{
                                    background: "rgba(248,113,113,0.06)",
                                    border: "1px solid rgba(248,113,113,0.14)",
                                }}
                            >
                                <div
                                    className="mh-sw-title"
                                    style={{ color: "#f87171" }}
                                >
                                    <span>📉</span> Weaknesses
                                </div>
                                <div className="mh-sw-body">
                                    {aiData.weaknesses ?? "N/A"}
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                )}

                {/* Detailed Analysis */}
                <SectionCard
                    emoji="🔍"
                    title="Detailed Analysis"
                    iconBg="rgba(56,189,248,0.12)"
                >
                    <div className="mh-analysis-text">
                        {aiData.ai_text || "No detailed analysis available."}
                    </div>
                </SectionCard>
            </div>
        </Layout>
    );
}
