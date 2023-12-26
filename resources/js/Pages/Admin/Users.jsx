import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';
import KanbanLayout from '../../Layouts/KanbanLayout';
import { usePage } from '@inertiajs/react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  const currentUser = usePage().props.auth.user;

  const fetchUsers = async () => {
    try {
      const userData = await ApiService.get('/users');
      setUsers(userData);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const editUser = (userId) => {
    const user = users.find(user => user.id === userId);
    setEditingUser(user);
  };

  const updateUser = async (userId, formData) => {
    try {
      await ApiService.put(`/users/${userId}`, formData);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const userTasks = await ApiService.get(`/tasks/get-by-user/${userId}`);
      const updatedTasks = userTasks.map((task) => ({
        ...task,
        user_id: currentUser.id,
      }));

      await Promise.all(
        updatedTasks.map((task) =>
          ApiService.put(`/tasks/${task.id}`, task)
        )
      );

      await ApiService.delete(`/users/${userId}`);
      fetchUsers();

    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  return (
    <KanbanLayout>
      <div className="min-h-screen bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200 p-6">
        <h1 className="text-3xl font-semibold mb-4 text-gray-700">Админская страница пользователей</h1>
        <ul>
          {users.map(user => (
            <li key={user.id} className="mb-4 bg-white shadow-md rounded-md p-4">
              {editingUser && editingUser.id === user.id ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateUser(user.id, new FormData(e.target));
                }}>
                  <input className="border rounded-md px-2 py-1 mr-2" type="text" name="name" defaultValue={user.name} />
                  <input className="border rounded-md px-2 py-1 mr-2" type="email" name="email" defaultValue={user.email} />
                  <div className="relative inline-block">
                    <select
                      className="border rounded-md px-2 py-1 pr-8 mr-2 bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      name="role"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button className="bg-green-500 text-white px-4 py-1 rounded-md" type="submit">
                    Сохранить
                  </button>
                </form>
              ) : (
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                  <div className="mt-2">
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-md mr-2" onClick={() => editUser(user.id)}>
                      Редактировать
                    </button>
                    <button className="bg-red-500 text-white px-4 py-1 rounded-md" onClick={() => deleteUser(user.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </KanbanLayout>
  );
};


export default UsersPage;
