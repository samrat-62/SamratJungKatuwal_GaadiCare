import { Outlet } from "react-router"
import { Toaster } from "./components/ui/sonner"
import { useSelector,useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchAuthUser } from "./store/slice/userSlice"
import SkeletonLoading from "./components/SkeletonLoading"
import { fetchAllWorkshops } from "./store/slice/getAllWorkshops"
import { fetchAllUsers } from "./store/slice/getAllUsers"
import { fetchPendingWorkshops } from "./store/slice/getAllWorkshopRequest"
import { fetchAllBookings } from "./store/slice/getAllBookings"
import { fetchAllReviews } from "./store/slice/getAllReviews"


function App() {
   const dispatch = useDispatch();
   const {data,loading} = useSelector((state) => state.userData);
  //  console.log(userData?.data);
  const {users,loading:usersLoading}=useSelector((state)=>state.allUsers);
   const {allWorkshops,loading:workshopLoading}=useSelector((state)=>state.allWorkshops);
   const {pendingWorkshops,loading:pendingWorkshopsLoading}=useSelector((state)=>state.pendingWorkshops);
   const {bookings,loading:bookingsLoading}=useSelector((state)=>state.allBookings);
   const {reviews,loading:reviewsLoading}=useSelector((state)=>state.allReviews);


   useEffect(() => {
    const fetchData = async () => {
      if (!data) {
        await dispatch(fetchAuthUser());
      }
      if(users?.length===0){
        await dispatch(fetchAllUsers());
      }
      if(allWorkshops?.length===0){
        await dispatch(fetchAllWorkshops());
      }
      if(pendingWorkshops?.length===0){
        await dispatch(fetchPendingWorkshops());
      }
      if(bookings?.length===0){
        await dispatch(fetchAllBookings());
      }
      if(reviews?.length===0){
        await dispatch(fetchAllReviews());
      }
    };
    fetchData();
  }, []);


  if(loading || usersLoading || workshopLoading || pendingWorkshopsLoading) return <SkeletonLoading/>;
  return (
    <>
    <Toaster position="top-right" />
     <Outlet />
    </>
  )
}

export default App
