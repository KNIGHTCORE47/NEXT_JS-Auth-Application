"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


export default function SignupPage() {

    const router = useRouter()
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [loading, setLoading] = useState(false)


    const onSignup = async function () {
        try {
            setLoading(true)

            const response = await axios.post("/api/users/signup", user)

            console.log("Signup success", response.data)
            router.push('/login');

        } catch (error: any) {
            console.log("Signup failed")
            toast.error(error.message)
        }
    }


    useEffect(() => {
        if (user.username.length > 0 && user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }

    }, [user])




    return (
        <div
            className='flex flex-col items-center justify-center min-h-screen py-2 bg-zinc-950'
        >
            <h1>{loading ? "Processing..." : "Signup"}</h1>
            <hr />

            <div className="space-y-6">
                <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={user.username}
                        onChange={e => setUser({ ...user, username: e.target.value })}
                        className="w-full px-3 py-2 text-slate-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                        placeholder='username'
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={e => setUser({ ...user, email: e.target.value })}
                        className="w-full px-3 py-2 text-slate-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                        placeholder='email'
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={e => setUser({ ...user, password: e.target.value })}
                        className="w-full px-3 py-2 text-slate-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                        placeholder='password'
                        required
                    />
                </div>

                <div>
                    <button
                        onClick={onSignup}
                        className='w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300'
                        disabled={buttonDisabled || loading}
                    >
                        {buttonDisabled ? "Signing up.." : "Signup"}
                    </button>

                    <div className='text-center mt-3'>
                        <Link href="/login">Visit login page</Link>
                    </div>
                </div>


            </div>
        </div>
    )
}
