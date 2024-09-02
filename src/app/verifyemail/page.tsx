"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
// import { useRouter } from 'next/router'


export default function VerifyEmailPage() {

    // const router = useRouter()

    const [token, setToken] = useState("")
    const [verifyEmailStatus, setVerifyEmailStatus] = useState(false)
    const [error, setError] = useState(false)

    const verifyUserEmail = async function () {
        try {
            const response = await axios.post("/api/users/verifyemail", { token })
            setVerifyEmailStatus(true)

            setError(false)

            console.log(response.data.message);

        } catch (error: any) {
            setError(true)
            console.log(error.response.data)
            toast.error(error.response.data)
        }
    }


    useEffect(() => {
        setError(false)

        //NOTE - Extract token using Vanilla JS
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "")

        //NOTE - Extract token using Next JS
        // const { query } = router;
        // const urlToken = query.token
        // setToken(String(urlToken) || "")

    }, [])

    useEffect(() => {
        setError(false)

        if (token.length > 0) {
            verifyUserEmail()
        }
    }, [token])



    return (
        <div
            className='flex flex-col items-center justify-center min-h-screen py-2 bg-zinc-950 space-y-3'
        >
            <h1 className='text-xl'>Verify Email</h1>
            <h2 className='px-4 py-2 text-white font-medium bg-indigo-600'>
                {token ? `${token}` : "Invalid Token"}
            </h2>

            {verifyEmailStatus && (
                <div className='space-y-3'>
                    <h2
                        className='text-green-300'
                    >
                        Verified!! 🎉🎉
                    </h2>

                    <hr />

                    <Link href="/login">
                        Visit Login page
                    </Link>
                </div>
            )}

            {error && (
                <div>
                    <h2
                        className='text-red-500 text-2xl'
                    >
                        Error!!
                    </h2>
                </div>
            )}
        </div>
    )
}


