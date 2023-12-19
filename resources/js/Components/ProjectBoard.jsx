import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import TaskContainer from './TaskContainer';
import { DragDropContext } from 'react-beautiful-dnd';

export default function ProjectBoard() {
    const [statuses, setStatuses] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statusesData = await ApiService.get('statuses');
                setStatuses(statusesData);

                const allTasks = await ApiService.get('tasks');
                setTasks(allTasks);

            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        };

        fetchData();
    }, []);

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
    
        // Локальное обновление
        const updatedTasks = Array.from(tasks);
        const movedTaskIndex = updatedTasks.findIndex((task) => task && task.id == draggableId);
    
        if (movedTaskIndex === -1) return;
        const [movedTask] = updatedTasks.splice(movedTaskIndex, 1);
        updatedTasks.splice(destination.index, 0, movedTask);
        setTasks(updatedTasks);
    };
    

    return (
        <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
            <div className="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
                <svg className="w-8 h-8 text-indigo-600 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <input className="flex items-center h-10 px-4 ml-10 text-sm bg-gray-200 rounded-full focus:outline-none focus:ring" type="search" placeholder="Search for anything…" />
                <div className="ml-10">
                    <a className="mx-2 text-sm font-semibold text-indigo-700" href="#">Projects</a>
                    <a className="mx-2 text-sm font-semibold text-gray-600 hover:text-indigo-700" href="#">Team</a>
                    <a className="mx-2 text-sm font-semibold text-gray-600 hover:text-indigo-700" href="#">Activity</a>
                </div>
            </div>
            <div className="px-10 mt-6">
                <h1 className="text-2xl font-bold">Team Project Board</h1>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
                    {statuses.map((status) => (
                        <TaskContainer key={status.id} status={status.name} />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};
