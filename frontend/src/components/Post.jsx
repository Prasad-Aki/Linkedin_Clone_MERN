import React, { useState } from "react"
import moment from "moment"


const Post = ({ id, image, discription, author, like, comment, createdAt }) => {
    const [readmore, Setreadmore] = useState(false)
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
            </div>
        </>
    )
}

export default Post