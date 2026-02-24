import React, { useContext, useState } from "react"
import moment from "moment"
import { AiOutlineLike } from "react-icons/ai"
import { AiOutlineComment } from "react-icons/ai"
import { AuthDatacontext } from "../contexts/Authcontext.jsx"
import axios from "axios"


const Post = ({ id, image, discription, author, like, comment, createdAt }) => {
    const [readmore, Setreadmore] = useState(false)
    const { serverurl } = useContext(AuthDatacontext)

    const likepost = async () => {
        try {
            const result = await axios.get(serverurl + `/api/post/like/${id}`, {withCredentials:true})
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <>
            <div className="w-full min-h-[200px] bg-white rounded-lg p-[20px] flex flex-col gap-[10px]">
                <div className="flex justify-start items-start">
                    <div className=" flex justify-center items-start gap-[10px]">
                        <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center">
                            <img className="h-full" src={author.profileImage || profile} alt="" />
                        </div>
                        <div>
                            <div className="text-[19px] font-semibold text-gray-700"> {author?.firstName} {author?.lastName}</div>
                            <div className="text-[15px] text-gray-700"> {author?.headline} </div>
                            <div className="text-[15px] text-gray-700"> {moment(createdAt).fromNow()} </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
                <div className={`w-full ${!readmore ? "max-h-[70px] overflow-hidden" : ""} overflow-hidden`}>{discription}</div>
                <div className="font-semibold cursor-pointer" onClick={() => { Setreadmore(prev => !prev) }}>{readmore ? "read less..." : "read more..."}</div>
                {image && <div className="w-full h-[300px] overflow-hidden flex justify-center">
                    <img src={image} alt="" />
                </div>}
                <div>
                    <div className="w-full justify-between items-center p-[20px] flex border-b-2">
                        <div className="flex items-center justify-center gap-[5px] text-[18px]">
                            <AiOutlineLike className="text-[#1ebbff] w-[20px] h-[20px]" /> <span>{like.length}</span>
                        </div>
                        <div className="flex items-center justify-center gap-[5px] text-[19px]">
                            <span>{comment.length}</span> comment
                        </div>
                    </div>

                    <div className="w-full flex gap-[20px] p-[20px]">
                        <div className="flex items-center justify-center gap-[5px] text-[19px] font-semibold" onClick={likepost}><AiOutlineLike className="w-[24px] h-[24px]" /> <span>Like</span></div>

                        <div>
                            <div className="flex items-center justify-center gap-[5px] text-[19px] font-semibold"><AiOutlineComment className="w-[24px] h-[24px]" /><span>comment</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Post