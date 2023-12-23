import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

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
      await ApiService.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  const createUser = async () => {
    try {
      await ApiService.post('/users', newUser);
      setNewUser({ name: '', email: '' });
      fetchUsers();
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200 p-6">
      <h1 className="text-3xl font-semibold mb-4 text-gray-700">Админская страница пользователей</h1>
      <div className="mb-4">
        <input
          className="border rounded-md px-2 py-1 mr-2"
          type="text"
          placeholder="Имя"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          className="border rounded-md px-2 py-1 mr-2"
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded-md" onClick={createUser}>
          Добавить
        </button>
      </div>
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
                <button className="bg-green-500 text-white px-4 py-1 rounded-md" type="submit">
                  Сохранить
                </button>
              </form>
            ) : (
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
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
  );
};

export default UsersPage;
