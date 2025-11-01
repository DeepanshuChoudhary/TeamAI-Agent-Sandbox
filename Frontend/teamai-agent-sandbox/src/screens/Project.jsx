import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import axios from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js';
import { UserContext } from '../context/user.context.jsx'
import Markdown from 'markdown-to-jsx';
import { useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { getWebContainer } from '../config/webContainer.js';

const SyntaxHighlightedCode = (props) => {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])

    return <code {...props} ref={ref} />
}

const Project = () => {


    const location = useLocation()


    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState([])
    const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const messageBox = React.createRef();
    // const messageBox = useRef(null);

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [fileTree, setFileTree] = useState({
        // "app.js": {
        //     content: `const express = require('express');`
        // },
        // "package.json": {
        //     content: `{"name":"temp-server"}`
        // }
    })

    const [currentFile, setCurrentFile] = useState(null);
    const [openFiles, setOpenFiles] = useState([]);

    const [webContainer, setWebContainer] = useState(null);

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            }
            else {
                newSelectedUserId.add(id)
            }
            // console.log(Array.from(newSelectedUserId))
            return newSelectedUserId;
        })
    }

    // console.log(location.state)


    const addCollaborators = () => {

        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)
        }).catch((err) => {
            console.log(err);
        })
    }

    const send = () => {

        // console.log(user)

        sendMessage('project-message', {
            message,
            sender: user
        })

        // appendOutgoingMessage(message);
        setMessages(prevMessages => [...prevMessages, { sender: user, message }])
        setMessage("")
    }

    const WriteAiMessage = (message) => {

        const messageObject = JSON.parse(message)

        return (

            <div
                className='overflow-auto bg-slate-900 text-white rounded-sm p-3'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />

            </div>
        )
    }

    useEffect(() => {

        initializeSocket(project._id);

        if(!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log('Container Started')
            })
        }

        const handleMessage = (data) => {
            // console.log(data);
            // console.log(JSON.parse(data.message));
            // appendIncomingMessage(data)

            const message = JSON.parse(data.message);

            console.log(message);

            webContainer?.mount(message.fileTree);

            if (message.fileTree) {
                setFileTree(message.fileTree);
            }

            setMessages(prevMessages => [...prevMessages, data]);
        }

        receiveMessage('project-message', handleMessage);

        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            console.log(res.data.project)
            setProject(res.data.project);
        })

        axios.get('/users/all').then(res => {
            setUsers(res.data.users)
        }).catch((err) => {
            console.log(err);
        })

    }, []);


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (

        <main className='h-screen w-screen flex'>

            <section className='relative left h-full bg-slate-300 min-w-96 flex flex-col'>

                <header
                    className='flex justify-between items-center px-4 p-2 w-full bg-slate-100'
                >

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='flex gap-2'>
                        <i className="ri-user-add-fill mr-1"></i>
                        <p>Add Collaborators</p>
                    </button>

                    <button
                        className='p-2'
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
                        <i className="ri-group-fill"></i>
                    </button>

                </header>

                <div className='conversation-area flex-grow flex flex-col overflow-auto'>

                    {/* <div
                        ref={messageBox}
                        className='message-box flex-grow flex flex-col gap-2 p-2 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth'>

                    </div> */}

                    <div
                        ref={messageBox}
                        className='message-box flex-grow flex flex-col gap-2 p-2 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth'>

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-54'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md}`}
                            >
                                <small className='opacity-65 text-xs'>
                                    {msg.sender.email}
                                </small>


                                {msg.sender._id === 'ai' ?

                                    WriteAiMessage(msg.message)
                                    : <p className='text-sm'>{msg.message}</p>
                                }
                            </div>
                        ))}

                    </div>

                    <div className='inputField flex flex-nowrap'>
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            type='text'
                            className='bg-white p-2 px-4 border-none outline-none min-w-5 flex-grow' placeholder='Enter message' />
                        <button
                            onClick={send}
                            className='px-5 bg-slate-950 text-white'
                        ><i className="ri-send-plane-fill"></i></button>
                    </div>

                </div>

                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition - all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>


                    <header
                        className='flex justify-between items-center  px-3 bg-slate-200'
                    >
                        <h1
                            className='font-semibold'
                        >Collaborators</h1>
                        <button
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                            className='p-2'
                        >
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>

                    <div className='users'>

                        {project.users && project.users.map(user => {
                            return (
                                <div
                                    key={user._id}
                                    className='user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center'
                                >
                                    <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            )
                        })}


                    </div>

                </div>

            </section>

            <section className="right bg-red-50 flex-grow h-full flex">

                <div className='explorer h-full max-w-64 min-w-52 bg-slate-200'>
                    <div className='file-tree w-full'>
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([...new Set([...openFiles, file])])
                                    }}
                                    className='tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full'>
                                    <p
                                        className='font-semibold text-lg'
                                    >{file}</p>
                                </button>
                            ))
                        }

                    </div>
                </div>
                
                {currentFile && (
                    <div className='code-editor flex flex-col flex-grow h-full bg-slate-50 shrink'>

                        <div className='top flex '>
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                                        <p
                                            className='font-semibold text-lg'
                                        >{file}</p>
                                    </button>
                                ))
                            }
                        </div>
                        <div className='bottom flex flex-grow max-w-full shrink overflow-auto'>
                            {

                                fileTree[currentFile] && (
                                    <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                                        <pre className="hljs h-full p-2">
                                            <code
                                                className="hljs h-full outline-none"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={(e) => {
                                                    const updatedContent = e.target.innerText;
                                                    setFileTree(prevFileTree => ({
                                                        ...prevFileTree,
                                                        [currentFile]: {
                                                            ...prevFileTree[currentFile],
                                                            content: updatedContent,
                                                        },
                                                    }));
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value
                                                }}
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    paddingBottom: '25rem',
                                                    counterSet: 'line-numbering',
                                                }}
                                            />
                                        </pre>
                                    </div>
                                )



                                /*fileTree[currentFile] && (
                                    <textarea
                                        value={fileTree[currentFile].content}
                                        onChange={(e) => {
                                            setFileTree({
                                                ...fileTree,
                                                [currentFile]: {
                                                    content: e.target.value
                                                }
                                            })
                                        }}
                                        className='code-editor-area w-full h-full p-4 overflow-auto flex-grow bg-slate-800 text-white outline-none'
                                    ></textarea>
                                )*/
                            }
                        </div>



                    </div>
                
                )}

            </section>

            {isModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white p-4 rounded-md w-96 max-w-full relative'>

                        <header className='flex justify-between items-center md-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>

                        <div className='users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto'>
                            {users.map(user => (
                                <div key={user._id} className={`user cursor-pointer hover: bg - slate - 200 ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""} p - 2 flex gap - 2 items - center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            ))}

                        </div>

                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>

                    </div>
                </div>
            )}

        </main>

    )
}


export default Project