import Layout from '../Dashboard/Components/Layout';
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeftIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.cle-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Loading overlay ── */
.cle-loading {
    position:fixed; inset:0; z-index:50;
    background:rgba(0,0,0,0.55); backdrop-filter:blur(3px);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
}
.cle-spinner {
    width:52px; height:52px; border-radius:50%;
    border:4px solid rgba(255,255,255,0.10);
    border-top-color:#38bdf8;
    animation:cle-spin 0.9s linear infinite;
}
@keyframes cle-spin { to { transform:rotate(360deg); } }
.cle-spinner-label { font-size:13px; color:#94a3b8; font-weight:500; }

/* ── Header ── */
.cle-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
.cle-title    { font-size:22px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; }
.cle-subtitle { font-size:13px; color:#6e7e95; margin-top:3px; }

/* ── Shared card ── */
.cle-card {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; padding:28px; margin-bottom:16px;
}

/* ── Card section title ── */
.cle-card-heading {
    display:flex; align-items:center; gap:10px; margin-bottom:20px;
}
.cle-card-heading-icon {
    width:34px; height:34px; border-radius:9px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
}
.cle-card-heading-icon-blue  { background:rgba(56,189,248,0.10); border:1px solid rgba(56,189,248,0.20); color:#38bdf8; }
.cle-card-heading-icon-green { background:rgba(52,211,153,0.10); border:1px solid rgba(52,211,153,0.20); color:#34d399; }
.cle-card-heading-title { font-size:15px; font-weight:700; color:#f1f5f9; }

/* ── Section label ── */
.cle-label {
    display:block; font-size:11px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.7px; margin-bottom:8px;
}

/* ── Field spacing ── */
.cle-field { margin-bottom:20px; }

/* ── Dark inputs & textarea ── */
.cle-input, .cle-textarea {
    width:100%; padding:10px 14px;
    background:#0f172a; border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; color:#e2e8f0; font-size:13px;
    font-family:'Inter',sans-serif; outline:none; transition:all 0.18s;
}
.cle-input:focus, .cle-textarea:focus {
    border-color:rgba(56,189,248,0.40);
    box-shadow:0 0 0 3px rgba(56,189,248,0.08);
}
.cle-input::placeholder, .cle-textarea::placeholder { color:#6e7e95; }
.cle-textarea { resize:vertical; line-height:1.7; min-height:260px; }

/* ── Contact field rows (label + input side by side) ── */
.cle-contact-grid { display:flex; flex-direction:column; gap:8px; }
.cle-contact-row  { display:flex; align-items:center; gap:10px; }
.cle-contact-key  {
    width:90px; flex-shrink:0; padding:8px 10px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
    border-radius:8px; font-size:11px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.5px; text-align:center;
}
.cle-contact-val {
    flex:1; padding:9px 12px;
    background:#0f172a; border:1px solid rgba(255,255,255,0.09);
    border-radius:8px; color:#e2e8f0; font-size:13px;
    font-family:'Inter',sans-serif; outline:none; transition:all 0.18s;
}
.cle-contact-val:focus {
    border-color:rgba(56,189,248,0.40);
    box-shadow:0 0 0 3px rgba(56,189,248,0.08);
}

/* ── Cover letter text section ── */
.cle-letter-wrap {
    border:1px solid rgba(255,255,255,0.07); border-radius:12px;
    overflow:hidden; background:#0f172a;
}
.cle-letter-contacts {
    padding:14px 16px;
    border-bottom:1px solid rgba(255,255,255,0.06);
    background:rgba(255,255,255,0.02);
}
.cle-letter-body { padding:14px 16px; }
.cle-letter-textarea {
    width:100%; background:transparent; border:none; outline:none;
    color:#e2e8f0; font-size:13px; font-family:'Inter',sans-serif;
    line-height:1.8; resize:vertical; min-height:260px;
}
.cle-letter-textarea::placeholder { color:#6e7e95; }

/* ── Template grid (same as Create) ── */
.cle-template-grid {
    display:grid; grid-template-columns:repeat(4,1fr); gap:16px;
}
@media(max-width:900px){ .cle-template-grid { grid-template-columns:repeat(3,1fr); } }
@media(max-width:640px){ .cle-template-grid { grid-template-columns:repeat(2,1fr); } }

.cle-template-card {
    cursor:pointer; border-radius:12px; border:2px solid rgba(255,255,255,0.08);
    overflow:hidden; transition:all 0.20s;
}
.cle-template-card:hover {
    transform:scale(1.03);
    box-shadow:0 8px 24px rgba(0,0,0,0.35);
    border-color:rgba(255,255,255,0.18);
}
.cle-template-card-active {
    border-color:#3b82f6 !important;
    box-shadow:0 0 0 3px rgba(59,130,246,0.25), 0 8px 24px rgba(0,0,0,0.35) !important;
}
.cle-template-img-wrap {
    display:flex; align-items:center; justify-content:center;
    background:#0f172a; padding:12px; position:relative;
}
.cle-template-img {
    width:100%; object-fit:contain; border-radius:6px;
    box-shadow:0 2px 8px rgba(0,0,0,0.3); aspect-ratio:3/4;
}
.cle-template-overlay {
    position:absolute; inset:0;
    background:rgba(59,130,246,0.50);
    display:flex; align-items:center; justify-content:center;
    pointer-events:none; transition:all 0.3s;
}
.cle-template-info {
    padding:10px 12px; text-align:center;
    background:#1e293b; border-top:1px solid rgba(255,255,255,0.06);
}
.cle-template-name {
    font-size:12px; font-weight:600; color:#e2e8f0;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.cle-template-empty { font-size:13px; color:#6e7e95; }

/* ── Divider ── */
.cle-divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:22px 0; }

/* ── Actions ── */
.cle-actions { display:flex; align-items:center; gap:10px; }
.cle-btn-submit {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 22px; border-radius:10px;
    background:linear-gradient(135deg,#059669,#0ea5e9);
    color:#fff; font-size:13px; font-weight:700;
    border:none; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(5,150,105,0.25);
    font-family:'Inter',sans-serif;
}
.cle-btn-submit:hover { opacity:0.9; transform:translateY(-1px); }
.cle-btn-cancel {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 18px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#94a3b8; font-size:13px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.cle-btn-cancel:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }
.cle-btn-back {
    display:inline-flex; align-items:center; gap:7px;
    padding:10px 18px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#94a3b8; font-size:13px; font-weight:600;
    text-decoration:none; transition:all 0.18s;
}
.cle-btn-back:hover { background:rgba(255,255,255,0.09); color:#e2e8f0; }

/* ── Preview card ── */
.cle-preview-inner {
    background:#0f172a; border-radius:10px; padding:28px;
    min-height:300px; overflow:auto;
}
`;

const TOAST_OPTS = {
    style: {
        background: '#1e293b', color: '#e2e8f0',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px', fontSize: '13px',
    },
    success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
    error:   { iconTheme: { primary: '#f87171', secondary: '#1e293b' } },
};

export default function Edit({ coverLetter }) {
    /* ── unchanged data parsing ── */
    const aiData = typeof coverLetter.ai_result === 'string'
        ? JSON.parse(coverLetter.ai_result)
        : coverLetter.ai_result || {};

    const [loading,  setLoading]  = useState(false);
    const [formData, setFormData] = useState({
        company_name: coverLetter.company_name || '',
        ai_result:    { ...aiData },
        html:         coverLetter.html || '',
        template_id:  coverLetter.template_id || 0,
    });

    /* ── unchanged handlers ── */
    const updatePreview = async (updatedAi) => {
        setFormData(prev => ({ ...prev, ai_result: updatedAi }));
        try {
            const res = await axios.post(`/cover-letters/${coverLetter.id}/preview`, {
                company_name: formData.company_name,
                ai_result:    updatedAi,
                template_id:  formData.template_id,
            });
            setFormData(prev => ({ ...prev, html: res.data.html }));
        } catch (err) {
            console.error('Failed to update preview', err);
        }
    };

    const handleValueChange = (field, value) => {
        const updatedAi = { ...formData.ai_result, [field]: value };
        updatePreview(updatedAi);
    };

    /* company change does NOT call updatePreview — unchanged */
    const handleCompanyChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, company_name: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.company_name || formData.company_name === '') {
            toast.error('Please add company name.');
            return;
        }
        setLoading(true);
        Inertia.post(`/cover-letters/${coverLetter.id}/update`, {
            company_name: formData.company_name,
            ai_result:    formData.ai_result,
            template_id:  formData.template_id,
        }, {
            onSuccess: () => {
                setLoading(false);
                toast.success('Cover letter updated successfully');
            },
            onError: () => setLoading(false),
        });
    };

    /* template click — async, updates template_id + calls preview API */
    const handleTemplateClick = async (tplId) => {
        setFormData(prev => ({ ...prev, template_id: tplId }));
        try {
            const res = await axios.post(`/cover-letters/${coverLetter.id}/preview`, {
                company_name: formData.company_name,
                ai_result:    formData.ai_result,
                template_id:  tplId,
            });
            setFormData(prev => ({ ...prev, html: res.data.html }));
        } catch (err) {
            console.error('Failed to update preview', err);
        }
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Edit Cover Letter" />

            {/* ── Loading overlay ── */}
            {loading && (
                <div className="cle-loading">
                    <div className="cle-spinner" />
                    <span className="cle-spinner-label">Saving your cover letter…</span>
                </div>
            )}

            <div className="cle-root">

                {/* ── Header ── */}
                <div className="cle-header">
                    <div>
                        <div className="cle-title">Edit Cover Letter</div>
                        <div className="cle-subtitle">Update content, contact info, and template. Preview updates live.</div>
                    </div>
                    <Link href="/cover-letters" className="cle-btn-back">
                        <ArrowLeftIcon style={{ width: 14, height: 14 }} />
                        Back
                    </Link>
                </div>

                {/* ══════════════════════════════
                    FORM CARD
                ══════════════════════════════ */}
                <div className="cle-card">
                    <div className="cle-card-heading">
                        <div className="cle-card-heading-icon cle-card-heading-icon-blue">
                            <PencilIcon style={{ width: 16, height: 16 }} />
                        </div>
                        <div className="cle-card-heading-title">Edit Details</div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>

                        {/* ── Company Name ── */}
                        <div className="cle-field">
                            <label className="cle-label">Company Name</label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleCompanyChange}
                                placeholder="e.g. Google, Anthropic, Stripe…"
                                className="cle-input"
                            />
                        </div>

                        {/* ── Cover Letter Fields ── */}
                        <div className="cle-field">
                            <label className="cle-label">Cover Letter Content</label>
                            <div className="cle-letter-wrap">

                                {/* Contact fields */}
                                <div className="cle-letter-contacts">
                                    <div className="cle-contact-grid">
                                        {[
                                            { key: 'Name',     field: 'applicant_name' },
                                            { key: 'Email',    field: 'email'          },
                                            { key: 'Phone',    field: 'phone'          },
                                            { key: 'LinkedIn', field: 'linkedin'       },
                                        ].map(({ key, field }) => (
                                            <div key={field} className="cle-contact-row">
                                                <div className="cle-contact-key">{key}</div>
                                                <input
                                                    type="text"
                                                    value={formData.ai_result[field] || ''}
                                                    onChange={e => handleValueChange(field, e.target.value)}
                                                    className="cle-contact-val"
                                                    placeholder={`Enter ${key.toLowerCase()}…`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cover letter body textarea */}
                                <div className="cle-letter-body">
                                    <textarea
                                        value={formData.ai_result.cover_letter_html || ''}
                                        onChange={e => handleValueChange('cover_letter_html', e.target.value)}
                                        rows={12}
                                        className="cle-letter-textarea"
                                        placeholder="Cover letter body will appear here…"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Template Selection ── */}
                        <div className="cle-field">
                            <label className="cle-label">Choose Template</label>
                            {(!coverLetter.templates || coverLetter.templates.length === 0) ? (
                                <div className="cle-template-empty">No templates available.</div>
                            ) : (
                                <div className="cle-template-grid">
                                    {coverLetter.templates.map(tpl => (
                                        <div
                                            key={tpl.id}
                                            onClick={() => handleTemplateClick(tpl.id)}
                                            className={`cle-template-card${formData.template_id === tpl.id ? ' cle-template-card-active' : ''}`}
                                        >
                                            {/* Image + overlay */}
                                            <div className="cle-template-img-wrap">
                                                <img
                                                    src={tpl.preview}
                                                    alt={tpl.name}
                                                    className="cle-template-img"
                                                />
                                                {formData.template_id === tpl.id && (
                                                    <div className="cle-template-overlay">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            style={{ width: 40, height: 40, color: '#fff' }}
                                                            fill="none" viewBox="0 0 24 24"
                                                            stroke="currentColor" strokeWidth={2}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Name */}
                                            <div className="cle-template-info">
                                                <div className="cle-template-name">{tpl.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr className="cle-divider" />

                        {/* ── Actions ── */}
                        <div className="cle-actions">
                            <button type="submit" className="cle-btn-submit">
                                <PencilIcon style={{ width: 14, height: 14 }} />
                                Update Cover Letter
                            </button>
                            <Link href="/cover-letters" className="cle-btn-cancel">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>

                {/* ══════════════════════════════
                    LIVE PREVIEW CARD
                ══════════════════════════════ */}
                <div className="cle-card">
                    <div className="cle-card-heading">
                        <div className="cle-card-heading-icon cle-card-heading-icon-green">
                            <EyeIcon style={{ width: 16, height: 16 }} />
                        </div>
                        <div className="cle-card-heading-title">Live Preview</div>
                    </div>

                    {/* White preview area — cover letter renders in its own light context */}
                    <div className="cle-preview-inner">
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: formData.html }}
                        />
                    </div>
                </div>

            </div>
        </Layout>
    );
}