import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
    PowerIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

const topbarStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .ss-topbar {
        position: sticky;
        top: 0;
        z-index: 50;
        height: 67px;
        background: rgba(15,23,42,0.90);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        font-family: 'Inter', sans-serif;
    }

    /* Left side */
    .ss-topbar-left { display: flex; align-items: center; gap: 12px; }

    .ss-menu-btn {
        display: none;
        width: 34px; height: 34px; border-radius: 8px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.07);
        color: #64748b; cursor: pointer;
        align-items: center; justify-content: center;
        transition: all 0.18s;
    }
    .ss-menu-btn:hover { background: rgba(255,255,255,0.08); color: #94a3b8; }
    @media (max-width: 1023px) { .ss-menu-btn { display: flex; } }

    .ss-topbar-breadcrumb {
        display: flex; align-items: center; gap: 6px;
        font-size: 13px; color: #6e7e95;
    }
    .ss-topbar-breadcrumb-sep { color: #7793c1; }
    .ss-topbar-page-title {
        font-size: 15px; font-weight: 700; color: #e2e8f0;
    }

    /* Right side */
    .ss-topbar-right { display: flex; align-items: center; gap: 6px; }

    /* Icon button base */
    .ss-icon-btn {
        width: 34px; height: 34px; border-radius: 9px;
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        color: #64748b; cursor: pointer;
        transition: all 0.18s; position: relative;
    }
    .ss-icon-btn:hover { background: rgba(255,255,255,0.07); color: #94a3b8; border-color: rgba(255,255,255,0.12); }
    .ss-icon-btn-active { color: #38bdf8 !important; background: rgba(14,165,233,0.10) !important; border-color: rgba(14,165,233,0.20) !important; }

    /* Profile button */
    .ss-profile-btn {
        display: flex; align-items: center; gap: 8px;
        padding: 5px 10px 5px 5px; border-radius: 10px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        cursor: pointer; transition: all 0.18s;
        color: #64748b;
    }
    .ss-profile-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); color: #94a3b8; }
    .ss-profile-btn-active { color: #38bdf8 !important; background: rgba(14,165,233,0.10) !important; border-color: rgba(14,165,233,0.20) !important; }
    .ss-profile-avatar {
        width: 26px; height: 26px; border-radius: 7px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0;
    }
    .ss-profile-name { font-size: 13px; font-weight: 600; }

    /* Divider */
    .ss-topbar-divider {
        width: 1px; height: 20px;
        background: rgba(255,255,255,0.07); margin: 0 4px;
    }

    /* Logout — red tint on hover */
    .ss-icon-btn-logout:hover { background: rgba(239,68,68,0.10) !important; color: #f87171 !important; border-color: rgba(239,68,68,0.20) !important; }

    /* Notification dot */
    .ss-notif-dot {
        position: absolute; top: 6px; right: 6px;
        width: 6px; height: 6px; border-radius: 50%;
        background: #38bdf8; border: 1.5px solid #0f172a;
    }

    /* Modal backdrop */
    .ss-modal-backdrop {
        position: fixed; inset: 0; z-index: 60;
        background: rgba(0,0,0,0.60);
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(4px);
    }
    .ss-modal {
        position: relative; z-index: 61;
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 18px;
        padding: 32px 28px;
        width: 500px; max-width: 90vw;
        box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        font-family: 'Inter', sans-serif;
    }
    .ss-modal-close {
        position: absolute; top: 14px; right: 14px;
        width: 28px; height: 28px; border-radius: 7px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        color: #7b94b7; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.18s;
    }
    .ss-modal-close:hover { background: rgba(255,255,255,0.09); color: #94a3b8; }
    .ss-modal-icon {
        width: 48px; height: 48px; border-radius: 14px;
        background: rgba(239,68,68,0.12);
        border: 1px solid rgba(239,68,68,0.22);
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 16px;
    }
    .ss-modal-title { font-size: 17px; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; }
    .ss-modal-desc  { font-size: 14px; color: #7b94b7; line-height: 1.6; margin-bottom: 24px; }
    .ss-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
    .ss-modal-btn-cancel {
        padding: 9px 20px; border-radius: 9px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.09);
        color: #64748b; font-size: 14px; font-weight: 600;
        cursor: pointer; transition: all 0.18s;
    }
    .ss-modal-btn-cancel:hover { background: rgba(255,255,255,0.08); color: #94a3b8; }
    .ss-modal-btn-logout {
        padding: 9px 20px; border-radius: 9px;
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        border: none; color: #fff;
        font-size: 14px; font-weight: 600;
        cursor: pointer; transition: all 0.18s;
        box-shadow: 0 4px 14px rgba(220,38,38,0.30);
    }
    .ss-modal-btn-logout:hover { opacity: 0.9; transform: translateY(-1px); }
`;

// Map URL prefixes → readable page names
const PAGE_NAMES = {
    "/dashboard": "Dashboard",
    "/jobs": "Jobs",
    "/resumes": "Resumes",
    "/analytics": "Analytics",
    "/cover-letters": "Cover Letters",
    "/interview-preps": "Interview Prep",
    "/online-exams": "Online Exams",
    "/profile": "Profile",
};

function getPageTitle(url) {
    const path = url.split("?")[0];
    for (const [prefix, label] of Object.entries(PAGE_NAMES)) {
        if (path.startsWith(prefix)) return label;
    }
    return "SkillSync.ai";
}

export default function Topbar({ onMenuToggle }) {
    const page = usePage();
    const url = page.url ?? "";
    const user = page.props?.auth?.user ?? null;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const pageTitle = getPageTitle(url);
    const isProfileActive = url.startsWith("/profile");
    const appName = import.meta.env.VITE_APP_NAME || "skillSync.ai";

    const initials = user?.name
        ? user.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "U";

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    const handleLogout = () => {
        setIsModalOpen(false);
        router.post(
            "/logout",
            {},
            {
                onSuccess: () => toast.success("Logged out successfully."),
            },
        );
    };

    return (
        <>
            <style>{topbarStyles}</style>
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
                }}
            />

            <header className="ss-topbar">
                {/* Left */}
                <div className="ss-topbar-left">
                    {/* Mobile hamburger */}
                    <button
                        className="ss-menu-btn"
                        onClick={onMenuToggle}
                        aria-label="Toggle menu"
                    >
                        <Bars3Icon style={{ width: 17, height: 17 }} />
                    </button>

                    {/* Breadcrumb */}
                    <div className="ss-topbar-breadcrumb">
                        <span>{appName}</span>
                        <span className="ss-topbar-breadcrumb-sep">/</span>
                        <span className="ss-topbar-page-title">
                            {pageTitle}
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="ss-topbar-right">
                    {/* Notifications */}
                    <button
                        className="ss-icon-btn"
                        title="Notifications"
                        aria-label="Notifications"
                    >
                        <BellIcon style={{ width: 16, height: 16 }} />
                        <span className="ss-notif-dot" />
                    </button>

                    <div className="ss-topbar-divider" />

                    {/* Profile */}
                    <button
                        onClick={() => router.visit("/profile")}
                        className={`ss-profile-btn${isProfileActive ? " ss-profile-btn-active" : ""}`}
                        title="Profile"
                    >
                        <div className="ss-profile-avatar">{initials}</div>
                        <span className="ss-profile-name">
                            {user?.name ?? "Profile"}
                        </span>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="ss-icon-btn ss-icon-btn-logout"
                        title="Logout"
                        aria-label="Logout"
                    >
                        <PowerIcon style={{ width: 16, height: 16 }} />
                    </button>
                </div>
            </header>

            {/* Logout Confirmation Modal */}
            {isModalOpen && (
                <div
                    className="ss-modal-backdrop"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="ss-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="ss-modal-close"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <XMarkIcon style={{ width: 14, height: 14 }} />
                        </button>

                        <div className="ss-modal-icon">
                            <PowerIcon
                                style={{
                                    width: 22,
                                    height: 22,
                                    color: "#f87171",
                                }}
                            />
                        </div>

                        <div className="ss-modal-title">Sign out?</div>
                        <div className="ss-modal-desc">
                            You'll be signed out of your SkillSync.ai account.
                            Any unsaved work will be lost.
                        </div>

                        <div className="ss-modal-actions">
                            <button
                                className="ss-modal-btn-cancel"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="ss-modal-btn-logout"
                                onClick={handleLogout}
                            >
                                Yes, Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
