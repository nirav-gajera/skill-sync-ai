import Layout from "../Dashboard/Components/Layout";
import React, { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import {
    TrashIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    XMarkIcon,
    EyeIcon,
    PencilIcon,
} from "@heroicons/react/24/outline";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.cl-root { font-family:'Inter',sans-serif; padding:28px 28px 48px; background:#0f172a; min-height:100%; }

/* ── Header ── */
.cl-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
.cl-title    { font-size:22px; font-weight:800; color:#f1f5f9; letter-spacing:-0.5px; }
.cl-subtitle { font-size:13px; color:#6e7e95; margin-top:3px; }

.cl-btn-create {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:10px;
    background:linear-gradient(135deg,#0ea5e9,#6366f1);
    color:#fff; font-size:13px; font-weight:700;
    text-decoration:none; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(14,165,233,0.25); border:none; cursor:pointer;
}
.cl-btn-create:hover { opacity:0.9; transform:translateY(-1px); }

/* ── Table ── */
.cl-table-wrap {
    background:#1e293b; border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; overflow:hidden;
}
.cl-table { width:100%; border-collapse:collapse; }
.cl-table thead { background:rgba(255,255,255,0.025); }
.cl-table th {
    padding:12px 18px; text-align:left;
    font-size:11px; font-weight:600; color:#6e7e95;
    text-transform:uppercase; letter-spacing:0.8px;
    border-bottom:1px solid rgba(255,255,255,0.05); white-space:nowrap;
}
.cl-table td {
    padding:13px 18px; font-size:13px; color:#94a3b8;
    border-bottom:1px solid rgba(255,255,255,0.04); word-break:break-word;
}
.cl-table tbody tr:last-child td { border-bottom:none; }
.cl-table tbody tr:hover td { background:rgba(255,255,255,0.025); }
.cl-table td.cl-td-id      { color:#6e7e95; font-size:12px; text-align:center; width:56px; }
.cl-table td.cl-td-main    { color:#e2e8f0; font-weight:500; }
.cl-table td.cl-td-link a  {
    color:#38bdf8; text-decoration:none; font-size:13px; transition:color 0.15s;
}
.cl-table td.cl-td-link a:hover { color:#7dd3fc; }

/* ── No-file badge ── */
.cl-no-file {
    display:inline-flex; align-items:center; padding:2px 8px;
    border-radius:6px; font-size:11px; font-weight:500; color:#6e7e95;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06);
}

/* ── Action buttons ── */
.cl-actions { display:flex; align-items:center; gap:6px; }
.cl-action-btn {
    width:30px; height:30px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    border:1px solid transparent; cursor:pointer;
    background:none; transition:all 0.16s; text-decoration:none; flex-shrink:0;
}
.cl-action-view     { color:#38bdf8; background:rgba(56,189,248,0.08);  border-color:rgba(56,189,248,0.15); }
.cl-action-edit     { color:#34d399; background:rgba(52,211,153,0.08);  border-color:rgba(52,211,153,0.15); }
.cl-action-download { color:#a78bfa; background:rgba(139,92,246,0.08);  border-color:rgba(139,92,246,0.15); }
.cl-action-del      { color:#f87171; background:rgba(248,113,113,0.08); border-color:rgba(248,113,113,0.15); }
.cl-action-view:hover     { background:rgba(56,189,248,0.18); }
.cl-action-edit:hover     { background:rgba(52,211,153,0.18); }
.cl-action-download:hover { background:rgba(139,92,246,0.18); }
.cl-action-del:hover      { background:rgba(248,113,113,0.18); }

/* ── Empty state ── */
.cl-empty {
    padding:52px 20px; text-align:center;
    background:#1e293b; border:1px solid rgba(255,255,255,0.07); border-radius:14px;
}
.cl-empty-icon { font-size:36px; margin-bottom:10px; }
.cl-empty-text { font-size:14px; color:#6e7e95; font-weight:500; margin-bottom:16px; }

/* ── Pagination ── */
.cl-pagination-row {
    display:flex; align-items:center; justify-content:space-between;
    margin-top:18px; flex-wrap:wrap; gap:12px;
}
.cl-per-page { display:flex; align-items:center; gap:8px; font-size:13px; color:#7b94b7; }
.cl-per-page-select {
    background:#1e293b; border:1px solid rgba(255,255,255,0.08);
    color:#94a3b8; border-radius:8px; padding:5px 10px; font-size:13px;
    font-family:'Inter',sans-serif; outline:none; cursor:pointer;
}
.cl-per-page-select:focus { border-color:rgba(56,189,248,0.30); }
.cl-per-page-total { color:#6e7e95; }
.cl-links { display:flex; gap:4px; flex-wrap:wrap; }
.cl-page-btn {
    padding:6px 12px; border-radius:8px; font-size:12px; font-weight:600;
    border:1px solid rgba(255,255,255,0.07);
    background:#1e293b; color:#7b94b7;
    text-decoration:none; cursor:pointer;
    transition:all 0.16s; white-space:nowrap; display:inline-block;
}
.cl-page-btn:hover { background:rgba(255,255,255,0.05); color:#94a3b8; }
.cl-page-btn-active   { background:rgba(14,165,233,0.12) !important; color:#38bdf8 !important; border-color:rgba(14,165,233,0.25) !important; }
.cl-page-btn-disabled { opacity:0.35; pointer-events:none; }

/* ── Delete Modal ── */
.cl-modal-backdrop {
    position:fixed; inset:0; z-index:60;
    background:rgba(0,0,0,0.60); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center;
}
.cl-modal {
    position:relative; z-index:61;
    background:#1e293b; border:1px solid rgba(255,255,255,0.09);
    border-radius:18px; padding:32px 28px;
    width:500px; max-width:90vw;
    box-shadow:0 24px 60px rgba(0,0,0,0.5);
    font-family:'Inter',sans-serif;
}
.cl-modal-close {
    position:absolute; top:14px; right:14px;
    width:28px; height:28px; border-radius:7px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
    color:#7b94b7; cursor:pointer;
    display:flex; align-items:center; justify-content:center; transition:all 0.18s;
}
.cl-modal-close:hover { background:rgba(255,255,255,0.09); color:#94a3b8; }
.cl-modal-icon {
    width:48px; height:48px; border-radius:14px;
    background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.22);
    display:flex; align-items:center; justify-content:center; margin-bottom:16px;
}
.cl-modal-title { font-size:17px; font-weight:700; color:#f1f5f9; margin-bottom:8px; }
.cl-modal-desc  { font-size:14px; color:#7b94b7; line-height:1.6; margin-bottom:24px; }
.cl-modal-actions { display:flex; gap:10px; justify-content:flex-end; }
.cl-modal-cancel {
    padding:9px 20px; border-radius:9px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
    color:#64748b; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
    font-family:'Inter',sans-serif;
}
.cl-modal-cancel:hover { background:rgba(255,255,255,0.08); color:#94a3b8; }
.cl-modal-delete {
    padding:9px 20px; border-radius:9px;
    background:linear-gradient(135deg,#dc2626,#b91c1c); border:none;
    color:#fff; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.18s;
    box-shadow:0 4px 14px rgba(220,38,38,0.30); font-family:'Inter',sans-serif;
}
.cl-modal-delete:hover { opacity:0.9; transform:translateY(-1px); }
`;

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

export default function CoverLettersIndex() {
    const { props } = usePage();
    const { coverLetters, flash } = props;

    const [deleteId, setDeleteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    const confirmDelete = (id) => {
        setDeleteId(id);
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/cover-letters/${deleteId}`, {
            onSuccess: (page) => {
                toast.success(
                    page.props.flash?.success ||
                        "Cover letter deleted successfully!",
                );
                setIsModalOpen(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Cover Letters" />

            <div className="cl-root">
                {/* ── Header ── */}
                <div className="cl-header">
                    <div>
                        <div className="cl-title">Cover Letters</div>
                        <div className="cl-subtitle">
                            Manage and track all your generated cover letters.
                        </div>
                    </div>
                    <Link
                        href="/cover-letters/create"
                        className="cl-btn-create"
                    >
                        <PlusIcon style={{ width: 15, height: 15 }} />
                        Create Cover Letter
                    </Link>
                </div>

                {/* ── Table ── */}
                {coverLetters?.data?.length > 0 ? (
                    <div className="cl-table-wrap">
                        <table className="cl-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "center" }}>#</th>
                                    <th>Resume</th>
                                    <th>Job</th>
                                    <th>Company</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coverLetters.data.map((cl) => (
                                    <tr key={cl.id}>
                                        <td className="cl-td-id">{cl.id}</td>
                                        <td className="cl-td-main">
                                            {cl.resume?.name || "—"}
                                        </td>
                                        <td className="cl-td-link">
                                            <a
                                                href={`/jobs/${cl.job_description_id}`}
                                            >
                                                {cl.job?.title || "—"}
                                            </a>
                                        </td>
                                        <td>{cl.company_name || "—"}</td>
                                        <td>
                                            <div className="cl-actions">
                                                {/* View */}
                                                <button
                                                    className="cl-action-btn cl-action-view"
                                                    title="View"
                                                    onClick={() =>
                                                        Inertia.get(
                                                            `/cover-letters/${cl.id}`,
                                                        )
                                                    }
                                                >
                                                    <EyeIcon
                                                        style={{
                                                            width: 14,
                                                            height: 14,
                                                        }}
                                                    />
                                                </button>

                                                {/* Edit */}
                                                <Link
                                                    href={`/cover-letters/${cl.id}/edit`}
                                                    className="cl-action-btn cl-action-edit"
                                                    title="Edit"
                                                >
                                                    <PencilIcon
                                                        style={{
                                                            width: 14,
                                                            height: 14,
                                                        }}
                                                    />
                                                </Link>

                                                {/* Download — only if file exists */}
                                                {cl.file_path ? (
                                                    <a
                                                        href={cl.file_url}
                                                        download
                                                        className="cl-action-btn cl-action-download"
                                                        title="Download PDF"
                                                    >
                                                        <ArrowDownTrayIcon
                                                            style={{
                                                                width: 14,
                                                                height: 14,
                                                            }}
                                                        />
                                                    </a>
                                                ) : (
                                                    <span
                                                        className="cl-no-file"
                                                        title="No file available"
                                                    >
                                                        —
                                                    </span>
                                                )}

                                                {/* Delete */}
                                                <button
                                                    className="cl-action-btn cl-action-del"
                                                    title="Delete"
                                                    onClick={() =>
                                                        confirmDelete(cl.id)
                                                    }
                                                >
                                                    <TrashIcon
                                                        style={{
                                                            width: 14,
                                                            height: 14,
                                                        }}
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="cl-empty">
                        <div className="cl-empty-icon">✉️</div>
                        <div className="cl-empty-text">
                            No cover letters found. Create your first one!
                        </div>
                        <Link
                            href="/cover-letters/create"
                            className="cl-btn-create"
                        >
                            <PlusIcon style={{ width: 14, height: 14 }} />{" "}
                            Create Cover Letter
                        </Link>
                    </div>
                )}

                {/* ── Pagination ── */}
                {coverLetters.total > 10 && (
                    <div className="cl-pagination-row">
                        <div className="cl-per-page">
                            <span>Show</span>
                            <select
                                className="cl-per-page-select"
                                value={coverLetters.per_page}
                                onChange={(e) =>
                                    router.get(
                                        location.pathname,
                                        { per_page: e.target.value },
                                        { preserveState: true, replace: true },
                                    )
                                }
                            >
                                {[10, 25, 50, 100].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                            <span className="cl-per-page-total">
                                of {coverLetters.total} entries
                            </span>
                        </div>

                        <div className="cl-links">
                            {coverLetters.links
                                .filter(
                                    (l) =>
                                        l.url ||
                                        l.label === "&laquo; Previous" ||
                                        l.label === "Next &raquo;",
                                )
                                .map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || "#"}
                                        className={`cl-page-btn ${link.active ? "cl-page-btn-active" : ""} ${!link.url ? "cl-page-btn-disabled" : ""}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Delete Modal ── */}
            {isModalOpen && (
                <div
                    className="cl-modal-backdrop"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="cl-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="cl-modal-close"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <XMarkIcon style={{ width: 14, height: 14 }} />
                        </button>
                        <div className="cl-modal-icon">
                            <TrashIcon
                                style={{
                                    width: 22,
                                    height: 22,
                                    color: "#f87171",
                                }}
                            />
                        </div>
                        <div className="cl-modal-title">
                            Delete Cover Letter?
                        </div>
                        <div className="cl-modal-desc">
                            Are you sure you want to delete this cover letter?
                            This action cannot be undone.
                        </div>
                        <div className="cl-modal-actions">
                            <button
                                className="cl-modal-cancel"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="cl-modal-delete"
                                onClick={handleDelete}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
