import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import CreateTaskForm from './CreateTaskForm';
import EditTaskForm from './EditTaskForm';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ApiService from '@/services/ApiService';
import { usePage } from '@inertiajs/react';

export default function TaskContainer({ statusId, status, tasks }) {

    const [editForm, setEditForm] = useState(false);
    const [createForm, setCreateForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [usersTasks, setUsersTasks] = useState([]);
    
    const user = usePage().props.auth.user;

    useEffect(() => {
        async function fetchUsersTasks() {
          try {
            const response = await ApiService.get('/users_tasks');
            setUsersTasks(response); 
          } catch (error) {
            console.error('Ошибка при получении users_tasks:', error);
          }
        }
    
        fetchUsersTasks();
      }, []);

      const combinedTasks = tasks.map(task => {
        const userTask = usersTasks.find(userTask => userTask.task_id === task.id);
        return { ...task, userId: userTask?.user_id || null };
      });

    return (
        <div className="flex flex-col flex-shrink-0 w-72">
            <div className="flex items-center flex-shrink-0 h-10 px-2">
                <span className="block text-sm font-semibold">{status}</span>
                <span className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30">{tasks.length}</span>
                <button onClick={() => { setCreateForm(true); }} className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                </button>
            </div>
            <div>
                {(editForm || createForm) && (
                    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 relative">
                        <button
                            onClick={() => { setEditForm(false); setCreateForm(false); }}
                            className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700 z-20"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                        {editForm ? (
                            <EditTaskForm task={selectedTask} />
                        ) : (
                            <CreateTaskForm statusId={statusId} />
                        )}
                    </div>
                </div>
                )}
            </div>
            <Droppable droppableId={statusId}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {combinedTasks.map((task, index) => {
                            let isOwner = user.role === 'admin' || user.id === task.userId;
                            return (
                                <Draggable
                                    draggableId={`${task.id}`}
                                    index={index}
                                    key={`${task.id}`}
                                    isDragDisabled={!isOwner}
                                >
                                    {(provided) => (
                                        <div onClick={() => { if(isOwner) { setEditForm(true); setSelectedTask(task); }}}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <TaskCard task={task} userId={task.userId}/>
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
