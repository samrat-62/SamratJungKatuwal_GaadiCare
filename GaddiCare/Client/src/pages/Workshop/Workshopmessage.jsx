import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MoreVertical, Phone, Search, Send } from 'lucide-react'
import { useState } from 'react'

const WorkshopMessages = () => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const conversations = [
    {
      id: 1,
      customerId: '696d28dbefca1bc50d16524a',
      customerName: 'Rajesh Kumar',
      lastMessage: 'Thanks for the update!',
      timestamp: '10 mins ago',
      unread: true,
      vehicle: 'Honda City - DL 01 AB 1234',
      service: 'Oil Change',
      status: 'completed',
      image: '/userImage/2026-01-18-bg.jpg'
    },
    {
      id: 2,
      customerId: '696d28dbefca1bc50d16524b',
      customerName: 'Priya Sharma',
      lastMessage: 'When will my car be ready?',
      timestamp: '1 hour ago',
      unread: false,
      vehicle: 'Maruti Swift - DL 02 CD 5678',
      service: 'Brake Repair',
      status: 'in-progress',
      image: null
    },
    {
      id: 3,
      customerId: '696d28dbefca1bc50d16524c',
      customerName: 'Amit Patel',
      lastMessage: 'Perfect, see you tomorrow',
      timestamp: '2 hours ago',
      unread: false,
      vehicle: 'Hyundai Creta - DL 03 EF 9012',
      service: 'AC Service',
      status: 'accepted',
      image: null
    },
    {
      id: 4,
      customerId: '696d28dbefca1bc50d16524d',
      customerName: 'Sneha Reddy',
      lastMessage: 'Can you send me the estimate?',
      timestamp: '5 hours ago',
      unread: true,
      vehicle: 'Toyota Fortuner - DL 04 GH 3456',
      service: 'Engine Repair',
      status: 'completed',
      image: null
    },
    {
      id: 5,
      customerId: '696d28dbefca1bc50d16524e',
      customerName: 'Vikram Singh',
      lastMessage: 'Thanks for the quick service!',
      timestamp: '1 day ago',
      unread: false,
      vehicle: 'Mahindra Thar - DL 05 IJ 7890',
      service: 'Tire Service',
      status: 'completed',
      image: null
    },
    {
      id: 6,
      customerId: '696d28dbefca1bc50d16524f',
      customerName: 'Ananya Gupta',
      lastMessage: 'When can I pick up my car?',
      timestamp: '2 days ago',
      unread: false,
      vehicle: 'Kia Seltos - DL 06 KL 2345',
      service: 'Battery Service',
      status: 'rejected',
      image: null
    }
  ]

  const messages = selectedChat ? [
    { id: 1, text: 'Hi, I need an oil change for my Honda City', sender: 'customer', timestamp: '10:30 AM' },
    { id: 2, text: 'Sure, we can do that. What\'s your preferred time?', sender: 'workshop', timestamp: '10:32 AM' },
    { id: 3, text: 'Tomorrow morning around 10 AM works for me', sender: 'customer', timestamp: '10:35 AM' },
    { id: 4, text: 'Perfect! Slot booked for tomorrow 10 AM. Please bring your vehicle registration documents.', sender: 'workshop', timestamp: '10:37 AM' },
    { id: 5, text: 'Thanks for the update!', sender: 'customer', timestamp: '10:38 AM' }
  ] : []

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'accepted': { color: 'bg-blue-100 text-blue-800', label: 'Accepted' },
      'in-progress': { color: 'bg-purple-100 text-purple-800', label: 'In Progress' },
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    return (
      <Badge className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    )
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput)
      setMessageInput('')
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Communicate with your customers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-gray-200 shadow-sm lg:col-span-1">
          <CardContent className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-3">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.id === conversation.id
                      ? 'bg-orange-50 border border-orange-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={conversation.image ? `${serverUrl}${conversation.image}` : undefined}
                        alt={conversation.customerName}
                      />
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {getInitials(conversation.customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 truncate">
                          {conversation.customerName}
                        </h3>
                        {conversation.unread && (
                          <Badge className="bg-orange-600 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                            1
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {conversation.timestamp}
                        </span>
                        {getStatusBadge(conversation.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm lg:col-span-2">
          <CardContent className="p-0 h-[600px] flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={selectedChat.image ? `${serverUrl}${selectedChat.image}` : undefined}
                          alt={selectedChat.customerName}
                        />
                        <AvatarFallback className="bg-orange-100 text-orange-600">
                          {getInitials(selectedChat.customerName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedChat.customerName}</h3>
                        <p className="text-sm text-gray-600">{selectedChat.vehicle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(selectedChat.status)}
                          <span className="text-xs text-gray-500">{selectedChat.service}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'workshop' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === 'workshop'
                              ? 'bg-orange-600 text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'workshop' ? 'text-orange-200' : 'text-gray-500'}`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6">
                <div className="text-gray-400 mb-4">
                  <div className="h-16 w-16 rounded-full bg-orange-50 flex items-center justify-center">
                    <svg className="h-8 w-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600 text-center max-w-md">
                  Choose a customer from the list to start messaging
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Conversations</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WorkshopMessages
