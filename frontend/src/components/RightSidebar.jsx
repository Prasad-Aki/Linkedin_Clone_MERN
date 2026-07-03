import React, { useContext, useEffect, useState } from "react"
import { AuthDatacontext } from "../contexts/Authcontext.jsx"
import { userDataContext } from "../contexts/UserContext.jsx"
import axios from "axios"
import profile from "../assets/profile.jpg"
import ConnectionBtn from "./ConnectionBtn.jsx"
import { FaInfoCircle, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { Link } from "react-router-dom"

function RightSidebar() {
    const { serverurl } = useContext(AuthDatacontext)
    const { UserData } = useContext(userDataContext)
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showMoreNews, setShowMoreNews] = useState(false)

    // Mock Trending News matching LinkedIn professional style
    const allNews = [
        { id: 1, title: "React 19 adoption rises rapidly", time: "1d ago", readers: "4,231 readers" },
        { id: 2, title: "AI coding assistants: The new normal?", time: "18h ago", readers: "12,987 readers" },
        { id: 3, title: "Remote work trends shifting in 2026", time: "2d ago", readers: "8,452 readers" },
        { id: 4, title: "JavaScript state management simplified", time: "3d ago", readers: "3,110 readers" },
        { id: 5, title: "Top skills recruiters want this quarter", time: "12h ago", readers: "24,539 readers" },
        { id: 6, title: "How to handle tech lead transitions", time: "4d ago", readers: "1,894 readers" },
        { id: 7, title: "Green tech startups raise record funding", time: "5d ago", readers: "5,310 readers" }
    ]

    const displayedNews = showMoreNews ? allNews : allNews.slice(0, 4)

    const fetchSuggestions = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${serverurl}/api/user/suggestions`, { withCredentials: true })
            setSuggestions(response.data)
        } catch (error) {
            console.error("Error fetching suggestions:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (UserData) {
            fetchSuggestions()
        }
    }, [UserData, serverurl])

    return (
        <div className="flex flex-col gap-[20px] lg:w-[25%] w-full">
            {/* LinkedIn News Widget */}
            <div className="w-full bg-white shadow-md rounded-lg p-[15px] border border-gray-200">
                <div className="flex justify-between items-center mb-[12px]">
                    <h2 className="text-[16px] font-semibold text-gray-800">LinkedIn News</h2>
                    <FaInfoCircle className="text-gray-500 hover:text-gray-700 cursor-pointer text-[14px]" title="About LinkedIn News" />
                </div>
                
                <ul className="flex flex-col gap-[10px]">
                    {displayedNews.map((news) => (
                        <li key={news.id} className="group cursor-pointer animate-fade-in">
                            <div className="flex items-start gap-[8px]">
                                <span className="text-[6px] mt-[8px] text-gray-500 group-hover:text-blue-600">•</span>
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-medium text-gray-700 group-hover:text-blue-600 leading-tight">
                                        {news.title}
                                    </span>
                                    <span className="text-[11px] text-gray-400 mt-[2px]">
                                        {news.time} • {news.readers}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <button 
                    onClick={() => setShowMoreNews(!showMoreNews)}
                    className="mt-[12px] w-full flex items-center justify-center gap-[6px] py-[6px] rounded hover:bg-gray-100 text-[14px] font-medium text-gray-500 hover:text-gray-700 transition cursor-pointer"
                >
                    {showMoreNews ? (
                        <>
                            Show less <FaChevronUp className="text-[12px]" />
                        </>
                    ) : (
                        <>
                            Show more <FaChevronDown className="text-[12px]" />
                        </>
                    )}
                </button>
            </div>

            {/* People You May Know / Add to Feed Widget */}
            <div className="w-full bg-white shadow-md rounded-lg p-[15px] border border-gray-200">
                <h2 className="text-[16px] font-semibold text-gray-800 mb-[12px]">Add to your feed</h2>
                
                {loading ? (
                    <div className="flex flex-col gap-4 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-[48px] h-[48px] bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-[48px] h-[48px] bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ) : suggestions.length === 0 ? (
                    <p className="text-[13px] text-gray-500 text-center py-2">No recommendations available</p>
                ) : (
                    <div className="flex flex-col gap-[15px]">
                        {suggestions.map((user) => (
                            <div key={user._id} className="flex gap-[12px] items-start border-b border-gray-100 last:border-b-0 pb-[10px] last:pb-0">
                                <Link to={`/profile/${user.userName}`} className="shrink-0">
                                    <img 
                                        className="w-[48px] h-[48px] rounded-full object-cover border border-gray-200 hover:opacity-85 transition" 
                                        src={user.profileImage || profile} 
                                        alt={`${user.firstName} ${user.lastName}`} 
                                    />
                                </Link>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <Link to={`/profile/${user.userName}`} className="hover:underline">
                                        <span className="text-[14px] font-semibold text-gray-700 block truncate">
                                            {user.firstName} {user.lastName}
                                        </span>
                                    </Link>
                                    <span className="text-[12px] text-gray-400 line-clamp-2 leading-tight mb-[8px]">
                                        {user.headline || "Professional at LinkedIn"}
                                    </span>
                                    <div className="scale-90 origin-left mt-[-4px]">
                                        <ConnectionBtn userId={user._id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* LinkedIn Mini Footer */}
            <div className="w-full px-[10px] flex flex-wrap justify-center gap-x-[12px] gap-y-[6px]">
                {["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business Services", "Get the LinkedIn App", "More"].map((link, idx) => (
                    <a key={idx} href="#" className="text-[11px] text-gray-500 hover:text-blue-600 hover:underline transition">
                        {link}
                    </a>
                ))}
                <div className="w-full flex items-center justify-center gap-[6px] mt-[10px] text-[11px] text-gray-600 font-medium">
                    <svg className="w-[12px] h-[12px] text-blue-600 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.8v8.37h2.8v-4.67c0-.25.02-.5.1-.68a1.14 1.14 0 0 1 1-.77c.76 0 1 .52 1 1.29v4.83h2.8M6.5 8.37a1.37 1.37 0 1 0 0-2.75 1.37 1.37 0 0 0 0 2.75M8 18.5V10.13H5.2v8.37H8z" />
                    </svg>
                    <span>LinkedIn Corporation © 2026</span>
                </div>
            </div>
        </div>
    )
}

export default RightSidebar
