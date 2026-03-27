import { Link, usePage } from "@inertiajs/react";
import {
    HomeIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    ChartBarIcon,
    EnvelopeOpenIcon,
    PencilSquareIcon,
    ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";

const sidebarStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .ss-sidebar {
        position: fixed;
        top: 0; left: 0;
        height: 100vh;
        width: 256px;
        background: #0f172a;
        border-right: 1px solid rgba(255,255,255,0.06);
        display: flex;
        flex-direction: column;
        z-index: 40;
        transition: transform 0.3s ease;
        font-family: 'Inter', sans-serif;
    }
    @media (min-width: 1024px) {
        .ss-sidebar {
            position: sticky;
            transform: translateX(0) !important;
        }
    }
    .ss-sidebar-open   { transform: translateX(0); }
    .ss-sidebar-closed { transform: translateX(-100%); }

    .ss-sidebar-bg {
        position: absolute; inset: 0; pointer-events: none; z-index: 0;
        background:
            linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px);
        background-size: 40px 40px;
    }
    .ss-sidebar-glow {
        position: absolute; top: 0; left: 0; right: 0; height: 180px;
        pointer-events: none; z-index: 0;
        background: radial-gradient(ellipse 100% 60% at 50% 0%, rgba(56,189,248,0.07) 0%, transparent 70%);
    }

    /* Logo */
    .ss-sidebar-logo {
        position: relative; z-index: 1;
        padding: 18px 16px 16px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex; align-items: center; justify-content: space-between;
        text-decoration: none;
    }
    .ss-sidebar-logo-inner { display: flex; align-items: center; gap: 10px; }
    .ss-sidebar-logo-icon {
        width: 34px; height: 34px; border-radius: 9px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(14,165,233,0.25);
    }
    .ss-sidebar-logo-text {
        font-size: 17px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.4px;
        line-height: 1.2;
    }
    .ss-sidebar-logo-text span { color: #38bdf8; }
    .ss-sidebar-logo-sub { font-size: 10px; color: #6e7e95; font-weight: 500; }

    .ss-close-btn {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 7px; padding: 5px; color: #7b94b7; cursor: pointer;
        display: none; align-items: center; justify-content: center;
        transition: all 0.2s; line-height: 0;
    }
    .ss-close-btn:hover { background: rgba(255,255,255,0.08); color: #94a3b8; }
    @media (max-width: 1023px) { .ss-close-btn { display: flex; } }

    /* Nav */
    .ss-nav {
        position: relative; z-index: 1;
        flex: 1; padding: 12px 10px;
        overflow-y: auto;
        display: flex; flex-direction: column;
    }
    .ss-nav::-webkit-scrollbar { width: 3px; }
    .ss-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }

    .ss-nav-group { margin-bottom: 4px; }

    .ss-nav-section-label {
        font-size: 10px; font-weight: 600; letter-spacing: 1.2px;
        text-transform: uppercase; color: #6e7e95;
        padding: 10px 12px 5px;
    }

    .ss-nav-item {
        display: flex; align-items: center; gap: 10px;
        padding: 9px 12px; border-radius: 10px;
        text-decoration: none; font-size: 13px; font-weight: 500;
        color: #64748b; transition: all 0.18s;
        border: 1px solid transparent;
        position: relative; margin-bottom: 1px;
    }
    .ss-nav-item:hover {
        background: rgba(255,255,255,0.04);
        color: #cbd5e1;
        border-color: rgba(255,255,255,0.05);
    }
    .ss-nav-item-icon {
        width: 32px; height: 32px; border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: all 0.18s;
        background: rgba(255,255,255,0.03);
    }
    .ss-nav-item:hover .ss-nav-item-icon {
        background: rgba(255,255,255,0.06);
    }

    /* Active */
    .ss-nav-item-active {
        background: rgba(14,165,233,0.10) !important;
        color: #38bdf8 !important;
        border-color: rgba(14,165,233,0.18) !important;
    }
    .ss-nav-item-active .ss-nav-item-icon {
        background: rgba(14,165,233,0.15) !important;
    }
    .ss-nav-item-active::before {
        content: '';
        position: absolute; left: -1px; top: 22%; bottom: 22%;
        width: 3px; border-radius: 0 3px 3px 0;
        background: #38bdf8;
        box-shadow: 0 0 8px rgba(56,189,248,0.5);
    }

    /* Footer */
    .ss-sidebar-footer {
        position: relative; z-index: 1;
        padding: 12px 10px;
        border-top: 1px solid rgba(255,255,255,0.05);
    }
    .ss-sidebar-footer-inner {
        display: flex; align-items: center; gap: 10px;
        padding: 10px 12px; border-radius: 10px;
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.05);
    }
    .ss-footer-avatar {
        width: 30px; height: 30px; border-radius: 8px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
    }
    .ss-footer-text { flex: 1; min-width: 0; }
    .ss-footer-name  { font-size: 12px; font-weight: 600; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ss-footer-email { font-size: 10px; color: #6e7e95; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ss-footer-dot   { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; flex-shrink: 0; box-shadow: 0 0 6px rgba(34,197,94,0.5); }

    /* Overlay */
    .ss-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.55);
        z-index: 30; transition: opacity 0.3s, visibility 0.3s;
    }
    .ss-overlay-visible { opacity: 1; visibility: visible; }
    .ss-overlay-hidden  { opacity: 0; visibility: hidden; }
    @media (min-width: 1024px) { .ss-overlay { display: none !important; } }
`;

const menuGroups = [
    {
        label: "Main",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
            { name: "Jobs", href: "/jobs", icon: BriefcaseIcon },
            { name: "Resumes", href: "/resumes", icon: DocumentTextIcon },
        ],
    },
    {
        label: "AI Tools",
        items: [
            {
                name: "Analytics",
                href: "/analytics",
                icon: ChartBarIcon,
            },
            {
                name: "Cover Letters",
                href: "/cover-letters",
                icon: EnvelopeOpenIcon,
            },
            {
                name: "Interview Prep",
                href: "/interview-preps",
                icon: PencilSquareIcon,
            },
            {
                name: "Online Exams",
                href: "/online-exams",
                icon: ClipboardDocumentCheckIcon,
            },
        ],
    },
];

export default function Sidebar({ isOpen, onClose }) {
    // url lives on the page object, auth lives in props
    const page = usePage();
    const currentPath = (page.url ?? "")
        .split("?")[0]
        .replace(/\/scan\/?$/, "");
    const user = page.props?.auth?.user ?? null;

    const initials = user?.name
        ? user.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "U";

    return (
        <>
            <style>{sidebarStyles}</style>

            {/* Mobile overlay */}
            <div
                className={`ss-overlay ${isOpen ? "ss-overlay-visible" : "ss-overlay-hidden"}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`ss-sidebar ${isOpen ? "ss-sidebar-open" : "ss-sidebar-closed"}`}
            >
                <div className="ss-sidebar-bg" />
                <div className="ss-sidebar-glow" />

                {/* Logo */}
                <Link href="/" className="ss-sidebar-logo">
                    <div className="ss-sidebar-logo-inner">
                        <div className="ss-sidebar-logo-icon">
                            <svg
                                width="16"
                                height="16"
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
                        <div>
                            <div className="ss-sidebar-logo-text">
                                Skill<span>Sync</span>.ai
                            </div>
                            <div className="ss-sidebar-logo-sub">
                                Career Intelligence
                            </div>
                        </div>
                    </div>
                    <button
                        className="ss-close-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            onClose();
                        }}
                        aria-label="Close sidebar"
                    >
                        <XMarkIcon style={{ width: 15, height: 15 }} />
                    </button>
                </Link>

                {/* Nav groups */}
                <nav className="ss-nav">
                    {menuGroups.map((group) => (
                        <div key={group.label} className="ss-nav-group">
                            <div className="ss-nav-section-label">
                                {group.label}
                            </div>
                            {group.items.map((item) => {
                                const isActive = currentPath.startsWith(
                                    item.href,
                                );
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`ss-nav-item${isActive ? " ss-nav-item-active" : ""}`}
                                    >
                                        <div className="ss-nav-item-icon">
                                            <Icon
                                                style={{
                                                    width: 15,
                                                    height: 15,
                                                }}
                                            />
                                        </div>
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* User footer */}
                {user && (
                    <div className="ss-sidebar-footer">
                        <div className="ss-sidebar-footer-inner">
                            <div className="ss-footer-avatar">{initials}</div>
                            <div className="ss-footer-text">
                                <div className="ss-footer-name">
                                    {user.name}
                                </div>
                                <div className="ss-footer-email">
                                    {user.email}
                                </div>
                            </div>
                            <div className="ss-footer-dot" title="Online" />
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
