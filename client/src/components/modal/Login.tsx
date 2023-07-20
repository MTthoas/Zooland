import React, {useState} from 'react'
import axios from 'axios';

export default function Login({setShowModalLogin, setShowModalRegister}: any) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        try {
            const response = await axios.post('/auth/login', { username, password });
            const token = response.data.token;
            console.log(response.data.token);

            localStorage.setItem('username', username);
            localStorage.setItem('token', token);

            window.location.href = '/';
          } catch (error) {
            console.error(error);
            setError('Invalid credentials. Please try again.');
          }
    };

    return (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none modal-container">
          {/*content*/}
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow pb-5 ">
                    <button type="button" onClick={()=> setShowModalLogin(false) } className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="px-6 py-6 lg:px-8">
                        <h3 className="mb-8 text-xl font-medium text-gray-900 ">Sign in to our platform</h3>
                        <form className="space-y-6" action="#" onSubmit={handleSubmit}>
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900"> our username </label>
                                <input value={username} onChange={e => setUsername(e.target.value)} type="username" name="username" id="username" className="bg-gray-50 border border-gray-700 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="azerty123" required/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                                <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-700 text-gray-900 mb-4 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required/>
                            </div>
                            {/* <div className="flex justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required/>
                                    </div>
                                    <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                                </div>
                                <a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                            </div> */}
                              {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" className="w-full text-white bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</button>
                            <div className="text-sm font-medium text-gray-400">
                                Not registered? <a href="#" className="text-gray-700 hover:underline" onClick={() => {
                                    setShowModalLogin(false)
                                    setShowModalRegister(true)
                                }}>Create account</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div> 
        </div>
      );
}
