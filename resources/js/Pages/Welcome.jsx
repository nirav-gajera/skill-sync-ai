import { Head, Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .ss-root {
        font-family: 'Inter', sans-serif;
        background: #0f172a;
        color: #ffffff;
        min-height: 100vh;
    }

    .ss-bg {
        position: fixed; inset: 0; z-index: 0;
        background:
            linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px);
        background-size: 56px 56px;
        background-color: #1a202c;
        pointer-events: none;
    }
    .ss-bg-glow {
        position: fixed; inset: 0; z-index: 0;
        background: radial-gradient(ellipse 70% 35% at 50% 0%, rgba(56,189,248,0.08) 0%, transparent 65%);
        pointer-events: none;
    }

    /* NAV */
    .ss-nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 100;
        padding: 14px 32px;
        display: flex; align-items: center; justify-content: space-between;
        background: rgba(15,23,42,0.70);
        backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .ss-logo { display: flex; align-items: center; gap: 10px; }
    .ss-logo-icon {
        width: 36px; height: 36px; border-radius: 10px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        display: flex; align-items: center; justify-content: center;
    }
    .ss-logo-text { font-size: 18px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
    .ss-logo-text span { color: #38bdf8; }

    .ss-nav-links { display: flex; align-items: center; gap: 10px; }
    .ss-btn-ghost {
        padding: 8px 18px; border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.12); color: #94a3b8;
        font-size: 14px; font-weight: 500; text-decoration: none;
        transition: all 0.2s; background: transparent; display: inline-block;
    }
    .ss-btn-ghost:hover { color: #e2e8f0; border-color: rgba(255,255,255,0.28); }
    .ss-btn-primary {
        padding: 8px 20px; border-radius: 8px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        color: #ffffff; font-size: 14px; font-weight: 600;
        text-decoration: none; transition: all 0.2s;
        box-shadow: 0 4px 16px rgba(14,165,233,0.25); display: inline-block;
    }
    .ss-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

    /* CONTENT */
    .ss-content { position: relative; z-index: 10; }

    /* HERO */
    .ss-hero {
        padding: 136px 32px 80px; max-width: 1200px; margin: 0 auto;
        display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
    }
    @media (max-width: 900px) {
        .ss-hero { grid-template-columns: 1fr; padding: 120px 20px 60px; }
    }

    .ss-badge {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 14px; border-radius: 100px;
        background: rgba(56,189,248,0.10); border: 1px solid rgba(56,189,248,0.25);
        color: #7dd3fc; font-size: 12px; font-weight: 600;
        letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 22px;
    }
    .ss-badge-dot {
        width: 6px; height: 6px; border-radius: 50%; background: #38bdf8;
        animation: blink 2s ease-in-out infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }

    .ss-h1 {
        font-size: clamp(36px, 5vw, 60px); font-weight: 800;
        line-height: 1.08; letter-spacing: -1.5px; color: #f1f5f9; margin-bottom: 6px;
    }
    .ss-h1-cyan  { color: #38bdf8; display: block; }
    .ss-h1-indigo {
        font-size: clamp(36px, 5vw, 60px); font-weight: 800;
        line-height: 1.08; letter-spacing: -1.5px;
        color: #a5b4fc; margin-bottom: 22px;
    }
    .ss-hero-desc {
        font-size: 16px; color: #94a3b8; line-height: 1.70; max-width: 460px; margin-bottom: 34px;
    }
    .ss-cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 36px; }
    .ss-btn-lg {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 13px 30px; border-radius: 10px;
        font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.2s;
    }
    .ss-btn-lg-blue {
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        color: #ffffff; border: none;
        box-shadow: 0 6px 20px rgba(14,165,233,0.30);
    }
    .ss-btn-lg-blue:hover { opacity: 0.92; transform: translateY(-2px); }
    .ss-btn-lg-outline {
        background: transparent; color: #94a3b8;
        border: 1px solid rgba(255,255,255,0.14);
    }
    .ss-btn-lg-outline:hover { color: #e2e8f0; border-color: rgba(255,255,255,0.30); }

    .ss-trust { display: flex; flex-wrap: wrap; gap: 18px; }
    .ss-trust-item { display: flex; align-items: center; gap: 6px; color: #7b94b7; font-size: 13px; }
    .ss-trust-check { color: #22c55e; }

    /* MOCKUP */
    .ss-mockup {
        background: #1e293b; border: 1px solid rgba(255,255,255,0.09);
        border-radius: 18px; overflow: hidden;
        box-shadow: 0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
        animation: float 6s ease-in-out infinite;
    }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    .ss-mockup-bar {
        padding: 11px 16px; display: flex; align-items: center; gap: 6px;
        border-bottom: 1px solid rgba(255,255,255,0.06); background: #172033;
    }
    .ss-dot { width: 9px; height: 9px; border-radius: 50%; }
    .ss-mockup-url { margin-left: 8px; color: #6e7e95; font-size: 11px; font-family: monospace; }
    .ss-mockup-body { padding: 18px; }
    .ss-mockup-title { font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 12px; }

    .ss-score-row {
        display: flex; align-items: center; justify-content: space-between;
        padding: 9px 12px; border-radius: 9px;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
        margin-bottom: 7px;
    }
    .ss-score-label { font-size: 12px; color: #64748b; }
    .ss-score-right { display: flex; align-items: center; gap: 10px; }
    .ss-bar-bg { width: 68px; height: 4px; border-radius: 10px; background: rgba(255,255,255,0.07); overflow: hidden; }
    .ss-bar-fill { height: 100%; border-radius: 10px; }
    .ss-score-pct { font-size: 12px; font-weight: 700; min-width: 32px; text-align: right; }

    .ss-result-box {
        margin-top: 14px; padding: 12px; border-radius: 10px;
        background: rgba(14,165,233,0.07); border: 1px solid rgba(14,165,233,0.18);
        display: flex; align-items: center; justify-content: space-between;
    }
    .ss-result-inner { display: flex; align-items: center; gap: 10px; }
    .ss-result-icon {
        width: 32px; height: 32px; border-radius: 8px;
        background: rgba(14,165,233,0.13); display: flex; align-items: center; justify-content: center; font-size: 15px;
    }
    .ss-result-label { font-size: 12px; font-weight: 700; color: #e2e8f0; }
    .ss-result-sub { font-size: 11px; color: #7b94b7; }
    .ss-result-chip {
        font-size: 11px; font-weight: 600; color: #38bdf8;
        background: rgba(56,189,248,0.10); padding: 4px 11px; border-radius: 20px;
    }

    /* STATS */
    .ss-stats {
        padding: 44px 32px;
        background: rgba(255,255,255,0.015);
        border-top: 1px solid rgba(255,255,255,0.05);
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .ss-stats-inner {
        max-width: 1200px; margin: 0 auto;
        display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; text-align: center;
    }
    @media (max-width: 700px) { .ss-stats-inner { grid-template-columns: repeat(2,1fr); } }
    .ss-stat-icon { font-size: 26px; margin-bottom: 8px; }
    .ss-stat-num { font-size: 38px; font-weight: 800; color: #38bdf8; letter-spacing: -1px; margin-bottom: 4px; }
    .ss-stat-label { font-size: 13px; color: #7b94b7; }

    /* FEATURES */
    .ss-section { padding: 88px 32px; max-width: 1200px; margin: 0 auto; }
    .ss-section-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #38bdf8; margin-bottom: 10px; }
    .ss-section-h2 { font-size: clamp(26px,4vw,40px); font-weight: 800; color: #f1f5f9; letter-spacing: -1px; margin-bottom: 10px; }
    .ss-section-desc { font-size: 15px; color: #7b94b7; max-width: 480px; margin-bottom: 40px; line-height: 1.65; }

    .ss-features-grid {
        display: grid; grid-template-columns: repeat(5,1fr); gap: 14px;
    }
    @media (max-width: 1100px) { .ss-features-grid { grid-template-columns: repeat(3,1fr); } }
    @media (max-width: 700px)  { .ss-features-grid { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 480px)  { .ss-features-grid { grid-template-columns: 1fr; } }

    .ss-feat-card {
        border-radius: 14px; padding: 22px 18px;
        transition: all 0.22s; border: 1px solid rgba(255,255,255,0.07);
        background: #1e293b;
    }
    .ss-feat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px rgba(0,0,0,0.35); border-color: rgba(255,255,255,0.14); }
    .ss-feat-icon {
        font-size: 22px; margin-bottom: 14px;
        width: 46px; height: 46px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
    }
    .ss-feat-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 8px; }
    .ss-feat-desc { font-size: 13px; color: #7b94b7; line-height: 1.6; }

    /* HOW IT WORKS */
    .ss-hiw-box {
        background: #1e293b; border: 1px solid rgba(255,255,255,0.07);
        border-radius: 20px; overflow: hidden;
        display: grid; grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 800px) { .ss-hiw-box { grid-template-columns: 1fr; } }
    .ss-hiw-left { padding: 44px; border-right: 1px solid rgba(255,255,255,0.05); }
    .ss-hiw-right { padding: 44px; }
    .ss-step { display: flex; gap: 14px; margin-bottom: 28px; }
    .ss-step:last-child { margin-bottom: 0; }
    .ss-step-num {
        width: 34px; height: 34px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 700; flex-shrink: 0;
    }
    .ss-step-title { font-size: 14px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px; }
    .ss-step-desc { font-size: 13px; color: #7b94b7; line-height: 1.55; }

    .ss-formats-label { font-size: 10px; color: #6e7e95; text-transform: uppercase; letter-spacing: 1px; text-align: center; margin-bottom: 12px; }
    .ss-formats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 20px; }
    .ss-format-chip { border-radius: 9px; padding: 11px 8px; text-align: center; border: 1px solid rgba(255,255,255,0.06); }
    .ss-format-ext { font-size: 11px; font-weight: 700; }

    .ss-ai-card { background: rgba(14,165,233,0.05); border: 1px solid rgba(14,165,233,0.14); border-radius: 14px; padding: 18px; }
    .ss-ai-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .ss-ai-icon { width: 34px; height: 34px; border-radius: 9px; background: rgba(14,165,233,0.13); display: flex; align-items: center; justify-content: center; font-size: 15px; }
    .ss-ai-name { font-size: 13px; font-weight: 700; color: #cbd5e1; }
    .ss-ai-sub { font-size: 11px; color: #6e7e95; }
    .ss-ai-tags { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
    .ss-ai-tag { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; }
    .ss-ai-dot { width: 5px; height: 5px; border-radius: 50%; background: #38bdf8; flex-shrink: 0; }

    /* TECH */
    .ss-tech { padding: 40px 32px; border-top: 1px solid rgba(255,255,255,0.04); }
    .ss-tech-label { text-align: center; font-size: 11px; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; color: #6e7e95; }
    .ss-tech-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 800px; margin: 0 auto; }
    .ss-tech-pill {
        display: flex; align-items: center; gap: 7px;
        padding: 7px 16px; border-radius: 100px;
        border: 1px solid rgba(255,255,255,0.07);
        font-size: 12px; font-weight: 500; color: #64748b;
    }
    .ss-tech-dot { width: 7px; height: 7px; border-radius: 50%; }

    /* CTA */
    .ss-cta-section { padding: 72px 32px 96px; }
    .ss-cta-box {
        max-width: 740px; margin: 0 auto; background: #1e293b;
        border: 1px solid rgba(255,255,255,0.09); border-radius: 24px;
        padding: 60px 44px; text-align: center; position: relative; overflow: hidden;
    }
    @media (max-width: 600px) { .ss-cta-box { padding: 36px 20px; } }
    .ss-cta-top-line {
        position: absolute; top: 0; left: 50%; transform: translateX(-50%);
        width: 55%; height: 2px;
        background: linear-gradient(90deg, transparent, #0ea5e9, transparent);
    }
    .ss-cta-h2 { font-size: clamp(24px,4vw,38px); font-weight: 800; color: #f1f5f9; letter-spacing: -1px; margin: 18px 0 12px; }
    .ss-cta-h2-cyan { color: #38bdf8; }
    .ss-cta-desc { font-size: 15px; color: #7b94b7; margin-bottom: 32px; line-height: 1.65; }
    .ss-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

    /* FOOTER */
    .ss-footer {
        padding: 22px 32px; border-top: 1px solid rgba(255,255,255,0.05);
        display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 14px;
    }
    .ss-footer-left { display: flex; align-items: center; gap: 10px; }
    .ss-footer-brand { font-size: 13px; font-weight: 600; color: #e2e8f0; }
    .ss-footer-sub { font-size: 11px; color: #1e293b; color: #6e7e95; }
    .ss-footer-right { display: flex; align-items: center; gap: 18px; }
    .ss-footer-link { font-size: 12px; color: #6e7e95; text-decoration: none; }
    .ss-footer-link:hover { color: #7b94b7; }
`;

function Counter({ target, suffix = "" }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    const done = useRef(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !done.current) {
                done.current = true;
                let v = 0;
                const step = target / 60;
                const t = setInterval(() => {
                    v += step;
                    if (v >= target) {
                        setVal(target);
                        clearInterval(t);
                    } else setVal(Math.floor(v));
                }, 16);
            }
        });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target]);
    return (
        <span ref={ref}>
            {val}
            {suffix}
        </span>
    );
}

const SCORES = [
    { label: "Match Score", pct: 87, color: "#38bdf8" },
    { label: "ATS Score", pct: 92, color: "#818cf8" },
    { label: "Keyword Score", pct: 74, color: "#34d399" },
    { label: "Semantic Score", pct: 83, color: "#fbbf24" },
];

const FEATURES = [
    {
        icon: "🎯",
        title: "Resume Matcher",
        desc: "Score your resume vs any JD with Match %, ATS Score, Semantic & Keyword analysis.",
        iconBg: "rgba(56,189,248,0.12)",
        border: "rgba(56,189,248,0.22)",
    },
    {
        icon: "📊",
        title: "Skill Analytics",
        desc: "Keyword gaps, ATS best practices, skill maps and strengths/weaknesses dashboard.",
        iconBg: "rgba(129,140,248,0.12)",
        border: "rgba(129,140,248,0.22)",
    },
    {
        icon: "✍️",
        title: "Cover Letter AI",
        desc: "Generate tailored cover letters with live editing and one-click PDF download.",
        iconBg: "rgba(52,211,153,0.12)",
        border: "rgba(52,211,153,0.22)",
    },
    {
        icon: "🧑‍💼",
        title: "Interview Prep",
        desc: "Tailored interview questions and AI answer suggestions for your target role.",
        iconBg: "rgba(251,191,36,0.12)",
        border: "rgba(251,191,36,0.22)",
    },
    {
        icon: "🧪",
        title: "Online Exam",
        desc: "AI-powered domain assessments to validate your expertise.",
        iconBg: "rgba(167,139,250,0.12)",
        border: "rgba(167,139,250,0.22)",
    },
];

const STEPS = [
    {
        num: 1,
        color: "#38bdf8",
        bg: "rgba(56,189,248,0.13)",
        title: "Upload Your Resume",
        desc: "Drop in PDF, DOCX, DOC, TXT, JSON or XML — we handle all formats.",
    },
    {
        num: 2,
        color: "#818cf8",
        bg: "rgba(129,140,248,0.13)",
        title: "Add Job Description",
        desc: "Paste or upload the JD. AI instantly begins parsing and matching.",
    },
    {
        num: 3,
        color: "#34d399",
        bg: "rgba(52,211,153,0.13)",
        title: "Get Full Analysis",
        desc: "Scores, gap analysis, ATS tips and a downloadable PDF report.",
    },
    {
        num: 4,
        color: "#fbbf24",
        bg: "rgba(251,191,36,0.13)",
        title: "Act on Insights",
        desc: "Generate your cover letter, prep for interviews, ace the exam.",
    },
];

const FORMATS = [
    { ext: "PDF", color: "#f87171", bg: "rgba(248,113,113,0.09)" },
    { ext: "DOCX", color: "#60a5fa", bg: "rgba(96,165,250,0.09)" },
    { ext: "DOC", color: "#93c5fd", bg: "rgba(147,197,253,0.09)" },
    { ext: "TXT", color: "#94a3b8", bg: "rgba(148,163,184,0.09)" },
    { ext: "JSON", color: "#fcd34d", bg: "rgba(252,211,77,0.09)" },
    { ext: "XML", color: "#6ee7b7", bg: "rgba(110,231,183,0.09)" },
];

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="SkillSync.ai — AI-Powered Career Intelligence" />
            <Toaster position="top-right" />
            <style>{styles}</style>

            <div className="ss-root">
                <div className="ss-bg" />
                <div className="ss-bg-glow" />

                {/* NAV */}
                <nav className="ss-nav">
                    <div className="ss-logo">
                        <div className="ss-logo-icon">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                            >
                                <path
                                    d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z"
                                    stroke="white"
                                    strokeWidth="1.5"
                                />
                                <circle cx="9" cy="9" r="2.5" fill="white" />
                            </svg>
                        </div>
                        <span className="ss-logo-text">
                            Skill<span>Sync</span>.ai
                        </span>
                    </div>
                    <div className="ss-nav-links">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="ss-btn-primary"
                            >
                                Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="ss-btn-ghost"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="ss-btn-primary"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="ss-content">
                    {/* HERO */}
                    <div className="ss-hero">
                        <div>
                            <div className="ss-badge">
                                <div className="ss-badge-dot" />
                                Powered by Gemini 2.5 Flash
                            </div>
                            <h1 className="ss-h1">
                                Your Career,
                                <span className="ss-h1-cyan">Supercharged</span>
                            </h1>
                            <p className="ss-h1-indigo">by AI Intelligence</p>
                            <p className="ss-hero-desc">
                                Scan & score your resume, generate tailored
                                cover letters, prep for interviews, and ace
                                AI-powered exams — all in one platform.
                            </p>
                            <div className="ss-cta-row">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="ss-btn-lg ss-btn-lg-blue"
                                    >
                                        Go to Dashboard
                                        <svg
                                            width="15"
                                            height="15"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("register")}
                                            className="ss-btn-lg ss-btn-lg-blue"
                                        >
                                            Start for Free
                                            <svg
                                                width="15"
                                                height="15"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                        <Link
                                            href={route("login")}
                                            className="ss-btn-lg ss-btn-lg-outline"
                                        >
                                            Log In
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="ss-trust">
                                {[
                                    "No credit card required",
                                    "PDF & DOCX support",
                                    "ATS-optimized",
                                ].map((t) => (
                                    <span key={t} className="ss-trust-item">
                                        <span className="ss-trust-check">
                                            ✓
                                        </span>{" "}
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Mockup */}
                        <div className="ss-hero-right">
                            <div className="ss-mockup">
                                <div className="ss-mockup-bar">
                                    <div
                                        className="ss-dot"
                                        style={{ background: "#f87171" }}
                                    />
                                    <div
                                        className="ss-dot"
                                        style={{ background: "#fbbf24" }}
                                    />
                                    <div
                                        className="ss-dot"
                                        style={{ background: "#4ade80" }}
                                    />
                                    <span className="ss-mockup-url">
                                        skillsync.ai/analytics
                                    </span>
                                </div>
                                <div className="ss-mockup-body">
                                    <div className="ss-mockup-title">
                                        📄 Resume Analysis — Senior Developer
                                        Role
                                    </div>
                                    {SCORES.map((s) => (
                                        <div
                                            key={s.label}
                                            className="ss-score-row"
                                        >
                                            <span className="ss-score-label">
                                                {s.label}
                                            </span>
                                            <div className="ss-score-right">
                                                <div className="ss-bar-bg">
                                                    <div
                                                        className="ss-bar-fill"
                                                        style={{
                                                            width: `${s.pct}%`,
                                                            background: s.color,
                                                        }}
                                                    />
                                                </div>
                                                <span
                                                    className="ss-score-pct"
                                                    style={{ color: s.color }}
                                                >
                                                    {s.pct}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="ss-result-box">
                                        <div className="ss-result-inner">
                                            <div className="ss-result-icon">
                                                🎯
                                            </div>
                                            <div>
                                                <div className="ss-result-label">
                                                    Strong Match
                                                </div>
                                                <div className="ss-result-sub">
                                                    3 keyword gaps found
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ss-result-chip">
                                            View Report
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="ss-stats">
                        <div className="ss-stats-inner">
                            {[
                                {
                                    n: 6,
                                    s: "+",
                                    label: "File Formats",
                                    icon: "📄",
                                },
                                {
                                    n: 5,
                                    s: "",
                                    label: "AI Modules",
                                    icon: "🤖",
                                },
                                {
                                    n: 99,
                                    s: "%",
                                    label: "ATS Pass Rate",
                                    icon: "✅",
                                },
                                {
                                    n: 10,
                                    s: "x",
                                    label: "Faster Prep",
                                    icon: "⚡",
                                },
                            ].map((st) => (
                                <div key={st.label}>
                                    <div className="ss-stat-icon">
                                        {st.icon}
                                    </div>
                                    <div className="ss-stat-num">
                                        <Counter target={st.n} suffix={st.s} />
                                    </div>
                                    <div className="ss-stat-label">
                                        {st.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FEATURES — now 5 including Online Exam */}
                    <div className="ss-section">
                        <div className="ss-section-label">
                            Everything You Need
                        </div>
                        <h2 className="ss-section-h2">
                            Five Powerful AI Modules
                        </h2>
                        <p className="ss-section-desc">
                            From resume analysis to certified skill exams — one
                            platform for your entire career journey.
                        </p>

                        <div className="ss-features-grid">
                            {FEATURES.map((f) => (
                                <div key={f.title} className="ss-feat-card">
                                    <div
                                        className="ss-feat-icon"
                                        style={{
                                            background: f.iconBg,
                                            border: `1px solid ${f.border}`,
                                        }}
                                    >
                                        {f.icon}
                                    </div>
                                    <div className="ss-feat-title">
                                        {f.title}
                                    </div>
                                    <div className="ss-feat-desc">{f.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HOW IT WORKS */}
                    <div className="ss-section" style={{ paddingTop: 0 }}>
                        <div className="ss-section-label">Simple Workflow</div>
                        <h2 className="ss-section-h2">From Upload to Offer</h2>
                        <p
                            className="ss-section-desc"
                            style={{ marginBottom: 28 }}
                        >
                            Four simple steps to get interview-ready.
                        </p>

                        <div className="ss-hiw-box">
                            <div className="ss-hiw-left">
                                {STEPS.map((s) => (
                                    <div key={s.num} className="ss-step">
                                        <div
                                            className="ss-step-num"
                                            style={{
                                                background: s.bg,
                                                color: s.color,
                                            }}
                                        >
                                            {s.num}
                                        </div>
                                        <div>
                                            <div className="ss-step-title">
                                                {s.title}
                                            </div>
                                            <div className="ss-step-desc">
                                                {s.desc}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="ss-hiw-right">
                                <div className="ss-formats-label">
                                    Supported Resume Formats
                                </div>
                                <div className="ss-formats-grid">
                                    {FORMATS.map((f) => (
                                        <div
                                            key={f.ext}
                                            className="ss-format-chip"
                                            style={{ background: f.bg }}
                                        >
                                            <div
                                                className="ss-format-ext"
                                                style={{ color: f.color }}
                                            >
                                                .{f.ext}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="ss-ai-card">
                                    <div className="ss-ai-header">
                                        <div className="ss-ai-icon">🧠</div>
                                        <div>
                                            <div className="ss-ai-name">
                                                Gemini 2.5 Flash
                                            </div>
                                            <div className="ss-ai-sub">
                                                Powered by Google AI
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ss-ai-tags">
                                        {[
                                            "Semantic Understanding",
                                            "Skill Extraction",
                                            "Keyword Gap Analysis",
                                            "ATS Optimization",
                                        ].map((tag) => (
                                            <div
                                                key={tag}
                                                className="ss-ai-tag"
                                            >
                                                <div className="ss-ai-dot" />
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TECH STACK */}
                    <div className="ss-tech">
                        <div className="ss-tech-label">Built with</div>
                        <div className="ss-tech-row">
                            {[
                                { name: "Laravel 12", color: "#f87171" },
                                { name: "React.js", color: "#67e8f9" },
                                { name: "Inertia.js", color: "#a78bfa" },
                                { name: "Tailwind CSS", color: "#38bdf8" },
                                { name: "MySQL", color: "#60a5fa" },
                                { name: "Gemini AI", color: "#93c5fd" },
                            ].map((t) => (
                                <div key={t.name} className="ss-tech-pill">
                                    <div
                                        className="ss-tech-dot"
                                        style={{ background: t.color }}
                                    />
                                    {t.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="ss-cta-section">
                        <div className="ss-cta-box">
                            <div className="ss-cta-top-line" />
                            <div
                                className="ss-badge"
                                style={{ display: "inline-flex" }}
                            >
                                <div className="ss-badge-dot" />
                                Start Your Journey Today
                            </div>
                            <h2 className="ss-cta-h2">
                                Land Your{" "}
                                <span className="ss-cta-h2-cyan">
                                    Dream Job
                                </span>
                                <br />
                                with AI Intelligence
                            </h2>
                            <p className="ss-cta-desc">
                                Smart resume matching, instant cover letters,
                                interview prep, and skill exams — all in one
                                platform.
                            </p>
                            <div className="ss-cta-btns">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="ss-btn-lg ss-btn-lg-blue"
                                    >
                                        Open Dashboard
                                        <svg
                                            width="15"
                                            height="15"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("register")}
                                            className="ss-btn-lg ss-btn-lg-blue"
                                        >
                                            Start for Free
                                            <svg
                                                width="15"
                                                height="15"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                        <Link
                                            href={route("login")}
                                            className="ss-btn-lg ss-btn-lg-outline"
                                        >
                                            Log In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="ss-footer">
                        <div className="ss-footer-left">
                            <div
                                className="ss-logo-icon"
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 8,
                                }}
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                >
                                    <path
                                        d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z"
                                        stroke="white"
                                        strokeWidth="1.5"
                                    />
                                    <circle
                                        cx="9"
                                        cy="9"
                                        r="2.5"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                            <div>
                                <div className="ss-footer-brand">
                                    SkillSync.ai
                                </div>
                                <div className="ss-footer-sub">
                                    AI-Powered Career Intelligence: By{" "}
                                    <a
                                        href="https://nirav-gajera.github.io"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Nirav Gajera
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="ss-footer-right">
                            <span className="ss-footer-link">
                                Laravel v12.0 · PHP v8.2
                            </span>
                            <span className="ss-footer-link">
                                <a
                                    href="https://github.com/nirav-gajera/skill-sync-ai/blob/main/LICENSE"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    MIT License
                                </a>
                            </span>
                            <a
                                href="https://github.com/nirav-gajera/skill-sync-ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ss-footer-link"
                            >
                                GitHub ↗
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
