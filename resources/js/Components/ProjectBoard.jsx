import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import TaskContainer from './TaskContainer';
import { DragDropContext } from 'react-beautiful-dnd';

export default function ProjectBoard() {
    const [columns, setColumns] = useState({});
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const statusesResponse = await ApiService.get('/statuses');
                const tasksResponse = await ApiService.get('/tasks');

                const newColumns = {};

                statusesResponse.forEach((status) => {
                    newColumns[`${status.id}`] = {
                        id: `${status.id}`,
                        title: status.name,
                        taskIds: [],
                    };
                });

                tasksResponse.forEach((task) => {
                    const columnId = `${task.status_id}`;
                    if (newColumns[columnId]) {
                        newColumns[columnId].taskIds.push(`${task.id}`);
                    }
                });

                setColumns(newColumns);
                setTasks(tasksResponse);
            } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
        }

        fetchData();
    }, []);

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination)
            return;

        if (destination.droppableId === source.droppableId && destination.index === source.index)
            return;

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            const newColumnsState = {
                ...columns,
                [newColumn.id]: newColumn,
            };

            setColumns(newColumnsState);
            return;
        }

        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        const newColumnsState = {
            ...columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
        };
        try {
            setColumns(newColumnsState);
            const updatedTask = await ApiService.get(`/tasks/${draggableId}`);
            updatedTask.status_id = finish.id;
            await ApiService.put(`/tasks/${draggableId}`, updatedTask);
        } catch (error) {
            console.error('Ошибка обновления status_id:', error);
        }
    };

    return (
        <div className="flex flex-col w-screen h-screen text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
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
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-grow px-10 mt-4 space-x-6">
                    {Object.values(columns).map((column) => {
                        const updatedTasks = columns[column.id].taskIds.map((taskId) => {
                            return tasks.find((task) => task.id === parseInt(taskId));
                        });

                        return (
                            <TaskContainer
                                statusId={column.id}
                                key={column.id}
                                status={column.title}
                                tasks={updatedTasks}
                            />
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
};
