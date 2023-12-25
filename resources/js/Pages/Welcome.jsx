import React from 'react';
import { Head } from '@inertiajs/react';
import ProjectBoard from '../Components/ProjectBoard';
import KanbanLayout from '../Layouts/KanbanLayout';

export default function Welcome({ }) {
    return (
        <>
            <Head title="Welcome" />
                <KanbanLayout>
                    <ProjectBoard />
                </KanbanLayout>
        </>
    );
}
