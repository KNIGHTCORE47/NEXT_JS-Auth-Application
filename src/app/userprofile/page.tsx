"use client"

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UserProfilePage() {
    const router = useRouter()
    const [userData, setUserData] = useState("")

    const getUserInfo = async function () {
        try {
            const response = await axios.post("/api/users/profile")

            console.log(response.data.data._id);

            setUserData(response.data.data._id)

        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        }
    }

    const onLogout = async function () {
        try {

            const response = await axios.get("/api/users/logout",)
            toast.success(response.data.message)

            router.push("/login")

        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        }
    }

    return (
        <div
            className='flex flex-col items-center justify-center min-h-screen py-2 bg-zinc-950'
        >
            <div className="w-64 space-y-3">
                <div className='text-center space-y-3'>
                    <h1 className='text-xl'>Profile Page</h1>
                    <hr />
                    <h2>
                        {userData === "" ? "Nothing" : <Link href={`/userprofile/${userData}`}>{userData}</Link>}
                    </h2>
                    <hr />
                </div>

                <div className='w-full flex justify-between px-4'>
                    <div>
                        <button
                            onClick={getUserInfo}
                            className='w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300'

                        >
                            Get User
                        </button>
                    </div>

                    <div>
                        <button
                            onClick={onLogout}
                            className='w-full px-6 py-2 text-white font-medium bg-orange-600 hover:bg-orange-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-300'

                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}


