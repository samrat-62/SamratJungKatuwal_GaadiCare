import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DELETE_USER_ROOM, GET_USER_ROOMS, GET_USER_ROOM_MESSAGES, UPLOAD_CHAT_FILE } from '@/routes/serverEndpoints';
import axiosClient from '@/services/axiosMain';
import { useSocket } from '@/services/socketProvider';
import {
  CheckCheck,
  Clock,
  Download,
  ExternalLink,
  File,
  Loader2,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Trash2,
  User,
  X
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const ChatPage = () => {
  const navigate = useNavigate();
  const { data: user } = useSelector(state => state?.userData || {});
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);
  const [deletingChat, setDeletingChat] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleIncomingMessage = (message) => {
      if (selectedChat && message.chatRoom === selectedChat._id) {
        setMessages(prev => {
          const filtered = prev.filter(msg => !msg.isTemp);
          return [...filtered, message];
        });
      }
      
      updateChatLastMessage(message.chatRoom, {
        text: message.text || (message.format === 'image' ? '📷 Image' : message.format === 'file' ? '📄 File' : ''),
        createdAt: message.createdAt,
        _id: message._id,
        format: message.format,
        attachment: message.attachment
      });
    };

    const handleSentAck = (data) => {
      setSendingMessage(false);
      setMessages(prev => prev.filter(msg => !msg.isTemp));
      
      if (selectedChat && data.roomId === selectedChat._id) {
        updateChatLastMessage(data.roomId, {
          text: data.text || (data.format === 'image' ? '📷 Image' : data.format === 'file' ? '📄 File' : ''),
          createdAt: data.createdAt,
          _id: data.chatId,
          format: data.format,
          attachment: data.attachment
        });
      }
    };

    const handleSendError = () => {
      toast.error('Failed to send message');
      setSendingMessage(false);
      setUploadingFile(false);
      setMessages(prev => prev.filter(msg => !msg.isTemp));
    };

    const handleRoomJoined = () => {
      console.log('Successfully joined room');
    };

    const handleRoomError = () => {
      toast.error('Failed to join chat room');
    };

    socket.on('receiveChat', handleIncomingMessage);
    socket.on('sendSuccess', handleSentAck);
    socket.on('sendFailed', handleSendError);
    socket.on('joinSuccess', handleRoomJoined);
    socket.on('joinFailed', handleRoomError);

    return () => {
      socket.off('receiveChat', handleIncomingMessage);
      socket.off('sendSuccess', handleSentAck);
      socket.off('sendFailed', handleSendError);
      socket.off('joinSuccess', handleRoomJoined);
      socket.off('joinFailed', handleRoomError);
    };
  }, [socket, user?._id, selectedChat]);

  useEffect(() => {
    if (socket && selectedChat?._id) {
      socket.emit('joinChat', selectedChat._id);
      return () => {
        socket.emit('leaveChat', selectedChat._id);
      };
    }
  }, [socket, selectedChat]);

  const fetchUserChats = async () => {
    if (!user?._id) return;
    setLoadingChats(true);
    try {
      const response = await axiosClient.get(
        `${GET_USER_ROOMS}`,
        { withCredentials: true }
      );
      
      if (response?.status === 200) {
        const chatData = response.data.data || [];
        setChats(chatData);
        if (chatData.length > 0 && !selectedChat) {
          setSelectedChat(chatData[0]);
          fetchChatMessages(chatData[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      toast.error('Failed to load chats');
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchChatMessages = async (roomId) => {
    if (!roomId) return;
    setLoadingMessages(true);
    try {
      const response = await axiosClient.get(
        `${GET_USER_ROOM_MESSAGES}/${roomId}`,
        { withCredentials: true }
      );
      if (response?.status === 200) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchUserChats();
  }, [user?._id]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user || !socket) return;

    setSendingMessage(true);
    const tempMessageId = `temp_${Date.now()}`;
    const tempMessage = {
      _id: tempMessageId,
      sender: {
        user: {
          _id: user._id,
          userName: user.userName,
          userImage: user.userImage,
          workshopName: user.workshopName,
          workshopImage: user.workshopImage,
          userType: user.userType
        }
      },
      chatRoom: selectedChat._id,
      format: 'text',
      text: newMessage,
      createdAt: new Date(),
      isTemp: true
    };

    setMessages(prev => [...prev, tempMessage]);
    
    updateChatLastMessage(selectedChat._id, {
      text: newMessage,
      createdAt: new Date(),
      _id: tempMessageId,
      format: 'text',
      sender: tempMessage.sender
    });

    setNewMessage('');

    socket.emit('sendChat', {
      chatRoom: selectedChat._id,
      text: newMessage,
      format: 'text',
      sender: user._id
    });
  };

  const handleFileUpload = async (file) => {
    if (!file || !selectedChat || !user || !socket) return;
    
    const fileType = file.type.startsWith('image/') ? 'image' : 'file';
    setUploadingFile(true);
    
    const tempMessageId = `temp_${fileType}_${Date.now()}`;
    const tempMessage = {
      _id: tempMessageId,
      sender: {
        user: {
          _id: user._id,
          userName: user.userName,
          userImage: user.userImage,
          workshopName: user.workshopName,
          workshopImage: user.workshopImage,
          userType: user.userType
        }
      },
      chatRoom: selectedChat._id,
      format: fileType,
      text: '',
      attachment: '',
      createdAt: new Date(),
      isTemp: true,
      isUploading: true
    };

    setMessages(prev => [...prev, tempMessage]);
    
    updateChatLastMessage(selectedChat._id, {
      text: fileType === 'image' ? '📷 Image' : '📄 File',
      createdAt: new Date(),
      _id: tempMessageId,
      format: fileType,
      sender: tempMessage.sender
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await axiosClient.post(
        UPLOAD_CHAT_FILE,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFileProgress(progress);
          }
        }
      );

      if (uploadResponse.status === 200) {
        const fileUrl = uploadResponse.data.fileUrl;
        
        socket.emit('sendChat', {
          chatRoom: selectedChat._id,
          format: fileType,
          attachment: fileUrl,
          sender: user._id
        });
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
      setMessages(prev => prev.filter(msg => msg._id !== tempMessageId));
    } finally {
      setUploadingFile(false);
      setFileProgress(0);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchChatMessages(chat._id);
  };

  const handleDeleteChat = async (chatId) => {
    setDeletingChat(true);
    try {
      const response = await axiosClient.delete(
        `${DELETE_USER_ROOM}/${chatId}`,
        { withCredentials: true }
      );

      if (response?.status === 200) {
        setChats(prev => prev.filter(chat => chat._id !== chatId));
        
        if (selectedChat?._id === chatId) {
          const remainingChats = chats.filter(chat => chat._id !== chatId);
          if (remainingChats.length > 0) {
            setSelectedChat(remainingChats[0]);
            fetchChatMessages(remainingChats[0]._id);
          } else {
            setSelectedChat(null);
            setMessages([]);
          }
        }
        
        toast.success('Chat deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast.error(error.response?.data?.error || 'Failed to delete chat');
    } finally {
      setDeletingChat(false);
    }
  };

  const getOtherParticipant = useCallback((chat) => {
    if (!chat?.members || !user) return null;
    const currentUserId = user._id;
    
    const otherMember = chat.members.find(member => 
      member.user?._id?.toString() !== currentUserId.toString()
    );

    if (!otherMember || !otherMember.user) return null;

    return {
      _id: otherMember.user._id,
      userName: otherMember.user.userName || otherMember.user.workshopName,
      userImage: otherMember.user.userImage || otherMember.user.workshopImage,
      userType: otherMember.user.userType,
      workshopName: otherMember.user.workshopName,
      workshopImage: otherMember.user.workshopImage,
      email: otherMember.user.email,
      model: otherMember.model
    };
  }, [user]);

  const getChatOwner = useCallback((chat) => {
    if (!chat?.owner) return null;
    return {
      _id: chat.owner.user?._id,
      model: chat.owner.model
    };
  }, []);

  const isChatOwner = useCallback((chat) => {
    if (!chat || !user) return false;
    const owner = getChatOwner(chat);
    return owner?._id?.toString() === user._id.toString();
  }, [user, getChatOwner]);

  const getMessageSender = useCallback((message) => {
    if (!message?.sender?.user) return null;
    return {
      _id: message.sender.user._id,
      userName: message.sender.user.userName || message.sender.user.workshopName,
      userImage: message.sender.user.userImage || message.sender.user.workshopImage,
      workshopName: message.sender.user.workshopName,
      workshopImage: message.sender.user.workshopImage,
      userType: message.sender.user.userType
    };
  }, []);

  const updateChatLastMessage = (roomId, lastMessage) => {
    setChats(prev => prev.map(chat => 
      chat._id === roomId 
        ? { 
            ...chat, 
            recentMessage: lastMessage, 
            updatedAt: lastMessage.createdAt || new Date()
          }
        : chat
    ));
    
    if (selectedChat?._id === roomId) {
      setSelectedChat(prev => prev ? {
        ...prev,
        recentMessage: lastMessage,
        updatedAt: lastMessage.createdAt || new Date()
      } : null);
    }
  };

  const filteredChats = useMemo(() => {
    return chats
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .filter(chat => {
        if (!searchTerm.trim()) return true;
        
        const query = searchTerm.toLowerCase();
        const otherParticipant = getOtherParticipant(chat);
        const userName = otherParticipant?.userName?.toLowerCase() || '';
        const workshopName = otherParticipant?.workshopName?.toLowerCase() || '';
        const lastMessage = chat?.recentMessage?.text?.toLowerCase() || '';
        
        return userName.includes(query) || workshopName.includes(query) || lastMessage.includes(query);
      });
  }, [chats, searchTerm, getOtherParticipant]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMessageContent = (message) => {
    if (!message) return 'No messages yet';
    
    if (message.text && message.text.trim()) {
      const content = message.text;
      if (content.length > 30) {
        return content.substring(0, 30) + '...';
      }
      return content;
    }
    
    if (message.format === 'image') return '📷 Image';
    if (message.format === 'file') return '📄 File';
    
    return 'No messages yet';
  };

  const renderMessageContent = (message) => {
    if (message.format === 'text') {
      return <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>;
    } else if (message.format === 'image') {
      return (
        <div className="relative group">
          <img 
            src={`${import.meta.env.VITE_SERVER_URL}/${message.attachment}`}
            alt="Shared image"
            className="rounded-lg max-w-xs max-h-64 object-cover cursor-pointer"
            onClick={() => window.open(`${import.meta.env.VITE_SERVER_URL}/${message.attachment}`, '_blank')}
          />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 bg-black/60 hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`${import.meta.env.VITE_SERVER_URL}/${message.attachment}`, '_blank');
              }}
            >
              <ExternalLink className="h-3 w-3 text-white" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 bg-black/60 hover:bg-black/80"
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = `${import.meta.env.VITE_SERVER_URL}/${message.attachment}`;
                link.download = `image-${Date.now()}.jpg`;
                link.click();
              }}
            >
              <Download className="h-3 w-3 text-white" />
            </Button>
          </div>
        </div>
      );
    } else if (message.format === 'file') {
      return (
        <div className="flex items-center gap-2 p-2 bg-orange-100 rounded-lg">
          <File className="h-5 w-5 text-orange-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{message.attachment?.split('/')?.pop() || 'File'}</p>
            <p className="text-xs text-orange-500">File</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-orange-200"
            onClick={() => {
              const link = document.createElement('a');
              link.href = `${import.meta.env.VITE_SERVER_URL}/${message.attachment}`;
              link.download = message.attachment?.split('/')?.pop() || 'file';
              link.click();
            }}
          >
            <Download className="h-4 w-4 text-orange-600" />
          </Button>
        </div>
      );
    }
  };

  if (loadingChats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Chats Yet</h2>
          <p className="text-gray-600 mb-6">Start a conversation by contacting someone</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-200">
          <div className="flex flex-col md:flex-row h-[calc(100vh-180px)]">
            <div className="w-full md:w-1/3 border-r border-orange-200 flex flex-col">
              <div className="p-6 border-b border-orange-200 bg-gradient-to-r from-orange-600 to-amber-600">
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <p className="text-orange-100 text-sm mt-1">Chat with workshop owners</p>
              </div>
              
              <div className="p-4 border-b border-orange-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  {filteredChats.map((chat) => {
                    const otherParticipant = getOtherParticipant(chat);
                    const isOwner = isChatOwner(chat);
                    
                    return (
                      <div
                        key={chat._id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 relative ${
                          selectedChat?._id === chat._id
                            ? 'bg-orange-50 border border-orange-200'
                            : 'hover:bg-orange-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-orange-300">
                              <AvatarImage 
                                src={otherParticipant?.userImage || otherParticipant?.workshopImage
                                  ? `${import.meta.env.VITE_SERVER_URL}/${otherParticipant.userImage || otherParticipant.workshopImage}`
                                  : undefined
                                }
                                alt={otherParticipant?.userName || otherParticipant?.workshopName}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                                {getUserInitials(otherParticipant?.userName || otherParticipant?.workshopName)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          
                          <div 
                            className="flex-1 min-w-0" 
                            onClick={() => handleSelectChat(chat)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate text-sm">
                                {otherParticipant?.userName || otherParticipant?.workshopName || 'Unknown User'}
                              </h3>
                              <span className="text-xs text-orange-600">
                                {formatTime(chat.updatedAt || chat.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {getMessageContent(chat.recentMessage)}
                            </p>
                          </div>

                          {isOwner && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteChat(chat._id)}
                              disabled={deletingChat}
                            >
                              {deletingChat && selectedChat?._id === chat._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b border-orange-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-orange-300">
                        <AvatarImage 
                          src={getOtherParticipant(selectedChat)?.userImage || getOtherParticipant(selectedChat)?.workshopImage
                            ? `${import.meta.env.VITE_SERVER_URL}/${getOtherParticipant(selectedChat).userImage || getOtherParticipant(selectedChat).workshopImage}`
                            : undefined
                          }
                          alt={getOtherParticipant(selectedChat)?.userName || getOtherParticipant(selectedChat)?.workshopName}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                          {getUserInitials(getOtherParticipant(selectedChat)?.userName || getOtherParticipant(selectedChat)?.workshopName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {getOtherParticipant(selectedChat)?.userName || getOtherParticipant(selectedChat)?.workshopName || 'Unknown User'}
                        </h2>
                        <p className="text-sm text-orange-600">
                          {getOtherParticipant(selectedChat)?.userType === 'workshop' ? 'Workshop Owner' : 'Vehicle Owner'}
                        </p>
                      </div>
                    </div>
                    
                    {isChatOwner(selectedChat) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeleteChat(selectedChat._id)}
                        disabled={deletingChat}
                      >
                        {deletingChat ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete Chat
                      </Button>
                    )}
                  </div>

                  <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-orange-50 to-amber-50"
                  >
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-orange-600">
                        <MessageSquare className="h-12 w-12 mb-4 text-orange-300" />
                        <p className="mb-2 font-medium">No messages yet</p>
                        <p className="text-sm">Say hello to start the conversation</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => {
                          const sender = getMessageSender(message);
                          const isMe = sender?._id === user?._id;
                          const isTemp = message.isTemp;
                          
                          return (
                            <div
                              key={message._id}
                              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs lg:max-w-md ${
                                isMe ? 'ml-auto' : 'mr-auto'
                              }`}>
                                {!isMe && sender && (
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-700">
                                      {sender.userName || sender.workshopName}
                                    </span>
                                    <span className="text-xs text-orange-600">
                                      {formatTime(message.createdAt)}
                                    </span>
                                  </div>
                                )}
                                
                                <div className={`rounded-lg p-3 ${
                                  isMe 
                                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-900 border border-orange-200 rounded-bl-none'
                                }`}>
                                  {renderMessageContent(message)}
                                  {isTemp && message.isUploading && (
                                    <div className="mt-2">
                                      <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                                          style={{ width: `${fileProgress}%` }}
                                        />
                                      </div>
                                      <p className="text-xs mt-1 text-orange-300">
                                        Uploading {fileProgress}%
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                {isMe && (
                                  <div className="flex items-center justify-end gap-2 mt-1">
                                    <span className="text-xs text-orange-600">
                                      {formatTime(message.createdAt)}
                                    </span>
                                    {isTemp ? (
                                      <Clock className="h-3 w-3 text-orange-400 animate-spin" />
                                    ) : (
                                      <CheckCheck className="h-3 w-3 text-orange-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-orange-200 bg-white">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile || !selectedChat}
                        className="flex-shrink-0 border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-400"
                      >
                        {uploadingFile ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Paperclip className="h-5 w-5" />
                        )}
                      </Button>
                      
                      <div className="flex-1 relative">
                        <Input
                          type="text"
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={!selectedChat || sendingMessage}
                          className="pr-12 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                        <Button
                          type="button"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || !selectedChat || sendingMessage}
                        >
                          {sendingMessage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-orange-600">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                    <p className="font-medium">Select a chat to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;