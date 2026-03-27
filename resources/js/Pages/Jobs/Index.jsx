import { useState, useEffect } from "react";
import { router, Link, usePage, Head } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../Dashboard/Components/Layout";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    BriefcaseIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .ji-root { font-family: 'Inter', sans-serif; padding: 28px 28px 48px; background: #0f172a; min-height: 100%; }

    /* Header */
    .ji-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .ji-header-left {}
    .ji-title    { font-size: 22px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px; }
    .ji-subtitle { font-size: 13px; color: #6e7e95; margin-top: 3px; }

    .ji-btn-create {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 9px 18px; border-radius: 10px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        color: #fff; font-size: 13px; font-weight: 700;
        text-decoration: none; transition: all 0.18s;
        box-shadow: 0 4px 14px rgba(14,165,233,0.25); border: none; cursor: pointer;
    }
    .ji-btn-create:hover { opacity: 0.9; transform: translateY(-1px); }

    /* Search bar */
    .ji-search-row { display: flex; gap: 10px; margin-bottom: 20px; align-items: center; }
    .ji-search-wrap {
        position: relative; flex: 1;
    }
    .ji-search-icon {
        position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
        color: #6e7e95; pointer-events: none;
    }
    .ji-search-input {
        width: 100%; padding: 10px 40px 10px 38px;
        background: #1e293b; border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px; color: #e2e8f0; font-size: 13px;
        font-family: 'Inter', sans-serif; outline: none; transition: all 0.18s;
    }
    .ji-search-input::placeholder { color: #6e7e95; }
    .ji-search-input:focus { border-color: rgba(56,189,248,0.35); box-shadow: 0 0 0 3px rgba(56,189,248,0.08); }
    .ji-search-clear {
        position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
        background: none; border: none; color: #7b94b7; cursor: pointer;
        display: flex; align-items: center; padding: 2px; border-radius: 5px;
        transition: color 0.15s;
    }
    .ji-search-clear:hover { color: #94a3b8; }

    .ji-btn-search {
        padding: 10px 18px; border-radius: 10px;
        background: rgba(56,189,248,0.10); border: 1px solid rgba(56,189,248,0.20);
        color: #38bdf8; font-size: 13px; font-weight: 600;
        cursor: pointer; transition: all 0.18s; white-space: nowrap;
        font-family: 'Inter', sans-serif;
    }
    .ji-btn-search:hover { background: rgba(56,189,248,0.18); }

    /* Table */
    .ji-table-wrap {
        background: #1e293b;
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 14px; overflow: hidden;
    }
    .ji-table { width: 100%; border-collapse: collapse; }
    .ji-table thead { background: rgba(255,255,255,0.025); }
    .ji-table th {
        padding: 12px 18px; text-align: left;
        font-size: 11px; font-weight: 600; color: #6e7e95;
        text-transform: uppercase; letter-spacing: 0.8px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .ji-table td {
        padding: 13px 18px; font-size: 13px; color: #94a3b8;
        border-bottom: 1px solid rgba(255,255,255,0.04);
        word-break: break-word;
    }
    .ji-table tbody tr:last-child td { border-bottom: none; }
    .ji-table tbody tr:hover td { background: rgba(255,255,255,0.025); }
    .ji-table td.ji-td-id   { color: #6e7e95; font-size: 12px; text-align: center; width: 56px; }
    .ji-table td.ji-td-title { color: #e2e8f0; font-weight: 500; }

    /* Action buttons */
    .ji-actions { display: flex; align-items: center; gap: 6px; }
    .ji-action-btn {
        width: 30px; height: 30px; border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        border: 1px solid transparent; cursor: pointer;
        background: none; transition: all 0.16s; text-decoration: none;
        flex-shrink: 0;
    }
    .ji-action-view  { color: #38bdf8; background: rgba(56,189,248,0.08);  border-color: rgba(56,189,248,0.15); }
    .ji-action-edit  { color: #34d399; background: rgba(52,211,153,0.08);  border-color: rgba(52,211,153,0.15); }
    .ji-action-del   { color: #f87171; background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.15); }
    .ji-action-view:hover { background: rgba(56,189,248,0.18); }
    .ji-action-edit:hover { background: rgba(52,211,153,0.18); }
    .ji-action-del:hover  { background: rgba(248,113,113,0.18); }

    /* Empty state */
    .ji-empty {
        padding: 52px 20px; text-align: center;
        background: #1e293b; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px;
    }
    .ji-empty-icon { font-size: 36px; margin-bottom: 10px; }
    .ji-empty-text { font-size: 14px; color: #6e7e95; font-weight: 500; margin-bottom: 16px; }

    /* Pagination */
    .ji-pagination-row {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 18px; flex-wrap: wrap; gap: 12px;
    }
    .ji-per-page { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #7b94b7; }
    .ji-per-page-select {
        background: #1e293b; border: 1px solid rgba(255,255,255,0.08);
        color: #94a3b8; border-radius: 8px; padding: 5px 10px; font-size: 13px;
        font-family: 'Inter', sans-serif; outline: none; cursor: pointer;
    }
    .ji-per-page-select:focus { border-color: rgba(56,189,248,0.30); }
    .ji-per-page-total { color: #6e7e95; }

    .ji-links { display: flex; gap: 4px; flex-wrap: wrap; }
    .ji-page-btn {
        padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
        border: 1px solid rgba(255,255,255,0.07);
        background: #1e293b; color: #7b94b7;
        text-decoration: none; cursor: pointer;
        transition: all 0.16s; white-space: nowrap; display: inline-block;
    }
    .ji-page-btn:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
    .ji-page-btn-active { background: rgba(14,165,233,0.12) !important; color: #38bdf8 !important; border-color: rgba(14,165,233,0.25) !important; }
    .ji-page-btn-disabled { opacity: 0.35; pointer-events: none; }

    /* Modal */
    .ji-modal-backdrop {
        position: fixed; inset: 0; z-index: 60;
        background: rgba(0,0,0,0.60); backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center;
    }
    .ji-modal {
        position: relative; z-index: 61;
        background: #1e293b; border: 1px solid rgba(255,255,255,0.09);
        border-radius: 18px; padding: 32px 28px;
        width: 500px; max-width: 90vw;
        box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        font-family: 'Inter', sans-serif;
    }
    .ji-modal-close {
        position: absolute; top: 14px; right: 14px;
        width: 28px; height: 28px; border-radius: 7px;
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
        color: #7b94b7; cursor: pointer;
        display: flex; align-items: center; justify-content: center; transition: all 0.18s;
    }
    .ji-modal-close:hover { background: rgba(255,255,255,0.09); color: #94a3b8; }
    .ji-modal-icon {
        width: 48px; height: 48px; border-radius: 14px;
        background: rgba(248,113,113,0.12); border: 1px solid rgba(248,113,113,0.22);
        display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
    }
    .ji-modal-title { font-size: 17px; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; }
    .ji-modal-desc  { font-size: 14px; color: #7b94b7; line-height: 1.6; margin-bottom: 24px; }
    .ji-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
    .ji-modal-cancel {
        padding: 9px 20px; border-radius: 9px;
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
        color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s;
        font-family: 'Inter', sans-serif;
    }
    .ji-modal-cancel:hover { background: rgba(255,255,255,0.08); color: #94a3b8; }
    .ji-modal-delete {
        padding: 9px 20px; border-radius: 9px;
        background: linear-gradient(135deg, #dc2626, #b91c1c); border: none;
        color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s;
        box-shadow: 0 4px 14px rgba(220,38,38,0.30); font-family: 'Inter', sans-serif;
    }
    .ji-modal-delete:hover { opacity: 0.9; transform: translateY(-1px); }
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

export default function Index({ jobs, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [deleteId, setDeleteId] = useState(null);
    const [isModalOpen, setModal] = useState(false);
    const { props } = usePage();
    const flash = props.flash || {};

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
        setModal(true);
    };
    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/jobs/${deleteId}`);
        setModal(false);
        setDeleteId(null);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            location.pathname,
            { search, per_page: jobs.per_page },
            { preserveState: true, replace: true },
        );
    };
    const clearSearch = () => {
        setSearch("");
        router.get(
            location.pathname,
            { per_page: jobs.per_page },
            { preserveState: true, replace: true },
        );
    };

    return (
        <Layout>
            <style>{styles}</style>
            <Toaster position="top-right" toastOptions={TOAST_OPTS} />
            <Head title="Jobs" />

            <div className="ji-root">
                {/* Header */}
                <div className="ji-header">
                    <div className="ji-header-left">
                        <div className="ji-title">Jobs</div>
                        <div className="ji-subtitle">
                            Manage and track all your job opportunities.
                        </div>
                    </div>
                    <Link href="/jobs/create" className="ji-btn-create">
                        <PlusIcon style={{ width: 15, height: 15 }} />
                        Create Job
                    </Link>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="ji-search-row">
                    <div className="ji-search-wrap">
                        <MagnifyingGlassIcon
                            className="ji-search-icon"
                            style={{ width: 15, height: 15 }}
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search jobs by title…"
                            className="ji-search-input"
                        />
                        {search && (
                            <button
                                type="button"
                                className="ji-search-clear"
                                onClick={clearSearch}
                            >
                                <XMarkIcon style={{ width: 14, height: 14 }} />
                            </button>
                        )}
                    </div>
                    <button type="submit" className="ji-btn-search">
                        Search
                    </button>
                </form>

                {/* Table */}
                {jobs.data.length > 0 ? (
                    <div className="ji-table-wrap">
                        <table className="ji-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "center" }}>#</th>
                                    <th>Job Title</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.data.map((job) => (
                                    <tr key={job.id}>
                                        <td className="ji-td-id">{job.id}</td>
                                        <td className="ji-td-title">
                                            {job.title}
                                        </td>
                                        <td>
                                            <div className="ji-actions">
                                                <Link
                                                    href={`/jobs/${job.id}`}
                                                    className="ji-action-btn ji-action-view"
                                                    title="View"
                                                >
                                                    <EyeIcon
                                                        style={{
                                                            width: 14,
                                                            height: 14,
                                                        }}
                                                    />
                                                </Link>
                                                <Link
                                                    href={`/jobs/${job.id}/edit`}
                                                    className="ji-action-btn ji-action-edit"
                                                    title="Edit"
                                                >
                                                    <PencilIcon
                                                        style={{
                                                            width: 14,
                                                            height: 14,
                                                        }}
                                                    />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        confirmDelete(job.id)
                                                    }
                                                    className="ji-action-btn ji-action-del"
                                                    title="Delete"
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
                    <div className="ji-empty">
                        <div className="ji-empty-icon">💼</div>
                        <div className="ji-empty-text">
                            No jobs found. Try adjusting your search.
                        </div>
                        <Link href="/jobs/create" className="ji-btn-create">
                            <PlusIcon style={{ width: 14, height: 14 }} />{" "}
                            Create your first job
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {jobs.total > 10 && (
                    <div className="ji-pagination-row">
                        <div className="ji-per-page">
                            <span>Show</span>
                            <select
                                className="ji-per-page-select"
                                value={jobs.per_page}
                                onChange={(e) =>
                                    router.get(
                                        location.pathname,
                                        { per_page: e.target.value, search },
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
                            <span className="ji-per-page-total">
                                of {jobs.total} jobs
                            </span>
                        </div>

                        <div className="ji-links">
                            {jobs.links
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
                                        className={`ji-page-btn ${link.active ? "ji-page-btn-active" : ""} ${!link.url ? "ji-page-btn-disabled" : ""}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {isModalOpen && (
                <div
                    className="ji-modal-backdrop"
                    onClick={() => setModal(false)}
                >
                    <div
                        className="ji-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="ji-modal-close"
                            onClick={() => setModal(false)}
                        >
                            <XMarkIcon style={{ width: 14, height: 14 }} />
                        </button>
                        <div className="ji-modal-icon">
                            <TrashIcon
                                style={{
                                    width: 22,
                                    height: 22,
                                    color: "#f87171",
                                }}
                            />
                        </div>
                        <div className="ji-modal-title">Delete Job?</div>
                        <div className="ji-modal-desc">
                            This job and all associated scans will be
                            permanently deleted. This action cannot be undone.
                        </div>
                        <div className="ji-modal-actions">
                            <button
                                className="ji-modal-cancel"
                                onClick={() => setModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="ji-modal-delete"
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
