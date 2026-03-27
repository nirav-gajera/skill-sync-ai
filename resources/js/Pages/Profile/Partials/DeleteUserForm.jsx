import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useRef, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.duf-section { font-family:'Inter',sans-serif; }

.duf-header { margin-bottom:20px; }
.duf-header-title    { font-size:16px; font-weight:800; color:#f87171; margin-bottom:4px; }
.duf-header-subtitle { font-size:13px; color:#6e7e95; line-height:1.6; }

.duf-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:20px 0; }

/* ── Warning box ── */
.duf-danger-box {
    background:rgba(248,113,113,0.06); border:1px solid rgba(248,113,113,0.18);
    border-radius:12px; padding:16px 18px; margin-bottom:20px;
    font-size:13px; color:#fca5a5; line-height:1.7;
}

/* ── Delete trigger button ── */
.duf-btn-delete {
    display:inline-flex; align-items:center; gap:8px;
    padding:10px 20px; border-radius:10px;
    background:linear-gradient(135deg,#dc2626,#b91c1c); border:none;
    color:#fff; font-size:13px; font-weight:700; cursor:pointer;
    transition:all 0.18s; box-shadow:0 4px 14px rgba(220,38,38,0.28);
    font-family:'Inter',sans-serif;
}
.duf-btn-delete:hover { opacity:0.9; transform:translateY(-1px); }

/* ── Custom dark modal (same pattern as Jobs/Resumes/etc.) ── */
.duf-modal-backdrop {
    position:fixed; inset:0; z-index:60;
    background:rgba(0,0,0,0.65); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; padding:16px;
}
.duf-modal {
    position:relative; z-index:61;
    background:#1e293b; border:1px solid rgba(255,255,255,0.09);
    border-radius:18px; padding:32px 28px;
    width:500px; max-width:90vw;
    box-shadow:0 24px 60px rgba(0,0,0,0.6);
    font-family:'Inter',sans-serif;
}
.duf-modal-close {
    position:absolute; top:14px; right:14px;
    width:28px; height:28px; border-radius:7px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
    color:#7b94b7; cursor:pointer;
    display:flex; align-items:center; justify-content:center; transition:all 0.18s;
}
.duf-modal-close:hover { background:rgba(255,255,255,0.09); color:#94a3b8; }

.duf-modal-icon {
    width:48px; height:48px; border-radius:14px;
    background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.22);
    display:flex; align-items:center; justify-content:center; margin-bottom:16px;
}
.duf-modal-title { font-size:17px; font-weight:700; color:#f1f5f9; margin-bottom:8px; }
.duf-modal-desc  { font-size:13px; color:#7b94b7; line-height:1.7; margin-bottom:22px; }

/* password input inside modal */
.duf-modal-field-label {
    display:block; font-size:11px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.7px; margin-bottom:7px;
}
.duf-modal input[type="password"] {
    width:100%; padding:10px 14px !important;
    background:#0f172a !important; border:1px solid rgba(255,255,255,0.09) !important;
    border-radius:10px !important; color:#e2e8f0 !important; font-size:13px !important;
    font-family:'Inter',sans-serif !important; outline:none !important;
    transition:all 0.18s !important; box-shadow:none !important;
}
.duf-modal input[type="password"]:focus {
    border-color:rgba(248,113,113,0.45) !important;
    box-shadow:0 0 0 3px rgba(248,113,113,0.08) !important;
}
.duf-modal input::placeholder { color:#6e7e95 !important; }

/* modal action buttons */
.duf-modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:22px; }
.duf-modal-cancel {
    padding:9px 20px; border-radius:9px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#64748b; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
    font-family:'Inter',sans-serif;
}
.duf-modal-cancel:hover { background:rgba(255,255,255,0.08); color:#94a3b8; }
.duf-modal-confirm {
    padding:9px 20px; border-radius:9px;
    background:linear-gradient(135deg,#dc2626,#b91c1c); border:none;
    color:#fff; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(220,38,38,0.28); font-family:'Inter',sans-serif;
}
.duf-modal-confirm:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
.duf-modal-confirm:disabled { opacity:0.50; cursor:not-allowed; transform:none; }
`;

const TOAST_OPTS = {
    style: {
        background: "#1e293b",
        color: "#e2e8f0",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        fontSize: "13px",
    },
    success: { iconTheme: { primary: "#22c55e", secondary: "#1e293b" } },
    error: { iconTheme: { primary: "#f87171", secondary: "#1e293b" } },
};

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({ password: "" });

    /* ── body scroll lock ── */
    useEffect(() => {
        document.body.style.overflow = confirmingUserDeletion ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [confirmingUserDeletion]);

    /* ── unchanged handlers ── */
    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                toast.success("Account deleted successfully");
            },
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`duf-section ${className}`}>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />

            {/* ── Header ── */}
            <div className="duf-header">
                <div className="duf-header-title">Delete Account</div>
                <div className="duf-header-subtitle">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </div>
            </div>

            <hr className="duf-divider" />

            {/* ── Warning box ── */}
            <div className="duf-danger-box">
                ⚠️ This action is irreversible. All your jobs, resumes,
                analytics, cover letters, interview preps, and exam history will
                be permanently erased.
            </div>

            {/* ── Delete trigger button ── */}
            <button className="duf-btn-delete" onClick={confirmUserDeletion}>
                <TrashIcon style={{ width: 15, height: 15 }} />
                Delete Account
            </button>

            {/* ── Custom dark modal (no Breeze Modal — full dark control) ── */}
            {confirmingUserDeletion && (
                <div className="duf-modal-backdrop" onClick={closeModal}>
                    <div
                        className="duf-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close X */}
                        <button
                            type="button"
                            className="duf-modal-close"
                            onClick={closeModal}
                        >
                            <XMarkIcon style={{ width: 14, height: 14 }} />
                        </button>

                        {/* Icon */}
                        <div className="duf-modal-icon">
                            <TrashIcon
                                style={{
                                    width: 22,
                                    height: 22,
                                    color: "#f87171",
                                }}
                            />
                        </div>

                        {/* Title + desc */}
                        <div className="duf-modal-title">
                            Delete your account?
                        </div>
                        <div className="duf-modal-desc">
                            Once your account is deleted, all of its resources
                            and data will be permanently deleted. Please enter
                            your password to confirm you would like to
                            permanently delete your account.
                        </div>

                        {/* Password + actions */}
                        <form onSubmit={deleteUser}>
                            <label
                                htmlFor="password"
                                className="duf-modal-field-label"
                            >
                                Confirm Password
                            </label>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Enter your password to confirm"
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />

                            <div className="duf-modal-actions">
                                <button
                                    type="button"
                                    className="duf-modal-cancel"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="duf-modal-confirm"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Deleting…"
                                        : "Yes, Delete Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
