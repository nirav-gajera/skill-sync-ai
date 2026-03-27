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

    /* Two-col row */
    .auth-grid-2 {
        display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
    }
    @media (max-width: 480px) { .auth-grid-2 { grid-template-columns: 1fr; } }

    /* Submit */
    .auth-btn-submit {
        width: 100%; padding: 12px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        color: #fff; font-size: 15px; font-weight: 700;
        border: none; border-radius: 11px; cursor: pointer;
        transition: all 0.18s; font-family: 'Inter', sans-serif;
        box-shadow: 0 4px 16px rgba(14,165,233,0.28);
        display: flex; align-items: center; justify-content: center; gap: 8px;
        margin-top: 24px;
    }
    .auth-btn-submit:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
    .auth-btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    /* Terms hint */
    .auth-terms {
        font-size: 11px; color: #6e7e95; text-align: center; margin-top: 12px; line-height: 1.6;
    }

    /* Divider */
    .auth-divider {
        display: flex; align-items: center; gap: 12px; margin: 22px 0;
    }
    .auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.14); }
    .auth-divider-text { font-size: 12px; color: #6e7e95; white-space: nowrap; }

    /* Bottom link */
    .auth-bottom { text-align: center; font-size: 13px; color: #6e7e95; }
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

    /* Password strength hint */
    .auth-hint { font-size: 11px; color: #6e7e95; margin-top: 5px; }
`;

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <style>{styles}</style>
            <Head title="Register" />

            <div className="auth-form">
                <div className="auth-head-title">Create your account</div>
                <div className="auth-head-sub">Start your AI-powered career journey today</div>

                <form onSubmit={submit}>

                    {/* Full Name */}
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="John Doe"
                            autoComplete="name"
                            autoFocus
                            className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
                        />
                        {errors.name && <div className="auth-error">{errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div className="auth-field">
                        <label className="auth-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="username"
                            className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                        />
                        {errors.email && <div className="auth-error">{errors.email}</div>}
                    </div>

                    {/* Password + Confirm — side by side */}
                    <div className="auth-grid-2">
                        <div className="auth-field" style={{ marginBottom: 0 }}>
                            <label className="auth-label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                            />
                            {errors.password
                                ? <div className="auth-error">{errors.password}</div>
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
                                <div className="auth-error">{errors.password_confirmation}</div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={processing} className="auth-btn-submit">
                        {processing
                            ? <><div className="auth-spinner" /> Creating account…</>
                            : 'Create Account'
                        }
                    </button>

                    <div className="auth-terms">
                        By registering, you agree to our Terms of Service and Privacy Policy.
                    </div>

                </form>

                {/* Divider */}
                <div className="auth-divider">
                    <div className="auth-divider-line" />
                    <span className="auth-divider-text">Already have an account?</span>
                    <div className="auth-divider-line" />
                </div>

                {/* Login link */}
                <div className="auth-bottom">
                    <Link href={route('login')}>Sign in instead →</Link>
                </div>
            </div>
        </GuestLayout>
    );
}