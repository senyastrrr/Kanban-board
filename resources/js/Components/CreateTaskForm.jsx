import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../services/ApiService';
import formatDate from '../services/date';

export default function CreateTaskForm({ statusId, setCreateForm }) {
    const { data, setData, processing, errors } = useForm({
        category: '',
        task: '',
        start_date: formatDate(new Date().toISOString()),
        end_date: null,
        status_id: statusId,
        user_id: usePage().props.auth.user.id,
    });

    const submit = async (e) => {
        e.preventDefault();

        try {
            await ApiService.post('/tasks', data);
            window.location.reload();
            setCreateForm(false);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };

    return (
        <form onSubmit={submit} className="max-w-md mx-auto">
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-6 mt-3 text-gray-700 text-center">Create task</h3>
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
                <textarea
                    id="task"
                    name="task"
                    value={data.task}
                    className="mt-1 block w-full h-32 px-4 py-2 text-lg border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    onChange={(e) => setData('task', e.target.value)}
                ></textarea>
                <InputError message={errors.task} className="mt-2 text-red-500 text-sm" />
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
                    Submit
                </PrimaryButton>
            </div>
        </form>
    );
}
