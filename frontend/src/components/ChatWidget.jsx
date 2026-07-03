import React, { useState, useEffect, useRef, useContext } from "react"
import { userDataContext } from "../contexts/UserContext"
import { AuthDatacontext } from "../contexts/Authcontext"
import { io } from "socket.io-client"
import axios from "axios"
import profile from "../assets/profile.jpg"
import { IoSend } from "react-icons/io5"
import { ImCross } from "react-icons/im"
import { BsChatTextFill } from "react-icons/bs"

const socket = io("http://localhost:3000")

function ChatWidget() {
    const { UserData } = useContext(userDataContext)
    const { serverurl } = useContext(AuthDatacontext)
    const [isOpen, SetisOpen] = useState(false)
    const [contacts, Setcontacts] = useState([])
    const [selectedContact, SetselectedContact] = useState(null)
    const [messages, Setmessages] = useState([])
    const [typedMessage, SettypedMessage] = useState("")
    const [unreadContacts, SetunreadContacts] = useState(new Set())
    
    const messagesEndRef = useRef(null)

    // Load active contacts (connections)
    useEffect(() => {
        if (UserData?._id) {
            const fetchContacts = async () => {
                try {
                    const result = await axios.get(`${serverurl}/api/connection`, { withCredentials: true })
                    Setcontacts(result.data)
                } catch (error) {
                    console.log("ChatWidget: Error loading contacts", error)
                }
            }
            fetchContacts()
            socket.emit("register", UserData._id)
        }
    }, [UserData?._id, serverurl])

    // Load messages when contact changes
    useEffect(() => {
        if (selectedContact) {
            const fetchMessages = async () => {
                try {
                    const result = await axios.get(`${serverurl}/api/message/chat/${selectedContact._id}`, { withCredentials: true })
                    Setmessages(result.data)
                } catch (error) {
                    console.log("ChatWidget: Error loading messages", error)
                }
            }
            fetchMessages()
            
            // Remove from unread list
            SetunreadContacts(prev => {
                const updated = new Set(prev)
                updated.delete(selectedContact._id)
                return updated
            })
        } else {
            Setmessages([])
        }
    }, [selectedContact, serverurl])

    // Listen to real-time incoming messages
    useEffect(() => {
        const handleIncomingMessage = (msg) => {
            if (selectedContact && (msg.sender === selectedContact._id || msg.receiver === selectedContact._id)) {
                Setmessages(prev => [...prev, msg])
            } else {
                // Mark contact as unread
                SetunreadContacts(prev => new Set(prev).add(msg.sender))
            }
        }

        socket.on("receiveMessage", handleIncomingMessage)

        return () => {
            socket.off("receiveMessage", handleIncomingMessage)
        }
    }, [selectedContact])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!typedMessage.trim() || !selectedContact) return
        
        try {
            const result = await axios.post(`${serverurl}/api/message/send/${selectedContact._id}`, {
                content: typedMessage
            }, { withCredentials: true })
            
            Setmessages(prev => [...prev, result.data])
            SettypedMessage("")
        } catch (error) {
            console.log("ChatWidget: Error sending message", error)
        }
    }

    if (!UserData) return null

    return (
        <div className="fixed bottom-0 right-[40px] z-[95] flex items-end gap-[15px] pointer-events-none">
            
            {/* Active chat window (Only shows when a contact is selected) */}
            {selectedContact && (
                <div className="w-[320px] h-[380px] bg-white border border-gray-300 shadow-2xl rounded-t-lg flex flex-col pointer-events-auto">
                    {/* Header */}
                    <div className="bg-[#0A66C2] text-white p-[10px] rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-[8px]">
                            <img 
                                src={selectedContact.profileImage || profile} 
                                className="w-[30px] h-[30px] rounded-full object-cover border border-white"
                                alt="" 
                            />
                            <span className="font-semibold text-[14px]">
                                {selectedContact.firstName} {selectedContact.lastName}
                            </span>
                        </div>
                        <button 
                            onClick={() => SetselectedContact(null)}
                            className="text-white hover:text-gray-200 text-xs p-1"
                        >
                            <ImCross className="w-[10px] h-[10px]" />
                        </button>
                    </div>

                    {/* Messages pane */}
                    <div className="flex-1 overflow-y-auto p-[10px] bg-gray-50 flex flex-col gap-[8px]">
                        {messages.map((msg, index) => {
                            const isMe = msg.sender === UserData._id
                            return (
                                <div 
                                    key={index}
                                    className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[75%] p-[8px] rounded-lg text-[13px] ${
                                        isMe ? "bg-[#0A66C2] text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message input */}
                    <form onSubmit={handleSendMessage} className="p-[8px] border-t flex items-center gap-[8px]">
                        <input 
                            type="text" 
                            placeholder="Write a message..."
                            value={typedMessage}
                            onChange={(e) => SettypedMessage(e.target.value)}
                            className="flex-1 border rounded-full px-[12px] py-[6px] text-[13px] outline-none focus:border-blue-500"
                        />
                        <button 
                            type="submit"
                            className="bg-[#0A66C2] hover:bg-blue-700 text-white rounded-full p-[8px] flex items-center justify-center transition-colors"
                        >
                            <IoSend className="w-[12px] h-[12px]" />
                        </button>
                    </form>
                </div>
            )}

            {/* Contacts Drawer */}
            <div className={`w-[280px] bg-white border border-gray-300 shadow-2xl rounded-t-lg flex flex-col pointer-events-auto transition-all duration-300 ${
                isOpen ? "h-[380px]" : "h-[45px]"
            }`}>
                {/* Header */}
                <div 
                    onClick={() => SetisOpen(prev => !prev)}
                    className="h-[45px] bg-[#0A66C2] text-white px-[15px] rounded-t-lg flex items-center justify-between cursor-pointer"
                >
                    <div className="flex items-center gap-[8px]">
                        <BsChatTextFill className="w-[16px] h-[16px]" />
                        <span className="font-semibold text-[14px]">Messaging</span>
                    </div>
                    {unreadContacts.size > 0 && (
                        <span className="bg-red-500 text-white rounded-full text-[9px] w-[14px] h-[14px] flex items-center justify-center font-bold">
                            {unreadContacts.size}
                        </span>
                    )}
                </div>

                {/* Contacts List */}
                {isOpen && (
                    <div className="flex-1 overflow-y-auto">
                        {contacts.length === 0 ? (
                            <div className="text-[12px] text-gray-400 text-center py-8">
                                Connect with professionals to start chatting.
                            </div>
                        ) : (
                            contacts.map((contact) => {
                                const hasUnread = unreadContacts.has(contact._id)
                                return (
                                    <div 
                                        key={contact._id}
                                        onClick={() => SetselectedContact(contact)}
                                        className={`flex items-center gap-[10px] p-[10px] cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                                            selectedContact?._id === contact._id ? "bg-blue-50" : ""
                                        }`}
                                    >
                                        <div className="relative">
                                            <img 
                                                src={contact.profileImage || profile} 
                                                className="w-[35px] h-[35px] rounded-full object-cover" 
                                                alt="" 
                                            />
                                            {hasUnread && (
                                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white animate-pulse" />
                                            )}
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className={`text-[13px] ${hasUnread ? "font-bold text-gray-900" : "text-gray-700"}`}>
                                                {contact.firstName} {contact.lastName}
                                            </span>
                                            <span className="text-[10px] text-gray-400 -mt-[2px] truncate w-[180px]">
                                                {contact.headline || `@${contact.userName}`}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatWidget
