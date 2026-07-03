import React, { useContext, useState } from "react"
import moment from "moment"
import { AiOutlineLike } from "react-icons/ai"
import { AiOutlineComment } from "react-icons/ai"
import { AiFillLike } from "react-icons/ai"
import { IoMdSend } from "react-icons/io"
import { AuthDatacontext } from "../contexts/Authcontext.jsx"
import axios from "axios"
import { userDataContext } from "../contexts/UserContext.jsx"
import { useEffect } from "react"
import { io } from "socket.io-client"
import ConnectionBtn from "./ConnectionBtn.jsx"

const socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
})

import { BsThreeDots } from "react-icons/bs"

const Post = ({ id, image, description, author, like, comment, createdAt }) => {
    const [readmore, Setreadmore] = useState(false)
    const { serverurl } = useContext(AuthDatacontext)
    const [likes, Setlikes] = useState(like || [])
    const { UserData, getpostData, handlegetProfile } = useContext(userDataContext)
    const [commentContent, SetcommentContent] = useState("")
    const [comments, Setcomments] = useState(comment || [])
    const [showComments, SetshowComments] = useState(false)
    const [isEditing, SetisEditing] = useState(false)
    const [editContent, SeteditContent] = useState(description)
    const [showMenu, SetshowMenu] = useState(false)

    const handleDeletePost = async () => {
        try {
            if (window.confirm("Are you sure you want to delete this post?")) {
                await axios.delete(`${serverurl}/api/post/delete/${id}`, { withCredentials: true })
                getpostData()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditPost = async () => {
        try {
            await axios.put(`${serverurl}/api/post/edit/${id}`, { description: editContent }, { withCredentials: true })
            SetisEditing(false)
            getpostData()
        } catch (error) {
            console.log(error)
        }
    }

    const likepost = async () => {
        try {
            const result = await axios.post(serverurl + `/api/post/like/${id}`, {}, { withCredentials: true })
            Setlikes(result.data.like)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        socket.on("likeUpdated", ({ postId, likes }) => {
            if (postId == id) {
                Setlikes(likes)
            }
        })
        socket.on("commentAdded", ({ postId, comm }) => {
            if (postId == id) {
                Setcomments(comm)
            }
        })
        return () => {
            socket.off("likeUpdated")
            socket.off("commentAdded")
        }
    }, [id])


    useEffect(() => {
        Setlikes(like || [])
    }, [like])

    useEffect(() => {
        Setcomments(comment || [])
    }, [comment])

    const handelComment = async (e) => {
        e.preventDefault()
        try {
            const result = await axios.post(serverurl + `/api/post/comment/${id}`, {
                content: commentContent
            }, { withCredentials: true })
            Setcomments(result.data.comment)
            console.log(result.data.comment)
            SetcommentContent("")
        } catch (error) {
            console.log(error)
        }
    }



    return (

        <>
            <div className="w-full min-h-[200px] bg-white rounded-lg p-[20px] flex flex-col gap-[10px]">
                <div className="flex justify-between items-start w-full">
                    <div className="flex gap-[10px] cursor-pointer" onClick={() => handlegetProfile(author?.userName)} >
                        <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center">
                            <img className="h-full" src={author.profileImage} alt="" />
                        </div>

                        <div>
                            <div className="text-[19px] font-semibold text-gray-700">
                                {author?.firstName} {author?.lastName}
                            </div>
                            <div className="text-[15px] text-gray-700">
                                {author?.headline}
                            </div>
                            <div className="text-[15px] text-gray-700">
                                {moment(createdAt).fromNow()}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-[10px] items-center relative">
                        {UserData._id != author._id ? (
                            <ConnectionBtn userId={author._id} />
                        ) : (
                            <div className="relative">
                                <BsThreeDots
                                    className="w-[22px] h-[22px] text-gray-500 cursor-pointer hover:text-gray-700"
                                    onClick={() => SetshowMenu(prev => !prev)}
                                />
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-[120px] bg-white border rounded shadow-md z-[50]">
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                            onClick={() => {
                                                SetisEditing(true)
                                                SetshowMenu(false)
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                                            onClick={() => {
                                                handleDeletePost()
                                                SetshowMenu(false)
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
                {isEditing ? (
                    <div className="w-full flex flex-col gap-2 mt-2">
                        <textarea
                            className="w-full border rounded p-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows={3}
                            value={editContent}
                            onChange={(e) => SeteditContent(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-semibold"
                                onClick={() => {
                                    SetisEditing(false)
                                    SeteditContent(description)
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-semibold"
                                onClick={handleEditPost}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={`w-full ${!readmore ? "max-h-[70px] overflow-hidden" : ""} overflow-hidden`}>{description}</div>
                        <div className="font-semibold cursor-pointer" onClick={() => { Setreadmore(prev => !prev) }}>{readmore ? "read less..." : "read more..."}</div>
                    </>
                )}
                {image && <div className="w-full h-[300px] overflow-hidden flex justify-center">
                    <img src={image} alt="" />
                </div>}
                <div>
                    <div className="w-full justify-between items-center p-[20px] flex border-b-2">
                        <div className="flex items-center justify-center gap-[5px] text-[18px]">
                            <AiOutlineLike className="text-[#1ebbff] w-[20px] h-[20px]" /> <span>{likes.length}</span>
                        </div>
                        <div className="flex items-center justify-center gap-[5px] text-[19px] cursor-pointer" onClick={() => { SetshowComments(prev => !prev) }}>
                            <span>{comments.length}</span> comment
                        </div>
                    </div>

                    <div className="w-full flex gap-[20px] p-[20px]">
                        <div
                            className="flex items-center gap-[5px] text-[19px] font-semibold cursor-pointer"
                            onClick={likepost}
                        >
                            {likes.includes(UserData._id) ? (
                                <AiFillLike className="text-[#07a4ff] w-[24px] h-[24px]" />
                            ) : (
                                <AiOutlineLike className=" w-[24px] h-[24px]" />
                            )}
                            <span>
                                {likes.includes(UserData._id) ? "Liked" : "Like"}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-[5px] text-[19px] font-semibold cursor-pointer" onClick={() => { SetshowComments(prev => !prev) }}><AiOutlineComment className="w-[24px] h-[24px]" /><span>comment</span></div>
                        </div>

                    </div>
                    {showComments && <div>
                        <form onSubmit={handelComment} className="w-full flex justify-between items-center border-b-2 p-[10px]">
                            <input type="text" className="outline-none border-none w-full" placeholder="leave a comment" onChange={(e) => { SetcommentContent(e.target.value) }} value={commentContent} />
                            <button><IoMdSend className="w-[24px] h-[24px] text-[#07a4ff] " /></button>

                        </form>
                        <div className="flex flex-col gap-[20px]">
                            {comments.map((com) => (
                                <div key={com._id} className="border-b pb-2">
                                    <div className="w-full flex justify-start p-[10px] cursor-pointer gap-[10px]">
                                        <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center">
                                            <img className="w-full h-full object-cover" src={com?.user?.profileImage} alt="" />
                                        </div>
                                        <div className="text-[15px] font-semibold text-gray-700 flex items-center">{com?.user?.firstName} {com?.user?.lastName}</div>
                                        <div className="flex items-center">
                                            {moment(com.createdAt).fromNow()}
                                        </div>
                                    </div>
                                    <div className="pl-[30px]">{com.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default Post