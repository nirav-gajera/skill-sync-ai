import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.upf-section { font-family:'Inter',sans-serif; }

.upf-header { margin-bottom:24px; }
.upf-header-title    { font-size:16px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
.upf-header-subtitle { font-size:13px; color:#6e7e95; line-height:1.6; }

/* ── Fields ── */
.upf-field { margin-bottom:18px; }
.upf-label {
    display:block; font-size:11px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.7px; margin-bottom:7px;
}

/* override Jetstream/Breeze TextInput inside this section */
.upf-section input[type="text"],
.upf-section input[type="email"],
.upf-section input[type="password"] {
    width:100%; padding:10px 14px !important;
    background:#0f172a !important; border:1px solid rgba(255,255,255,0.09) !important;
    border-radius:10px !important; color:#e2e8f0 !important; font-size:13px !important;
    font-family:'Inter',sans-serif !important; outline:none !important;
    transition:all 0.18s !important; box-shadow:none !important;
}
.upf-section input:focus {
    border-color:rgba(56,189,248,0.40) !important;
    box-shadow:0 0 0 3px rgba(56,189,248,0.08) !important;
}
.upf-section input::placeholder { color:#6e7e95 !important; }

/* ── Verify email notice ── */
.upf-verify-box {
    background:rgba(251,191,36,0.07); border:1px solid rgba(251,191,36,0.20);
    border-radius:10px; padding:12px 14px; margin-top:14px;
    font-size:13px; color:#fbbf24; line-height:1.6;
}
.upf-verify-link {
    color:#38bdf8; text-decoration:underline; cursor:pointer;
    background:none; border:none; font-size:13px; padding:0; margin-left:4px;
    font-family:'Inter',sans-serif;
}
.upf-verify-link:hover { color:#7dd3fc; }
.upf-verify-sent {
    font-size:12px; font-weight:600; color:#34d399; margin-top:8px;
}

/* ── Actions row ── */
.upf-actions { display:flex; align-items:center; gap:14px; margin-top:6px; }
.upf-btn-save {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 22px; border-radius:10px;
    background:linear-gradient(135deg,#0ea5e9,#6366f1);
    color:#fff; font-size:13px; font-weight:700;
    border:none; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(14,165,233,0.25);
    font-family:'Inter',sans-serif;
}
.upf-btn-save:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
.upf-btn-save:disabled { opacity:0.50; cursor:not-allowed; transform:none; }
.upf-saved-label { font-size:13px; color:#34d399; font-weight:600; }

.upf-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:20px 0; }
`;

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name:  user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <section className={`upf-section ${className}`}>
            <style>{styles}</style>

            {/* ── Header ── */}
            <div className="upf-header">
                <div className="upf-header-title">Profile Information</div>
                <div className="upf-header-subtitle">
                    Update your account's profile information and email address.
                </div>
            </div>

            <hr className="upf-divider" />

            <form onSubmit={submit}>

                {/* Name */}
                <div className="upf-field">
                    <label htmlFor="name" className="upf-label">Name</label>
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Email */}
                <div className="upf-field">
                    <label htmlFor="email" className="upf-label">Email</label>
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* ── Email verification notice ── */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="upf-verify-box">
                        Your email address is unverified.
                        <Link
                            href={route("verification.send")}
                            method="post"
                            as="button"
                            className="upf-verify-link"
                        >
                            Click here to re-send the verification email.
                        </Link>
                        {status === "verification-link-sent" && (
                            <div className="upf-verify-sent">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <hr className="upf-divider" />

                {/* ── Actions ── */}
                <div className="upf-actions">
                    <button
                        type="submit"
                        className="upf-btn-save"
                        disabled={processing}
                    >
                        {processing ? 'Saving…' : 'Save Changes'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <span className="upf-saved-label">✓ Saved</span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}