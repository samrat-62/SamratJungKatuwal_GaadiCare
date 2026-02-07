import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import WorkshopSidebar from '@/components/WorkshopSidebar'
import { Bell } from 'lucide-react'
import { useSelector } from "react-redux"
import { Outlet } from 'react-router'

const WorkshopDashboard = () => {
  const {data:user} = useSelector(state=>state?.userData);
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <WorkshopSidebar serviceRequestsCount={0} messagesCount={0}/>
      
      <div className='flex-1 ml-20 lg:ml-64 overflow-y-auto overflow-x-hidden'>
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workshop Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.workshopName || "Workshop"}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-orange-600">
                  3
                </Badge>
              </Button>
              
              <Avatar>
                <AvatarImage src={`${import.meta.env.SERVER_URL}/${user?.workshopImage}`} />
                <AvatarFallback>WP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default WorkshopDashboard