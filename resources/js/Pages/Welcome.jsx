
import React from 'react';
import { Link, Head } from '@inertiajs/react';
import ProjectBoard from '../Components/ProjectBoard';
import Dropdown from '@/Components/Dropdown';
import KanbanLayout from '../Layouts/KanbanLayout';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <KanbanLayout>
                    <ProjectBoard />
                </KanbanLayout>
            </div>
        </>
    );
}
