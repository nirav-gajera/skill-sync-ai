import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    ChartBarIcon,
    EnvelopeOpenIcon,
    PencilSquareIcon,
    ClipboardDocumentCheckIcon

} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function Sidebar({ isOpen, onClose }) {
    const { url } = usePage();
    const currentPath = url.split('?')[0].replace(/\/scan\/?$/, '');

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon className="h-5 w-5 mr-3" /> },
        { name: 'Jobs', href: '/jobs', icon: <BriefcaseIcon className="h-5 w-5 mr-3" /> },
        { name: 'Resumes', href: '/resumes', icon: <DocumentTextIcon className="h-5 w-5 mr-3" /> },
        { name: 'Analytics', href: '/analytics', icon: <ChartBarIcon className="h-5 w-5 mr-3" /> },
        { name: 'Cover Letters', href: '/cover-letters', icon: <EnvelopeOpenIcon className="h-5 w-5 mr-3" /> },
        { name: 'Interview Preprations', href: '/interview-preps', icon: <PencilSquareIcon className="h-5 w-5 mr-3" /> },
        { name: 'Online Exam', href: '/online-exam', icon: <ClipboardDocumentCheckIcon className="h-5 w-5 mr-3" /> },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <aside className={`fixed lg:sticky lg:top-0 z-40 h-full lg:h-screen w-72 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <Link href='/dashboard'>
                <div className="h-16 px-6 py-6 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                    {/* <img src='/images/skillsync-title.png' alt="SkillSync.ai" className="h-10 object-contain" /> */}
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400 dark:from-blue-400 dark:to-purple-500">
                        SkillSync.ai
                    </h1>
                    {/* Close button (mobile only) */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-gray-700 dark:text-gray-200 hover:text-red-500"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                </Link>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item, index) => {
                        const isActive = currentPath.startsWith(item.href);
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-blue-500 text-white shadow-lg hover:shadow-xl'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                onClick={onClose}
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
