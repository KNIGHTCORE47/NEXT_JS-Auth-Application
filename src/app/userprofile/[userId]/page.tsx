"use client"

import React from 'react'

export default function page({ params }: any) {
    return (
        <div
            className='flex flex-col items-center justify-center min-h-screen py-2 bg-zinc-950'
        >
            <div className='text-center space-y-3'>
                <h1 className='text-xl'>Profile Page</h1>

                <h2 className='px-4 py-2 text-white font-medium bg-indigo-600 '>{params.userId}</h2>
            </div>
        </div >
    )
}


