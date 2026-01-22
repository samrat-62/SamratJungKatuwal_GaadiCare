import { Outlet } from "react-router"
import { Toaster } from "./components/ui/sonner"
import { useSelector,useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchAuthUser } from "./store/slice/userSlice"
import SkeletonLoading from "./components/SkeletonLoading"


function App() {
   const dispatch = useDispatch();
   const {data,loading} = useSelector((state) => state.userData);
  //  console.log(userData?.data);
   

   useEffect(() => {
    const fetchData = async () => {
      if (!data) {
        await dispatch(fetchAuthUser());
      }
    };
    fetchData();
  }, []);


  if(loading) return <SkeletonLoading/>;
  return (
    <>
    <Toaster/>
     <Outlet />
    </>
  )
}

export default App
