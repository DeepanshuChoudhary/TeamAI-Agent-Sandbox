import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'

const Project = () => {

    const location = useLocation()

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

    console.log(location.state)

    return (
        <main
            className='h-screen w-screen flex'
        >

            <section className='relative left h-full bg-slate-300 min-w-96 flex flex-col'>

                <header
                    className='flex justify-end px-4 p-2 w-full bg-slate-100'
                >
                    <button
                        className='p-2'
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
                        <i class="ri-group-fill"></i>
                    </button>

                </header>

                <div className='conversation-area flex-grow flex flex-col'>

                    <div className='message-box flex-grow flex flex-col gap-2 p-2'>

                        <div className='incoming message flex flex-col p-2 bg-slate-50 max-w-54 rounded-md'>
                            <small className='opacity-65 text-xs'>example@gmail.com</small>
                            <p className='text-sm'>
                                hello world this is Deepanshu Choudhary I am a software developer
                            </p>
                        </div>

                        <div className='incoming message flex flex-col p-2 bg-slate-50 max-w-54 rounded-md ml-auto'>
                            <small className='opacity-65 text-xs'>example@gmail.com</small>
                            <p className='text-sm'>
                                hello world this is Deepanshu Nagar I am a software developer
                            </p>
                        </div>

                    </div>

                    <div className='inputField flex flex-nowrap'>
                        <input type='text' className='bg-white p-2 px-4 border-none outline-none min-w-5 flex-grow' placeholder='Enter message' />
                        <button
                            className='px-5 bg-slate-950 text-white'
                        ><i className="ri-send-plane-fill"></i></button>
                    </div>

                </div>

                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>

                    <header
                        className='flex justify-end px-3 bg-slate-200'
                    >
                        <button
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                            className='p-2'
                        >
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>

                    <div className='users'>

                        <div className='user flex gap-2 items-center cursor-pointer hover:bg-slate-200 p-2'>

                            <div className='aspect-square rounded-full h-fit w-fit bg-slate-600 flex items-center justify-center p-5 text-white'>
                                <i className="ri-user-3-fill absolute"></i>
                            </div>

                            <h1
                                className='font-semibold text-lg'
                            >username</h1>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    )
}

export default Project