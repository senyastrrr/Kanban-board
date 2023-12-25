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
        <div className="flex flex-col h-screen text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
            
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-grow mx-2 mt-4 space-x-6">
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
