import Layout from "../Dashboard/Components/Layout";
import UpdateProfileInformation from "./Partials/UpdateProfileInformationForm";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import { Head, usePage } from "@inertiajs/react";
import {
    UserCircleIcon,
    LockClosedIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.pe-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Page header ── */
.pe-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; flex-wrap:wrap; gap:12px; }
.pe-title    { font-size:22px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; }
.pe-subtitle { font-size:13px; color:#6e7e95; margin-top:3px; }

/* ── Section cards ── */
.pe-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:28px; margin-bottom:16px;
}

/* ── Section card header row (icon + label) ── */
.pe-card-row {
    display:flex; align-items:center; gap:12px; margin-bottom:22px;
}
.pe-card-icon {
    width:38px; height:38px; border-radius:10px;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.pe-card-icon-blue   { background:rgba(56,189,248,0.10);  border:1px solid rgba(56,189,248,0.20); color:#38bdf8; }
.pe-card-icon-green  { background:rgba(52,211,153,0.10);  border:1px solid rgba(52,211,153,0.20); color:#34d399; }
.pe-card-icon-red    { background:rgba(248,113,113,0.10); border:1px solid rgba(248,113,113,0.20); color:#f87171; }
.pe-card-section-title { font-size:13px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.6px; }
`;

export default function Edit() {
    const { mustVerifyEmail, status } = usePage().props;

    return (
        <Layout>
            <style>{styles}</style>
            <Head title="Profile" />

            <div className="pe-root">
                {/* ── Page header ── */}
                <div className="pe-header">
                    <div>
                        <div className="pe-title">Profile</div>
                        <div className="pe-subtitle">
                            Manage your account settings and security.
                        </div>
                    </div>
                </div>

                {/* ── Profile Information ── */}
                <div className="pe-card">
                    <div className="pe-card-row">
                        <div className="pe-card-icon pe-card-icon-blue">
                            <UserCircleIcon style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="pe-card-section-title">
                            Profile Information
                        </div>
                    </div>
                    <UpdateProfileInformation
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                {/* ── Update Password ── */}
                <div className="pe-card">
                    <div className="pe-card-row">
                        <div className="pe-card-icon pe-card-icon-green">
                            <LockClosedIcon style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="pe-card-section-title">
                            Password & Security
                        </div>
                    </div>
                    <UpdatePasswordForm />
                </div>

                {/* ── Delete Account ── */}
                <div className="pe-card">
                    <div className="pe-card-row">
                        <div className="pe-card-icon pe-card-icon-red">
                            <TrashIcon style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="pe-card-section-title">Danger Zone</div>
                    </div>
                    <DeleteUserForm />
                </div>
            </div>
        </Layout>
    );
}
