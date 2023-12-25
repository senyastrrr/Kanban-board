import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

const KanbanLayout = ({ children }) => {
    const user = usePage().props.auth.user;

    return (
        <div className="flex flex-col">
            <header className="bg-white border-b border-gray-200">
                <nav className="flex items-center flex-shrink-0 w-full h-16 px-10 bg-white bg-opacity-75">
                    <Link href="/" className="flex flex-row sm:justify-center items-center pt-6 sm:pt-0">
                        <svg className="w-10 h-10 text-indigo-600 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <div className="px-10 mt-0">
                            <h1 className="text-2xl font-bold">Team Project Board</h1>
                        </div>
                    </Link>
                    {user ? (
                        <div className="flex items-center absolute right-0">
                            {user.role == 'admin' && (
                                <Link href="/users" className="text-gray-600 hover:text-gray-900 dark:text-gray-500 dark:hover:text-black focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500 mr-4">
                                    Users
                                </Link>
                            )}
                            <div className="relative">
                                <div className="hidden sm:flex sm:items-center sm:ms-6">
                                    <div className="ms-3 relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        {user.name}

                                                        <svg
                                                            className="ms-2 -me-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Link
                                href={route('login')}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500 mr-4"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </header>

            <main className="flex-1">{children}</main>
        </div>
    );
};

export default KanbanLayout;
