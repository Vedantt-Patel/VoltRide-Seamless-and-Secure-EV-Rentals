"use client"

import { useState, useRef, useEffect } from "react"

const ChatbotWindow = ({ isAdmin, onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: isAdmin
        ? "Hello Admin! How can I assist you with the management system today?"
        : "Hello! How can I help you with your e-bike rental today?",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputMessage.trim()) return

    // Add user message
    const newMessages = [...messages, { type: "user", content: inputMessage }]
    setMessages(newMessages)
    setInputMessage("")

    // Simulate bot response
    setTimeout(() => {
      let botResponse
      if (isAdmin) {
        botResponse = getAdminBotResponse(inputMessage)
      } else {
        botResponse = getUserBotResponse(inputMessage)
      }
      setMessages((prev) => [...prev, { type: "bot", content: botResponse }])
    }, 1000)
  }

  const getAdminBotResponse = (message) => {
    // Add your admin bot logic here
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes("report")) {
      return "You can generate reports from the Reports section in the admin dashboard. Need more specific guidance?"
    } else if (lowerMessage.includes("user")) {
      return "User management can be accessed from the Users tab. You can view, edit, or manage user permissions there."
    } else {
      return "How else can I assist you with the admin system?"
    }
  }

  const getUserBotResponse = (message) => {
    // Add your user bot logic here
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes("book")) {
      return "To book an e-bike, go to the Locations page, select your preferred station, and choose an available bike."
    } else if (lowerMessage.includes("payment")) {
      return "We accept credit cards, debit cards, and digital wallets. Your payment information is securely stored."
    } else {
      return "How else can I help you with your e-bike rental?"
    }
  }

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">{isAdmin ? "Admin Support" : "E-Bike Rental Support"}</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatbotWindow

