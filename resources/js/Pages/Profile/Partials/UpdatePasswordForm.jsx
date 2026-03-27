import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.upwf-section { font-family:'Inter',sans-serif; }

.upwf-header { margin-bottom:24px; }
.upwf-header-title    { font-size:16px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.upwf-header-subtitle { font-size:13px; color:#6e7e95; line-height:1.6; }

/* ── Fields ── */
.upwf-field { margin-bottom:18px; }
.upwf-label {
    display:block; font-size:11px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.7px; margin-bottom:7px;
}

/* override TextInput inside this section */
.upwf-section input[type="text"],
.upwf-section input[type="email"],
.upwf-section input[type="password"] {
    width:100%; padding:10px 14px !important;
    background:#0f172a !important; border:1px solid rgba(255,255,255,0.09) !important;
    border-radius:10px !important; color:#e2e8f0 !important; font-size:13px !important;
    font-family:'Inter',sans-serif !important; outline:none !important;
    transition:all 0.18s !important; box-shadow:none !important;
}
.upwf-section input:focus {
    border-color:rgba(56,189,248,0.40) !important;
    box-shadow:0 0 0 3px rgba(56,189,248,0.08) !important;
}
.upwf-section input::placeholder { color:#6e7e95 !important; }

/* ── Actions row ── */
.upwf-actions { display:flex; align-items:center; gap:14px; margin-top:6px; }
.upwf-btn-save {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 22px; border-radius:10px;
    background:linear-gradient(135deg,#059669,#0ea5e9);
    color:#fff; font-size:13px; font-weight:700;
    border:none; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(5,150,105,0.25);
    font-family:'Inter',sans-serif;
}
.upwf-btn-save:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
.upwf-btn-save:disabled { opacity:0.50; cursor:not-allowed; transform:none; }
.upwf-saved-label { font-size:13px; color:#34d399; font-weight:600; }

.upwf-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:20px 0; }

/* ── Password strength hint ── */
.upwf-hint {
    background:rgba(56,189,248,0.07); border:1px solid rgba(56,189,248,0.18);
    border-radius:10px; padding:12px 14px; margin-bottom:18px;
    font-size:12px; color:#7dd3fc; line-height:1.6;
}
`;

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    /* ── unchanged submit logic ── */
    const updatePassword = (e) => {
        e.preventDefault();
        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`upwf-section ${className}`}>
            <style>{styles}</style>

            {/* ── Header ── */}
            <div className="upwf-header">
                <div className="upwf-header-title">Update Password</div>
                <div className="upwf-header-subtitle">
                    Ensure your account is using a long, random password to stay
                    secure.
                </div>
            </div>

            <hr className="upwf-divider" />

            {/* ── Password tip ── */}
            <div className="upwf-hint">
                Use at least 8 characters with a mix of uppercase, lowercase,
                numbers, and symbols for a strong password.
            </div>

            <form onSubmit={updatePassword}>
                {/* Current Password */}
                <div className="upwf-field">
                    <label htmlFor="current_password" className="upwf-label">
                        Current Password
                    </label>
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />
                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                {/* New Password */}
                <div className="upwf-field">
                    <label htmlFor="password" className="upwf-label">
                        New Password
                    </label>
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password */}
                <div className="upwf-field">
                    <label
                        htmlFor="password_confirmation"
                        className="upwf-label"
                    >
                        Confirm Password
                    </label>
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <hr className="upwf-divider" />

                {/* ── Actions ── */}
                <div className="upwf-actions">
                    <button
                        type="submit"
                        className="upwf-btn-save"
                        disabled={processing}
                    >
                        {processing ? "Updating…" : "Update Password"}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <span className="upwf-saved-label">✓ Saved</span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
