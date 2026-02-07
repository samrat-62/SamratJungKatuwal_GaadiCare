import AdminSidebar from '@/components/AdminSidebar';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';

const AdminDashboard = () => {
  const {pendingWorkshops,loading:pendingWorkshopsLoading}=useSelector((state)=>state.pendingWorkshops);
  // console.log(pendingWorkshops,"pending workshops in admin dashboard");
  
  return (
     <div className='flex min-h-screen'>
      <AdminSidebar count={pendingWorkshops?.length || 0}/>
      <div className='flex-1 lg:ml-2 overflow-y-auto  overflow-x-hidden'>
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminDashboard
