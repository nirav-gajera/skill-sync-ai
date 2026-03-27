import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { KeyIcon, XMarkIcon } from '@heroicons/react/24/outline';

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .auth-form { font-family: 'Inter', sans-serif; }

    .auth-head-title {
        font-size: 20px; font-weight: 800; color: #f1f5f9;
        letter-spacing: -0.4px; margin-bottom: 4px; text-align: center;
    }
    .auth-head-sub {
        font-size: 13px; color: #6e7e95; text-align: center;
        line-height: 1.65; margin-bottom: 24px;
    }

    /* Icon box */
    .auth-icon-box {
        width: 52px; height: 52px; border-radius: 15px;
        background: rgba(56,189,248,0.10); border: 1px solid rgba(56,189,248,0.20);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
    }

    /* Field */
    .auth-field { margin-bottom: 18px; }
    .auth-label {
        display: block; font-size: 13px; font-weight: 600;
        color: #cbd5e1; margin-bottom: 7px;
    }
    .auth-label-hint {
        font-size: 11px; font-weight: 400; color: #6e7e95; margin-left: 6px;
    }
    .auth-input {
        width: 100%; padding: 11px 14px;
        background: #0f172a;
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 10px;
        color: #e2e8f0; font-size: 14px;
        font-family: 'Inter', sans-serif;
        outline: none; transition: border-color 0.18s, box-shadow 0.18s;
        box-sizing: border-box;
    }
    .auth-input::placeholder { color: #6e7e95; }
    .auth-input:focus {
        border-color: rgba(56,189,248,0.45);
        box-shadow: 0 0 0 3px rgba(56,189,248,0.08);
    }
    .auth-input-error { border-color: rgba(248,113,113,0.50) !important; }
    .auth-input-error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.08) !important; }
    .auth-error {
        font-size: 12px; color: #f87171; margin-top: 6px;
        display: flex; align-items: center; gap: 5px;
    }

    /* Email read-only chip */
    .auth-email-chip {
        display: flex; align-items: center; gap: 9px;
        padding: 10px 14px; border-radius: 10px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        font-size: 13px; color: #94a3b8; font-weight: 500;
    }
    .auth-email-chip-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #38bdf8; flex-shrink: 0;
    }

    /* Password grid */
    .auth-grid-2 {
        display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
    }
    @media (max-width: 480px) { .auth-grid-2 { grid-template-columns: 1fr; } }

    /* Password hint */
    .auth-hint { font-size: 11px; color: #6e7e95; margin-top: 5px; }

    /* Divider */
    .auth-divider-line {
        border: none; border-top: 1px solid rgba(255,255,255,0.14); margin: 24px 0;
    }

    /* Submit */
    .auth-btn-submit {
        width: 100%; padding: 12px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        color: #fff; font-size: 15px; font-weight: 700;
        border: none; border-radius: 11px; cursor: pointer;
        transition: all 0.18s; font-family: 'Inter', sans-serif;
        box-shadow: 0 4px 16px rgba(14,165,233,0.28);
        display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .auth-btn-submit:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
    .auth-btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    /* Spinner */
    @keyframes auth-spin { to { transform: rotate(360deg); } }
    .auth-spinner {
        width: 14px; height: 14px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.25);
        border-top-color: #fff;
        animation: auth-spin 0.7s linear infinite; flex-shrink: 0;
    }
`;

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <style>{styles}</style>
            <Head title="Reset Password" />

            <div className="auth-form">

                {/* Icon */}
                <div className="auth-icon-box">
                    <KeyIcon style={{ width: 24, height: 24, color: '#38bdf8' }} />
                </div>

                <div className="auth-head-title">Set a new password</div>
                <div className="auth-head-sub">
                    Choose a strong password for your SkillSync.ai account.
                </div>

                <form onSubmit={submit}>

                    {/* Email — read-only display */}
                    <div className="auth-field">
                        <label className="auth-label">
                            Email Address
                            <span className="auth-label-hint">— pre-filled from reset link</span>
                        </label>
                        <div className="auth-email-chip">
                            <div className="auth-email-chip-dot" />
                            {data.email}
                        </div>
                        {/* Hidden input so it's submitted */}
                        <input type="hidden" name="email" value={data.email} />
                        {errors.email && (
                            <div className="auth-error">
                                <XMarkIcon style={{ width: 13, height: 13 }} />
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Password + Confirm — side by side */}
                    <div className="auth-grid-2">
                        <div className="auth-field" style={{ marginBottom: 0 }}>
                            <label className="auth-label" htmlFor="password">New Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                autoFocus
                                className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                            />
                            {errors.password
                                ? <div className="auth-error"><XMarkIcon style={{ width: 13, height: 13 }} />{errors.password}</div>
                                : <div className="auth-hint">Min. 8 characters</div>
                            }
                        </div>

                        <div className="auth-field" style={{ marginBottom: 0 }}>
                            <label className="auth-label" htmlFor="password_confirmation">Confirm Password</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className={`auth-input ${errors.password_confirmation ? 'auth-input-error' : ''}`}
                            />
                            {errors.password_confirmation && (
                                <div className="auth-error">
                                    <XMarkIcon style={{ width: 13, height: 13 }} />
                                    {errors.password_confirmation}
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="auth-divider-line" />

                    {/* Submit */}
                    <button type="submit" disabled={processing} className="auth-btn-submit">
                        {processing
                            ? <><div className="auth-spinner" /> Resetting password…</>
                            : <><KeyIcon style={{ width: 15, height: 15 }} /> Reset Password</>
                        }
                    </button>

                </form>
            </div>
        </GuestLayout>
    );
}