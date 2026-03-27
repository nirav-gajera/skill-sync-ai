import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { EnvelopeIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

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

    /* Status banner */
    .auth-status {
        padding: 12px 14px; border-radius: 10px; margin-bottom: 20px;
        background: rgba(52,211,153,0.10); border: 1px solid rgba(52,211,153,0.22);
        color: #6ee7b7; font-size: 13px; font-weight: 500; line-height: 1.55;
        display: flex; align-items: flex-start; gap: 10px;
    }
    .auth-status-icon { flex-shrink: 0; margin-top: 1px; }

    /* Icon box */
    .auth-icon-box {
        width: 52px; height: 52px; border-radius: 15px;
        background: rgba(56,189,248,0.10); border: 1px solid rgba(56,189,248,0.20);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
    }

    /* Field */
    .auth-field { margin-bottom: 20px; }
    .auth-label {
        display: block; font-size: 13px; font-weight: 600;
        color: #cbd5e1; margin-bottom: 7px;
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
    .auth-error { font-size: 12px; color: #f87171; margin-top: 6px; }

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

    /* Back link */
    .auth-back {
        display: flex; align-items: center; justify-content: center;
        gap: 6px; margin-top: 20px;
        font-size: 13px; font-weight: 600; color: #6e7e95;
        text-decoration: none; transition: color 0.15s;
    }
    .auth-back:hover { color: #94a3b8; }

    /* Spinner */
    @keyframes auth-spin { to { transform: rotate(360deg); } }
    .auth-spinner {
        width: 14px; height: 14px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.25);
        border-top-color: #fff;
        animation: auth-spin 0.7s linear infinite; flex-shrink: 0;
    }
`;

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <style>{styles}</style>
            <Head title="Forgot Password" />

            <div className="auth-form">

                {/* Icon */}
                <div className="auth-icon-box">
                    <EnvelopeIcon style={{ width: 24, height: 24, color: '#38bdf8' }} />
                </div>

                <div className="auth-head-title">Forgot your password?</div>
                <div className="auth-head-sub">
                    No problem. Enter your email and we'll send you a reset link to choose a new one.
                </div>

                {/* Success status */}
                {status && (
                    <div className="auth-status">
                        <span className="auth-status-icon">✓</span>
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="you@example.com"
                            autoFocus
                            className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                        />
                        {errors.email && <div className="auth-error">{errors.email}</div>}
                    </div>

                    <button type="submit" disabled={processing} className="auth-btn-submit">
                        {processing
                            ? <><div className="auth-spinner" /> Sending link…</>
                            : <><EnvelopeIcon style={{ width: 15, height: 15 }} /> Send Reset Link</>
                        }
                    </button>
                </form>

                <Link href={route('login')} className="auth-back">
                    <ChevronLeftIcon style={{ width: 14, height: 14 }} />
                    Back to sign in
                </Link>
            </div>
        </GuestLayout>
    );
}