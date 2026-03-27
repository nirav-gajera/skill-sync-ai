import Layout from "../Dashboard/Components/Layout";
import { useForm, Link, Head } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import {
    PaperClipIcon,
    DocumentArrowUpIcon,
    XMarkIcon,
    ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .rc-root {
        font-family: 'Inter', sans-serif;
        padding: 28px 28px 60px;
        background: #0f172a;
        min-height: 100%;
    }

    /* ── Header ── */
    .rc-header {
        display: flex; align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
    }
    .rc-title    { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
    .rc-subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }

    .rc-back {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 13px; font-weight: 600; color: #38bdf8;
        text-decoration: none; padding: 7px 14px; border-radius: 9px;
        background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.18);
        transition: all 0.18s; white-space: nowrap;
    }
    .rc-back:hover { background: rgba(56,189,248,0.15); }

    /* ── Card — full width ── */
    .rc-card {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 32px;
        width: 100%;
    }

    /* ── Field ── */
    .rc-field { margin-bottom: 24px; }
    .rc-label {
        display: block; margin-bottom: 8px;
        font-size: 13px; font-weight: 600; color: #cbd5e1;
    }
    .rc-input {
        width: 100%; padding: 11px 14px;
        background: #0f172a;
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 10px;
        color: #e2e8f0; font-size: 14px;
        font-family: 'Inter', sans-serif;
        outline: none; transition: border-color 0.18s, box-shadow 0.18s;
        box-sizing: border-box;
    }
    .rc-input::placeholder { color: #6e7e95; }
    .rc-input:focus {
        border-color: rgba(56,189,248,0.45);
        box-shadow: 0 0 0 3px rgba(56,189,248,0.08);
    }
    .rc-input-error { border-color: rgba(248,113,113,0.55) !important; }
    .rc-input-error:focus { box-shadow: 0 0 0 3px rgba(248,113,113,0.08) !important; }

    /* ── Drop zone ── */
    .rc-dropzone-wrap { position: relative; width: 100%; }

    /* Hidden real input — covers whole zone for click */
    .rc-file-input-hidden {
        position: absolute; inset: 0;
        opacity: 0; cursor: pointer;
        width: 100%; height: 100%;
        z-index: 2;
    }

    .rc-dropzone {
        width: 100%;
        box-sizing: border-box;
        border-radius: 14px;
        padding: 40px 24px;
        text-align: center;
        cursor: pointer;
        transition: all 0.22s;
        position: relative;
        /* Proper dashed border using SVG background — avoids gap issues */
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='14' ry='14' stroke='rgba(255,255,255,0.14)' stroke-width='2' stroke-dasharray='8%2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
        background-color: rgba(255,255,255,0.01);
    }
    .rc-dropzone:hover,
    .rc-dropzone-drag {
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='14' ry='14' stroke='rgba(56%2c189%2c248%2c0.50)' stroke-width='2' stroke-dasharray='8%2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
        background-color: rgba(56,189,248,0.04);
    }
    .rc-dropzone-error {
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='14' ry='14' stroke='rgba(248%2c113%2c113%2c0.45)' stroke-width='2' stroke-dasharray='8%2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
        background-color: rgba(248,113,113,0.03);
    }

    .rc-drop-icon-wrap {
        width: 56px; height: 56px; border-radius: 16px;
        background: rgba(56,189,248,0.10);
        border: 1px solid rgba(56,189,248,0.22);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 16px;
        transition: all 0.22s;
    }
    .rc-dropzone:hover .rc-drop-icon-wrap,
    .rc-dropzone-drag .rc-drop-icon-wrap {
        background: rgba(56,189,248,0.16);
        transform: scale(1.06);
    }

    .rc-drop-cta   { font-size: 15px; font-weight: 600; color: #cbd5e1; margin-bottom: 5px; }
    .rc-drop-cta span { color: #38bdf8; }
    .rc-drop-hint  { font-size: 12px; color: #6e7e95; margin-bottom: 16px; }

    /* Format pills inside zone */
    .rc-formats {
        display: flex; flex-wrap: wrap; gap: 6px;
        justify-content: center;
    }
    .rc-fmt-chip {
        font-size: 11px; font-weight: 700;
        padding: 3px 9px; border-radius: 6px;
    }

    /* ── Selected file chip ── */
    .rc-file-chip {
        display: flex; align-items: center; gap: 9px;
        padding: 10px 14px; border-radius: 10px;
        background: rgba(56,189,248,0.07);
        border: 1px solid rgba(56,189,248,0.18);
        margin-top: 12px; width: 100%; box-sizing: border-box;
    }
    .rc-file-chip-icon { color: #38bdf8; flex-shrink: 0; }
    .rc-file-chip-name {
        flex: 1; font-size: 13px; font-weight: 500; color: #7dd3fc;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .rc-file-chip-size { font-size: 11px; color: #6e7e95; flex-shrink: 0; }
    .rc-file-chip-remove {
        background: none; border: none; color: #64748b;
        cursor: pointer; padding: 3px; display: flex; align-items: center;
        border-radius: 5px; transition: color 0.15s; flex-shrink: 0;
    }
    .rc-file-chip-remove:hover { color: #f87171; }

    /* ── Error message ── */
    .rc-error {
        font-size: 12px; color: #f87171;
        margin-top: 7px; display: flex; align-items: center; gap: 5px;
    }

    /* ── Divider ── */
    .rc-divider {
        border: none; border-top: 1px solid rgba(255,255,255,0.06);
        margin: 28px 0;
    }

    /* ── Actions ── */
    .rc-actions { display: flex; align-items: center; gap: 10px; }

    .rc-btn-submit {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 11px 28px; border-radius: 10px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        color: #fff; font-size: 14px; font-weight: 700;
        border: none; cursor: pointer; transition: all 0.18s;
        box-shadow: 0 4px 14px rgba(14,165,233,0.25);
        font-family: 'Inter', sans-serif;
    }
    .rc-btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .rc-btn-submit:disabled { opacity: 0.50; cursor: not-allowed; transform: none; }

    .rc-btn-cancel {
        display: inline-flex; align-items: center;
        padding: 11px 22px; border-radius: 10px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.09);
        color: #94a3b8; font-size: 14px; font-weight: 600;
        text-decoration: none; transition: all 0.18s;
    }
    .rc-btn-cancel:hover { background: rgba(255,255,255,0.07); color: #cbd5e1; }

    /* ── Spinner ── */
    @keyframes rc-spin { to { transform: rotate(360deg); } }
    .rc-spinner {
        width: 14px; height: 14px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.25);
        border-top-color: #fff;
        animation: rc-spin 0.7s linear infinite; flex-shrink: 0;
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

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
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
        const file = e.dataTransfer.files[0];
        if (file) pickFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/resumes", {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setFileName("");
                setFileSize(0);
                toast.success("Resume uploaded successfully!");
            },
            onError: () => toast.error("Please fix the errors below."),
        });
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Upload Resume" />

            <div className="rc-root">
                {/* Header */}
                <div className="rc-header">
                    <div>
                        <div className="rc-title">Upload Resume</div>
                        <div className="rc-subtitle">
                            Add a new resume to your library for AI-powered job
                            matching.
                        </div>
                    </div>
                    <Link href="/resumes" className="rc-back">
                        <ChevronLeftIcon style={{ width: 14, height: 14 }} />
                        Back to Resumes
                    </Link>
                </div>

                {/* Card */}
                <div className="rc-card">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Name field */}
                        <div className="rc-field">
                            <label className="rc-label" htmlFor="resume-name">
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
                                className={`rc-input ${errors.name ? "rc-input-error" : ""}`}
                            />
                            {errors.name && (
                                <div className="rc-error">
                                    <XMarkIcon
                                        style={{ width: 13, height: 13 }}
                                    />
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* File field */}
                        <div className="rc-field" style={{ marginBottom: 0 }}>
                            <label className="rc-label">Resume File</label>

                            {/* Drop zone */}
                            <div
                                className={`rc-dropzone ${dragging ? "rc-dropzone-drag" : ""} ${errors.file ? "rc-dropzone-error" : ""}`}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() =>
                                    document
                                        .getElementById("rc_file_input")
                                        .click()
                                }
                            >
                                {/* Hidden input */}
                                <input
                                    type="file"
                                    id="rc_file_input"
                                    accept=".pdf,.doc,.docx,.txt,.json,.xml"
                                    style={{ display: "none" }}
                                    onChange={(e) =>
                                        pickFile(e.target.files[0])
                                    }
                                />

                                <div className="rc-drop-icon-wrap">
                                    <DocumentArrowUpIcon
                                        style={{
                                            width: 26,
                                            height: 26,
                                            color: "#38bdf8",
                                        }}
                                    />
                                </div>

                                <div className="rc-drop-cta">
                                    <span>Click to upload</span> or drag &amp;
                                    drop
                                </div>
                                <div className="rc-drop-hint">
                                    Maximum file size: 10MB
                                </div>

                                <div className="rc-formats">
                                    {FORMATS.map((f) => (
                                        <span
                                            key={f.ext}
                                            className="rc-fmt-chip"
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

                            {/* Selected file chip */}
                            {fileName && (
                                <div className="rc-file-chip">
                                    <PaperClipIcon
                                        className="rc-file-chip-icon"
                                        style={{ width: 15, height: 15 }}
                                    />
                                    <span className="rc-file-chip-name">
                                        {fileName}
                                    </span>
                                    {fileSize > 0 && (
                                        <span className="rc-file-chip-size">
                                            {formatBytes(fileSize)}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        className="rc-file-chip-remove"
                                        onClick={clearFile}
                                        title="Remove file"
                                    >
                                        <XMarkIcon
                                            style={{ width: 14, height: 14 }}
                                        />
                                    </button>
                                </div>
                            )}

                            {errors.file && (
                                <div className="rc-error">
                                    <XMarkIcon
                                        style={{ width: 13, height: 13 }}
                                    />
                                    {errors.file}
                                </div>
                            )}
                        </div>

                        <hr className="rc-divider" />

                        {/* Actions */}
                        <div className="rc-actions">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rc-btn-submit"
                            >
                                {processing ? (
                                    <>
                                        <div className="rc-spinner" />{" "}
                                        Uploading…
                                    </>
                                ) : (
                                    <>
                                        <DocumentArrowUpIcon
                                            style={{ width: 15, height: 15 }}
                                        />{" "}
                                        Upload Resume
                                    </>
                                )}
                            </button>
                            <Link href="/resumes" className="rc-btn-cancel">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
