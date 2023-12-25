import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../services/ApiService';
import formatDate from '../services/date';

export default function EditTaskForm({ task }) {

    const { data, setData, processing, errors } = useForm({
        category: task.category,
        task: task.task,
        start_date: formatDate(new Date(task.start_date)),
        end_date: formatDate(new Date(task.end_date)),
    });

    const submit = async (e) => {
        e.preventDefault();

        try {
            await ApiService.put(`/tasks/${task.id}`, data);
        } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
        }
    };

    return (
        <form onSubmit={submit} className="max-w-md mx-auto">
            <div className="mb-6">
                <InputLabel htmlFor="category" value="Category" />
                <TextInput
                    id="category"
                    type="category"
                    name="category"
                    value={data.category}
                    className="mt-1 block w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    isFocused={true}
                    onChange={(e) => setData('category', e.target.value)}
                />
                <InputError message={errors.category} className="mt-2 text-red-500 text-sm" />
            </div>

            <div className="mb-6">
                <InputLabel htmlFor="task" value="Task" />
                <TextInput
                    id="task"
                    type="task"
                    name="task"
                    value={data.task}
                    className="mt-1 block w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={(e) => setData('task', e.target.value)}
                />
                <InputError message={errors.task} className="mt-2 text-red-500 text-sm" />
            </div>

            <div className="mb-6">
                <InputLabel htmlFor="start_date" value="Start date" />
                <DatePicker
                    id="start_date"
                    selected={data.start_date ? new Date(data.start_date) : null}
                    onChange={(date) => setData('start_date', formatDate(date))}
                    className="mt-1 block w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <InputError message={errors.start_date} className="mt-2 text-red-500 text-sm" />
            </div>

            <div className="mb-6">
                <InputLabel htmlFor="end_date" value="End date" />
                <DatePicker
                    id="end_date"
                    selected={data.end_date ? new Date(data.end_date) : null}
                    onChange={(date) => setData('end_date', formatDate(date))}
                    className="mt-1 block w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <InputError message={errors.end_date} className="mt-2 text-red-500 text-sm" />
            </div>

            <div className="flex items-center justify-end">
                <PrimaryButton className="ms-4" disabled={processing}>
                    Update
                </PrimaryButton>
            </div>
        </form>
    );
}
