import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import TaskContainer from './TaskContainer';

export default function ProjectBoard() {
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        const getStatuses = async () => {
            try {
                const statusesData = await ApiService.get('statuses');
                setStatuses(statusesData);
            } catch (error) {
                console.error('Ошибка получения статусов:', error);
            }
        };

        getStatuses();
    }, []);

    return (
        <div class="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
            <div class="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
                <svg class="w-8 h-8 text-indigo-600 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <input class="flex items-center h-10 px-4 ml-10 text-sm bg-gray-200 rounded-full focus:outline-none focus:ring" type="search" placeholder="Search for anything…" />
                <div class="ml-10">
                    <a class="mx-2 text-sm font-semibold text-indigo-700" href="#">Projects</a>
                    <a class="mx-2 text-sm font-semibold text-gray-600 hover:text-indigo-700" href="#">Team</a>
                    <a class="mx-2 text-sm font-semibold text-gray-600 hover:text-indigo-700" href="#">Activity</a>
                </div>
            </div>
            <div class="px-10 mt-6">
                <h1 class="text-2xl font-bold">Team Project Board</h1>
            </div>
            <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
                {statuses.map((status) => (
                    <TaskContainer key={status.id} status={status.name} />
                ))}
            </div>
        </div>
    );
};
