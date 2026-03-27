import Layout from "../Dashboard/Components/Layout";
import { useForm, Link, Head } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import {
    PaperClipIcon,
    ArrowPathIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .re-root {
        font-family: 'Inter', sans-serif;
        padding: 28px 28px 60px;
        background: #0f172a;
        min-height: 100%;
    }

    /* ── Header ── */
    .re-header {
        display: flex; align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
    }
    .re-title    { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
    .re-subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }

    .re-back {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; font-weight: 600; color: #38bdf8;
        text-decoration: none; padding: 7px 14px; border-radius: 9px;
        background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.18);
        transition: all 0.18s; white-space: nowrap;
    }
    .re-back:hover { background: rgba(56,189,248,0.15); }

    /* ── Card ── */
    .re-card {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 32px;
        width: 100%;
        box-sizing: border-box;
    }

    /* ── Field ── */
    .re-field { margin-bottom: 24px; }
    .re-label {
        display: block; margin-bottom: 8px;
        font-size: 13px; font-weight: 600; color: #cbd5e1;
    }
    .re-label-hint {
        font-size: 11px; font-weight: 400; color: #6e7e95;
        margin-left: 6px;
    }
    .re-input {
        width: 100%; padding: 11px 14px;
        background: #0f172a;
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 10px;
        color: #e2e8f0; font-size: 14px;
        font-family: 'Inter', sans-serif;
        outline: none; transition: border-color 0.18s, box-shadow 0.18s;
        box-sizing: border-box;
    }
    .re-input::placeholder { color: #6e7e95; }
    .re-input:focus {
        border-color: rgba(56,189,248,0.45);
        box-shadow: 0 0 0 3px rgba(56,189,248,0.08);
    }
    .re-input-error { border-color: rgba(248,113,113,0.55) !important; }
    .re-input-error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.08) !important; }

    /* ── Current file banner ── */
    .re-current-file {
        display: flex; align-items: center; gap: 10px;
        padding: 11px 14px; border-radius: 10px;
        background: rgba(129,140,248,0.07);
        border: 1px solid rgba(129,140,248,0.18);
        margin-bottom: 14px;
    }
    .re-current-file-icon {
        width: 32px; height: 32px; border-radius: 8px;
        background: rgba(129,140,248,0.14);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .re-current-file-label { font-size: 11px; color: #6e7e95; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; }
    .re-current-file-name  { font-size: 13px; font-weight: 500; color: #a5b4fc; }
    .re-current-file-link {
        display: inline-flex; align-items: center; gap: 5px;
        font-size: 12px; font-weight: 600; color: #818cf8;
        text-decoration: none; margin-left: auto; flex-shrink: 0;
        padding: 5px 10px; border-radius: 7px;
        background: rgba(129,140,248,0.10); border: 1px solid rgba(129,140,248,0.18);
        transition: all 0.18s;
    }
    .re-current-file-link:hover { background: rgba(129,140,248,0.18); }

    /* ── Drop zone ── */
    .re-dropzone {
        width: 100%; box-sizing: border-box;
        border-radius: 14px; padding: 36px 24px;
        text-align: center; cursor: pointer;
        transition: all 0.22s;
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='14' ry='14' stroke='rgba(255,255,255,0.12)' stroke-width='2' stroke-dasharray='8%2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
        background-color: rgba(255,255,255,0.01);
    }
    .re-dropzone:hover,
    .re-dropzone-drag {
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='14' ry='14' stroke='rgba(56%2c189%2c248%2c0.50)' stroke-width='2' stroke-dasharray='8%2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
        background-color: rgba(56,189,248,0.04);
    }
    .re-dropzone-error {
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='14' ry='14' stroke='rgba(248%2c113%2c113%2c0.45)' stroke-width='2' stroke-dasharray='8%2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
        background-color: rgba(248,113,113,0.03);
    }

    .re-drop-icon-wrap {
        width: 52px; height: 52px; border-radius: 14px;
        background: rgba(56,189,248,0.10);
        border: 1px solid rgba(56,189,248,0.22);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 14px; transition: all 0.22s;
    }
    .re-dropzone:hover .re-drop-icon-wrap,
    .re-dropzone-drag .re-drop-icon-wrap {
        background: rgba(56,189,248,0.16); transform: scale(1.06);
    }

    .re-drop-cta  { font-size: 14px; font-weight: 600; color: #cbd5e1; margin-bottom: 5px; }
    .re-drop-cta span { color: #38bdf8; }
    .re-drop-hint { font-size: 12px; color: #6e7e95; margin-bottom: 14px; }

    .re-formats { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
    .re-fmt-chip { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 6px; }

    /* ── Selected file chip ── */
    .re-file-chip {
        display: flex; align-items: center; gap: 9px;
        padding: 10px 14px; border-radius: 10px;
        background: rgba(56,189,248,0.07);
        border: 1px solid rgba(56,189,248,0.18);
        margin-top: 12px; width: 100%; box-sizing: border-box;
    }
    .re-file-chip-icon { color: #38bdf8; flex-shrink: 0; }
    .re-file-chip-name {
        flex: 1; font-size: 13px; font-weight: 500; color: #7dd3fc;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .re-file-chip-size { font-size: 11px; color: #6e7e95; flex-shrink: 0; }
    .re-file-chip-remove {
        background: none; border: none; color: #64748b;
        cursor: pointer; padding: 3px; display: flex; align-items: center;
        border-radius: 5px; transition: color 0.15s; flex-shrink: 0;
    }
    .re-file-chip-remove:hover { color: #f87171; }

    /* ── Error ── */
    .re-error {
        font-size: 12px; color: #f87171;
        margin-top: 7px; display: flex; align-items: center; gap: 5px;
    }

    /* ── Divider ── */
    .re-divider {
        border: none;
        border-top: 1px solid rgba(255,255,255,0.06);
        margin: 28px 0;
    }

    /* ── Actions ── */
    .re-actions { display: flex; align-items: center; gap: 10px; }

    .re-btn-submit {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 11px 28px; border-radius: 10px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        color: #fff; font-size: 14px; font-weight: 700;
        border: none; cursor: pointer; transition: all 0.18s;
        box-shadow: 0 4px 14px rgba(14,165,233,0.25);
        font-family: 'Inter', sans-serif;
    }
    .re-btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .re-btn-submit:disabled { opacity: 0.50; cursor: not-allowed; transform: none; }

    .re-btn-cancel {
        display: inline-flex; align-items: center;
        padding: 11px 22px; border-radius: 10px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.09);
        color: #94a3b8; font-size: 14px; font-weight: 600;
        text-decoration: none; transition: all 0.18s;
    }
    .re-btn-cancel:hover { background: rgba(255,255,255,0.07); color: #cbd5e1; }

    /* ── Spinner ── */
    @keyframes re-spin { to { transform: rotate(360deg); } }
    .re-spinner {
        width: 14px; height: 14px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.25);
        border-top-color: #fff;
        animation: re-spin 0.7s linear infinite; flex-shrink: 0;
    }
`;

const FORMATS = [
    { ext: "PDF", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
    { ext: "DOCX", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
    { ext: "DOC", color: "#93c5fd", bg: "rgba(147,197,253,0.12)" },
    { ext: "TXT", color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
    { ext: "JSON", color: "#fcd34d", bg: "rgba(252,211,77,0.12)" },
    { ext: "XML", color: "#6ee7b7", bg: "rgba(110,231,183,0.12)" },
];

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

function formatBytes(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Edit({ resume }) {
    const { data, setData, put, processing, errors } = useForm({
        name: resume.name,
        file: null,
    });

    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [dragging, setDragging] = useState(false);

    const pickFile = (file) => {
        if (!file) return;
        setData("file", file);
        setFileName(file.name);
        setFileSize(file.size);
    };

    const clearFile = () => {
        setData("file", null);
        setFileName("");
        setFileSize(0);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        pickFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        if (data.file) formData.append("file", data.file);

        put(`/resumes/${resume.id}`, {
            data: formData,
            preserveScroll: true,
            onError: () => toast.error("Failed to update resume."),
        });
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Edit Resume" />

            <div className="re-root">
                {/* Header */}
                <div className="re-header">
                    <div>
                        <div className="re-title">Edit Resume</div>
                        <div className="re-subtitle">
                            Update your resume name or replace the file.
                        </div>
                    </div>
                    <Link href="/resumes" className="re-back">
                        <ChevronLeftIcon style={{ width: 14, height: 14 }} />
                        Back to Resumes
                    </Link>
                </div>

                {/* Card */}
                <div className="re-card">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Name */}
                        <div className="re-field">
                            <label className="re-label" htmlFor="resume-name">
                                Resume Name
                            </label>
                            <input
                                id="resume-name"
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="e.g. Software Engineer Resume 2025"
                                className={`re-input ${errors.name ? "re-input-error" : ""}`}
                            />
                            {errors.name && (
                                <div className="re-error">
                                    <XMarkIcon
                                        style={{ width: 13, height: 13 }}
                                    />{" "}
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* File */}
                        <div className="re-field" style={{ marginBottom: 0 }}>
                            <label className="re-label">
                                Resume File
                                <span className="re-label-hint">
                                    — optional, leave empty to keep current
                                </span>
                            </label>

                            {/* Current file banner */}
                            {resume.file_url && (
                                <div className="re-current-file">
                                    <div className="re-current-file-icon">
                                        <PaperClipIcon
                                            style={{
                                                width: 15,
                                                height: 15,
                                                color: "#818cf8",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="re-current-file-label">
                                            Current file
                                        </div>
                                        <div className="re-current-file-name">
                                            {resume.name}
                                        </div>
                                    </div>
                                    <a
                                        href={resume.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="re-current-file-link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <ArrowTopRightOnSquareIcon
                                            style={{ width: 12, height: 12 }}
                                        />
                                        View
                                    </a>
                                </div>
                            )}

                            {/* Drop zone */}
                            <input
                                type="file"
                                id="re_file_input"
                                accept=".pdf,.doc,.docx,.txt,.json,.xml"
                                style={{ display: "none" }}
                                onChange={(e) => pickFile(e.target.files[0])}
                            />
                            <div
                                className={`re-dropzone ${dragging ? "re-dropzone-drag" : ""} ${errors.file ? "re-dropzone-error" : ""}`}
                                onClick={() =>
                                    document
                                        .getElementById("re_file_input")
                                        .click()
                                }
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                            >
                                <div className="re-drop-icon-wrap">
                                    <ArrowPathIcon
                                        style={{
                                            width: 24,
                                            height: 24,
                                            color: "#38bdf8",
                                        }}
                                    />
                                </div>
                                <div className="re-drop-cta">
                                    <span>Click to replace</span> or drag &amp;
                                    drop a new file
                                </div>
                                <div className="re-drop-hint">
                                    PDF, DOCX, DOC, TXT, JSON, XML — max 10MB
                                </div>
                                <div className="re-formats">
                                    {FORMATS.map((f) => (
                                        <span
                                            key={f.ext}
                                            className="re-fmt-chip"
                                            style={{
                                                color: f.color,
                                                background: f.bg,
                                            }}
                                        >
                                            .{f.ext}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* New file chip */}
                            {fileName && (
                                <div className="re-file-chip">
                                    <PaperClipIcon
                                        className="re-file-chip-icon"
                                        style={{ width: 15, height: 15 }}
                                    />
                                    <span className="re-file-chip-name">
                                        {fileName}
                                    </span>
                                    {fileSize > 0 && (
                                        <span className="re-file-chip-size">
                                            {formatBytes(fileSize)}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        className="re-file-chip-remove"
                                        onClick={clearFile}
                                        title="Remove"
                                    >
                                        <XMarkIcon
                                            style={{ width: 14, height: 14 }}
                                        />
                                    </button>
                                </div>
                            )}

                            {errors.file && (
                                <div className="re-error">
                                    <XMarkIcon
                                        style={{ width: 13, height: 13 }}
                                    />{" "}
                                    {errors.file}
                                </div>
                            )}
                        </div>

                        <hr className="re-divider" />

                        {/* Actions */}
                        <div className="re-actions">
                            <button
                                type="submit"
                                disabled={processing}
                                className="re-btn-submit"
                            >
                                {processing ? (
                                    <>
                                        <div className="re-spinner" /> Saving…
                                    </>
                                ) : (
                                    <>
                                        <ArrowPathIcon
                                            style={{ width: 15, height: 15 }}
                                        />{" "}
                                        Update Resume
                                    </>
                                )}
                            </button>
                            <Link href="/resumes" className="re-btn-cancel">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
