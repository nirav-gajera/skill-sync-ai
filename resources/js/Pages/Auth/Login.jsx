import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .auth-form { font-family: 'Inter', sans-serif; }

    .auth-head-title {
        font-size: 20px; font-weight: 800; color: #f1f5f9;
        letter-spacing: -0.4px; margin-bottom: 4px; text-align: center;
    }
    .auth-head-sub {
        font-size: 13px; color: #6e7e95;
        text-align: center; margin-bottom: 28px;
    }

    /* Status banner */
    .auth-status {
        padding: 10px 14px; border-radius: 9px; margin-bottom: 20px;
        background: rgba(52,211,153,0.10); border: 1px solid rgba(52,211,153,0.22);
        color: #6ee7b7; font-size: 13px; font-weight: 500;
    }

    /* Field */
    .auth-field { margin-bottom: 18px; }
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

    /* Remember + forgot row */
    .auth-row {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 22px; gap: 8px;
    }
    .auth-remember {
        display: flex; align-items: center; gap: 8px;
        font-size: 13px; color: #94a3b8; cursor: pointer;
        user-select: none;
    }
    .auth-checkbox {
        width: 16px; height: 16px; border-radius: 5px;
        accent-color: #0ea5e9; cursor: pointer;
        border: 1px solid rgba(255,255,255,0.15);
        background: #0f172a;
    }
    .auth-forgot {
        font-size: 13px; font-weight: 600; color: #38bdf8;
        text-decoration: none; transition: color 0.15s;
    }
    .auth-forgot:hover { color: #7dd3fc; }

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

    /* Divider */
    .auth-divider {
        display: flex; align-items: center; gap: 12px;
        margin: 22px 0;
    }
    .auth-divider-line {
        flex: 1; height: 1px; background: rgba(255,255,255,0.14);
    }
    .auth-divider-text { font-size: 12px; color: #6e7e95; white-space: nowrap; }

    /* Bottom link */
    .auth-bottom {
        text-align: center; font-size: 13px; color: #6e7e95;
    }
    .auth-bottom a {
        color: #38bdf8; font-weight: 600; text-decoration: none; transition: color 0.15s;
    }
    .auth-bottom a:hover { color: #7dd3fc; }

    /* Spinner */
    @keyframes auth-spin { to { transform: rotate(360deg); } }
    .auth-spinner {
        width: 14px; height: 14px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.25);
        border-top-color: #fff;
        animation: auth-spin 0.7s linear infinite; flex-shrink: 0;
    }
`;

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <style>{styles}</style>
            <Head title="Log in" />

            <div className="auth-form">
                <div className="auth-head-title">Welcome back</div>
                <div className="auth-head-sub">Sign in to your SkillSync.ai account</div>

                {status && <div className="auth-status">{status}</div>}

                <form onSubmit={submit}>
                    {/* Email */}
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="username"
                            autoFocus
                            className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                        />
                        {errors.email && <div className="auth-error">{errors.email}</div>}
                    </div>

                    {/* Password */}
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                        />
                        {errors.password && <div className="auth-error">{errors.password}</div>}
                    </div>

                    {/* Remember + Forgot */}
                    <div className="auth-row">
                        <label className="auth-remember">
                            <input
                                type="checkbox"
                                className="auth-checkbox"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                            />
                            Remember me
                        </label>
                        {canResetPassword && (
                            <Link href={route('password.request')} className="auth-forgot">
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={processing} className="auth-btn-submit">
                        {processing
                            ? <><div className="auth-spinner" /> Signing in…</>
                            : 'Sign in'
                        }
                    </button>
                </form>

                {/* Divider */}
                <div className="auth-divider">
                    <div className="auth-divider-line" />
                    <span className="auth-divider-text">Don't have an account?</span>
                    <div className="auth-divider-line" />
                </div>

                {/* Register link */}
                <div className="auth-bottom">
                    <Link href={route('register')}>Create a free account →</Link>
                </div>
            </div>
        </GuestLayout>
    );
}