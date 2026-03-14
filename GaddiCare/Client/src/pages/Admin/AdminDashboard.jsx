import AdminSidebar from '@/components/AdminSidebar'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { clearAllAlerts, deleteAlert, fetchAlerts, markAllAlertsRead } from "@/store/slice/getNotifications.jsx"
import { Bell, CheckCircle, Trash2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router'

const AdminDashboard = () => {
  const {pendingWorkshops,loading:pendingWorkshopsLoading}=useSelector((state)=>state.pendingWorkshops);
  const {data:user}=useSelector(state=>state?.userData);
  const {notificationList} = useSelector((state) => state.allNotifications);
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch();

  const userNotifications = notificationList?.filter(notification => 
    notification.userId === user?._id
  ) || []

  const userUnreadCount = userNotifications.filter(notification => 
    notification.read === false
  ).length

  const handleMarkAllRead = async () => {
    if (userUnreadCount > 0) {
      await dispatch(markAllAlertsRead())
      dispatch(fetchAlerts())
    }
  }

  const handleDeleteNotification = async (id) => {
    await dispatch(deleteAlert(id))
    dispatch(fetchAlerts())
  }

  const handleClearAll = async () => {
    await dispatch(clearAllAlerts())
    dispatch(fetchAlerts())
    setIsOpen(false)
  }

  const handleDialogOpen = (open) => {
    setIsOpen(open)
    if (open && userUnreadCount > 0) {
      dispatch(markAllAlertsRead())
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <AdminSidebar count={pendingWorkshops?.length || 0}/>
      
      <div className='flex-1 ml-20 lg:ml-64 overflow-y-auto overflow-x-hidden'>
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.userName || "Admin"}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {userUnreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-orange-600">
                        {userUnreadCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle>Notifications</DialogTitle>
                      <div className="flex gap-2">
                        {userUnreadCount > 0 && (
                          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark all read
                          </Button>
                        )}
                        {userNotifications.length > 0 && (
                          <Button variant="destructive" size="sm" onClick={handleClearAll}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear all
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogHeader>
                  <Separator />
                  <ScrollArea className="h-[400px]">
                    {userNotifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      userNotifications.map((notification) => (
                        <div key={notification._id} className="p-4 hover:bg-gray-50 border-b last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{notification.title}</h4>
                              <p className="text-sm text-gray-600">{notification.content}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteNotification(notification._id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              
              <Avatar>
                <AvatarImage src={`${import.meta.env.VITE_SERVER_URL}/${user?.userImage}`} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <div className="p-2">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard