import Layout from "./Components/Layout";
import { Link, Head, usePage } from "@inertiajs/react";
import {
    EyeIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    EnvelopeOpenIcon,
    PencilSquareIcon,
    ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .db-root { font-family: 'Inter', sans-serif; padding: 28px 28px 48px; background: #0f172a; min-height: 100%; }

    /* Page header */
    .db-header { margin-bottom: 28px; }
    .db-title { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
    .db-subtitle { font-size: 13px; color: #6e7e95; margin-top: 3px; }

    /* Stat cards */
    .db-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 36px; }
    @media (max-width: 1100px) { .db-cards { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 600px)  { .db-cards { grid-template-columns: 1fr; } }

    .db-card {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 14px;
        padding: 20px 20px 16px;
        transition: all 0.2s;
        position: relative; overflow: hidden;
    }
    .db-card:hover { border-color: rgba(255,255,255,0.13); transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,0.3); }
    .db-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
    .db-card-icon {
        width: 56px; height: 40px; border-radius: 11px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .db-card-title { font-size: 12px; font-weight: 600; color: #637895; text-transform: uppercase; letter-spacing: 0.6px; }
    .db-card-value { font-size: 32px; font-weight: 800; color: #f1f5f9; letter-spacing: -1px; line-height: 1; }
    .db-card-glow {
        position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
        border-radius: 0 0 14px 14px;
    }

    /* Section header */
    .db-section { margin-bottom: 32px; }
    .db-section-head {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 14px;
    }
    .db-section-left { display: flex; align-items: center; gap: 10px; }
    .db-section-icon {
        width: 32px; height: 32px; border-radius: 9px;
        display: flex; align-items: center; justify-content: center;
    }
    .db-section-title { font-size: 15px; font-weight: 700; color: #e2e8f0; }
    .db-section-link {
        font-size: 12px; font-weight: 600; color: #38bdf8;
        text-decoration: none; padding: 5px 12px; border-radius: 7px;
        background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.15);
        transition: all 0.18s;
    }
    .db-section-link:hover { background: rgba(56,189,248,0.14); }

    /* Table */
    .db-table-wrap {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 14px; overflow: hidden;
    }
    .db-table { width: 100%; border-collapse: collapse; }
    .db-table thead { background: rgba(255,255,255,0.025); }
    .db-table th {
        padding: 12px 18px; text-align: left;
        font-size: 11px; font-weight: 600; color: #6e7e95;
        text-transform: uppercase; letter-spacing: 0.8px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .db-table td {
        padding: 13px 18px; font-size: 13px; color: #94a3b8;
        border-bottom: 1px solid rgba(255,255,255,0.04);
        word-break: break-word;
    }
    .db-table tbody tr:last-child td { border-bottom: none; }
    .db-table tbody tr:hover td { background: rgba(255,255,255,0.025); color: #cbd5e1; }
    .db-table td:first-child { color: #e2e8f0; font-weight: 500; }

    .db-view-link {
        display: inline-flex; align-items: center; gap: 5px;
        font-size: 12px; font-weight: 600; color: #38bdf8;
        text-decoration: none; padding: 5px 10px; border-radius: 7px;
        background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.15);
        transition: all 0.18s; white-space: nowrap;
    }
    .db-view-link:hover { background: rgba(56,189,248,0.15); }

    /* Empty state */
    .db-empty {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 14px; padding: 28px 20px;
        text-align: center; color: #6e7e95;
        font-size: 13px; font-weight: 500;
    }
    .db-empty-icon { font-size: 28px; margin-bottom: 8px; }
`;

// Card accent configs
const CARD_ACCENTS = [
    { iconBg: "rgba(56,189,248,0.12)", iconColor: "#38bdf8", glow: "#38bdf8" },
    { iconBg: "rgba(129,140,248,0.12)", iconColor: "#818cf8", glow: "#818cf8" },
    { iconBg: "rgba(52,211,153,0.12)", iconColor: "#34d399", glow: "#34d399" },
    { iconBg: "rgba(251,191,36,0.12)", iconColor: "#fbbf24", glow: "#fbbf24" },
    { iconBg: "rgba(251,191,36,0.12)", iconColor: "#fbbf24", glow: "#fbbf24" },
];

const CARD_ICONS = ["📄", "💼", "✍️", "🧑‍💼", "🧑‍💻"];

// Section configs
const SECTIONS = [
    {
        key: "jobs",
        title: "Recent Jobs",
        icon: BriefcaseIcon,
        iconBg: "rgba(56,189,248,0.12)",
        iconColor: "#38bdf8",
        href: "/jobs",
        col: "title",
        rowHref: (r) => `/jobs/${r.id}`,
    },
    {
        key: "resumes",
        title: "Recent Resumes",
        icon: DocumentTextIcon,
        iconBg: "rgba(129,140,248,0.12)",
        iconColor: "#818cf8",
        href: "/resumes",
        col: "name",
        rowHref: (r) => `/resumes/${r.id}/edit`,
    },
    {
        key: "coverLetters",
        title: "Recent Cover Letters",
        icon: EnvelopeOpenIcon,
        iconBg: "rgba(52,211,153,0.12)",
        iconColor: "#34d399",
        href: "/cover-letters",
        col: "company_name",
        colLabel: "Company",
        rowHref: (r) => `/cover-letters/${r.id}`,
    },
    {
        key: "interviewPreps",
        title: "Recent Interview Preps",
        icon: PencilSquareIcon,
        iconBg: "rgba(251,191,36,0.12)",
        iconColor: "#fbbf24",
        href: "/interview-preps",
        col: "job_title",
        colLabel: "Job Title",
        rowHref: (r) => `/interview-preps/${r.id}`,
    },
    {
        key: "onlineExams",
        title: "Recent Online Exams",
        icon: ComputerDesktopIcon,
        iconBg: "rgb(36 220 251 / 21%)",
        iconColor: "#36dcfb",
        href: "/online-exams",
        col: "job_title",
        colLabel: "Job Title",
        rowHref: (r) => `/online-exams/${r.id}`,
    },
];

function StatCard({ title, value, index }) {
    const acc = CARD_ACCENTS[index % CARD_ACCENTS.length];
    return (
        <div className="db-card">
            <div className="db-card-top">
                <div>
                    <div className="db-card-title">{title}</div>
                    <div className="db-card-value" style={{ marginTop: 8 }}>
                        {value}
                    </div>
                </div>
                <div
                    className="db-card-icon"
                    style={{ background: acc.iconBg }}
                >
                    <span style={{ fontSize: 20 }}>
                        {CARD_ICONS[index % CARD_ICONS.length]}
                    </span>
                </div>
            </div>
            <div
                className="db-card-glow"
                style={{
                    background: `linear-gradient(90deg, ${acc.glow}40, transparent)`,
                }}
            />
        </div>
    );
}

function SectionTable({ section, rows }) {
    const Icon = section.icon;
    const colLabel = section.colLabel ?? "Name";
    const col = section.col;

    return (
        <div className="db-section">
            <div className="db-section-head">
                <div className="db-section-left">
                    <div
                        className="db-section-icon"
                        style={{ background: section.iconBg }}
                    >
                        <Icon
                            style={{
                                width: 16,
                                height: 16,
                                color: section.iconColor,
                            }}
                        />
                    </div>
                    <span className="db-section-title">{section.title}</span>
                </div>
                <Link href={section.href} className="db-section-link">
                    View all →
                </Link>
            </div>

            {rows.length > 0 ? (
                <div className="db-table-wrap">
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>{colLabel}</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id}>
                                    <td
                                        style={{ minWidth: 180, maxWidth: 300 }}
                                    >
                                        {row[col]}
                                    </td>
                                    <td style={{ minWidth: 120 }}>
                                        {row.date}
                                    </td>
                                    <td>
                                        <Link
                                            href={section.rowHref(row)}
                                            className="db-view-link"
                                        >
                                            <EyeIcon
                                                style={{
                                                    width: 13,
                                                    height: 13,
                                                }}
                                            />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="db-empty">
                    <div className="db-empty-icon">📭</div>
                    No {section.title.replace("Recent ", "").toLowerCase()} yet
                </div>
            )}
        </div>
    );
}

export default function Dashboard({
    cards,
    recentJobs,
    recentResumes,
    recentCoverLetters,
    recentInterviewPreps,
    recentOnlineExams,
}) {
    const { flash } = usePage().props;
    const [shown, setShown] = useState(false);

    useEffect(() => {
        if (!shown && flash?.message) {
            if (flash.type === "success") toast.success(flash.message);
            else if (flash.type === "error") toast.error(flash.message);
            else toast(flash.message);
            setShown(true);
        }
    }, [flash, shown]);

    const sections = [
        { ...SECTIONS[0], rows: recentJobs },
        { ...SECTIONS[1], rows: recentResumes },
        { ...SECTIONS[2], rows: recentCoverLetters },
        { ...SECTIONS[3], rows: recentInterviewPreps },
        { ...SECTIONS[4], rows: recentOnlineExams },
    ];

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#1e293b",
                        color: "#e2e8f0",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        fontSize: "13px",
                    },
                    success: {
                        iconTheme: { primary: "#22c55e", secondary: "#1e293b" },
                    },
                    error: {
                        iconTheme: { primary: "#f87171", secondary: "#1e293b" },
                    },
                }}
            />
            <Head title="Dashboard" />

            <div className="db-root">
                {/* Header */}
                <div className="db-header">
                    <div className="db-title">Dashboard</div>
                    <div className="db-subtitle">
                        Welcome back — here's what's happening with your career.
                    </div>
                </div>

                {/* Stat cards */}
                <div className="db-cards">
                    {cards.map((c, i) => (
                        <StatCard
                            key={i}
                            title={c.title}
                            value={c.value}
                            index={i}
                        />
                    ))}
                </div>

                {/* Recent sections */}
                {sections.map((s) => (
                    <SectionTable key={s.key} section={s} rows={s.rows} />
                ))}
            </div>
        </Layout>
    );
}
