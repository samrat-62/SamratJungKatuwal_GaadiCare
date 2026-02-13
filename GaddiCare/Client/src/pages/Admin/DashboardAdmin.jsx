import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, Clock, TrendingDown, TrendingUp, Users, Wrench } from "lucide-react";
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const DashboardAdmin = () => {
  const { pendingWorkshops, loading: pendingWorkshopsLoading } = useSelector((state) => state.pendingWorkshops);
  const { users, loading: usersLoading } = useSelector((state) => state.allUsers);
  const { allWorkshops, loading: allWorkshopsLoading } = useSelector((state) => state.allWorkshops);
  
  const [todayStats, setTodayStats] = useState({
    pendingRequests: 0,
    newUsers: 0,
    newWorkshops: 0
  });
  const [userRegistrationData, setUserRegistrationData] = useState([]);
  const [workshopRegistrationData, setWorkshopRegistrationData] = useState([]);
  const [yearlyComparison, setYearlyComparison] = useState({
    currentYearUsers: 0,
    previousYearUsers: 0,
    currentYearWorkshops: 0,
    previousYearWorkshops: 0
  });


  useEffect(() => {
    if (users && allWorkshops && pendingWorkshops) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);


      const todayPendingRequests = pendingWorkshops.filter(workshop => {
        const createdAt = new Date(workshop.createdAt);
        return createdAt >= today && createdAt < tomorrow;
      }).length;


      const todayNewUsers = users.filter(user => {
        const createdAt = new Date(user.createdAt);
        return createdAt >= today && createdAt < tomorrow;
      }).length;

      const todayNewWorkshops = allWorkshops.filter(workshop => {
        const createdAt = new Date(workshop.createdAt);
        return createdAt >= today && createdAt < tomorrow;
      }).length;

      setTodayStats({
        pendingRequests: todayPendingRequests,
        newUsers: todayNewUsers,
        newWorkshops: todayNewWorkshops
      });

    
      calculateChartData();
    }
  }, [users, allWorkshops, pendingWorkshops]);


  const calculateChartData = () => {
    if (!users || !allWorkshops) return;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    

    const userData = [];
    const workshopData = [];
    

    const previousYear = currentYear - 1;
    let currentYearUsers = 0;
    let previousYearUsers = 0;
    let currentYearWorkshops = 0;
    let previousYearWorkshops = 0;
    
  
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(currentYear, month, 1);
      const monthEnd = new Date(currentYear, month + 1, 0);
      
    
      let monthlyUsers = 0;
      let monthlyWorkshops = 0;
      
      if (month <= currentMonth) {
    
        const usersInMonth = users.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate >= monthStart && userDate <= monthEnd;
        });
        monthlyUsers = usersInMonth.length;
        
   
        const workshopsInMonth = allWorkshops.filter(workshop => {
          const workshopDate = new Date(workshop.createdAt);
          return workshopDate >= monthStart && workshopDate <= monthEnd;
        });
        monthlyWorkshops = workshopsInMonth.length;
      }
      
      userData.push({
        name: months[month],
        month: month + 1,
        users: monthlyUsers,
        totalUsers: monthlyUsers
      });
      
      workshopData.push({
        name: months[month],
        month: month + 1,
        workshops: monthlyWorkshops,
        totalWorkshops: monthlyWorkshops
      });
      
      currentYearUsers += monthlyUsers;
      currentYearWorkshops += monthlyWorkshops;
    }
    

    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(previousYear, month, 1);
      const monthEnd = new Date(previousYear, month + 1, 0);
      

      const monthlyUsers = users.filter(user => {
        const userDate = new Date(user.createdAt);
        return userDate >= monthStart && userDate <= monthEnd;
      });
      

      const monthlyWorkshops = allWorkshops.filter(workshop => {
        const workshopDate = new Date(workshop.createdAt);
        return workshopDate >= monthStart && workshopDate <= monthEnd;
      });
      
      previousYearUsers += monthlyUsers.length;
      previousYearWorkshops += monthlyWorkshops.length;
    }
    
    setUserRegistrationData(userData);
    setWorkshopRegistrationData(workshopData);
    
    setYearlyComparison({
      currentYearUsers,
      previousYearUsers,
      currentYearWorkshops,
      previousYearWorkshops
    });
  };

  const totalPendingRequests = pendingWorkshops?.length || 0;
  const totalActiveWorkshops = allWorkshops?.length || 0;
  const totalUsers = users?.length || 0;

  const getThisMonthStats = () => {
    if (!users || !allWorkshops) return { users: 0, workshops: 0 };
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    
    const monthlyUsers = users.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate >= monthStart && userDate <= monthEnd;
    });
    
    const monthlyWorkshops = allWorkshops.filter(workshop => {
      const workshopDate = new Date(workshop.createdAt);
      return workshopDate >= monthStart && workshopDate <= monthEnd;
    });
    
    return {
      users: monthlyUsers.length,
      workshops: monthlyWorkshops.length
    };
  };

  const thisMonthStats = getThisMonthStats();

  const todaysBookings = 487;

  const stats = [
    {
      title: "Today's Requests",
      value: totalPendingRequests.toString(),
      change: "Pending workshop requests",
      icon: <Clock className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-700"
    },
    {
      title: "Active Workshops",
      value: totalActiveWorkshops.toString(),
      change: `+${thisMonthStats.workshops} this month`,
      icon: <Wrench className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Total Users",
      value: totalUsers.toString(),
      change: `+${thisMonthStats.users} this month`,
      icon: <Users className="h-6 w-6" />,
      color: "bg-green-100 text-green-700"
    },
    {
      title: "Today's Bookings",
      value: todaysBookings.toString(),
      change: "Demo data",
      icon: <Activity className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-700"
    }
  ];

  const UserTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.indexOf(label);
      
      const isFutureMonth = monthIndex > currentMonth;
      
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {label} {new Date().getFullYear()}
            {isFutureMonth && (
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Future Month</span>
            )}
          </p>
          <div className="space-y-1">
            <p className={`text-sm ${isFutureMonth ? 'text-gray-400' : 'text-green-600'}`}>
              <span className="font-medium">New Users:</span> {isFutureMonth ? '0 (Not yet)' : payload[0]?.value || 0}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };


  const WorkshopTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.indexOf(label);
      

      const isFutureMonth = monthIndex > currentMonth;
      
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {label} {new Date().getFullYear()}
            {isFutureMonth && (
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Future Month</span>
            )}
          </p>
          <div className="space-y-1">
            <p className={`text-sm ${isFutureMonth ? 'text-gray-400' : 'text-blue-600'}`}>
              <span className="font-medium">New Workshops:</span> {isFutureMonth ? '0 (Not yet)' : payload[0]?.value || 0}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };


  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 100; 
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const userGrowth = calculateGrowth(yearlyComparison.currentYearUsers, yearlyComparison.previousYearUsers);
  const workshopGrowth = calculateGrowth(yearlyComparison.currentYearWorkshops, yearlyComparison.previousYearWorkshops);

  const getCurrentMonthName = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    return monthNames[currentDate.getMonth()];
  };

  const currentMonthName = getCurrentMonthName();

  return (
    <main className="flex-1 bg-gray-50 ml-64">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, Admin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-700 font-medium mt-1">{stat.title}</p>
                    <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Year-to-Year Growth ({new Date().getFullYear() - 1} vs {new Date().getFullYear()})
            </CardTitle>
            <p className="text-sm text-gray-500">
              Data for {new Date().getFullYear()} includes registrations up to {currentMonthName}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    User Growth
                  </h3>
                  <div className={`flex items-center gap-1 ${parseFloat(userGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(userGrowth) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-medium">{userGrowth}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{new Date().getFullYear() - 1}</p>
                    <p className="text-2xl font-bold text-gray-900">{yearlyComparison.previousYearUsers}</p>
                    <p className="text-xs text-gray-500 mt-1">Full Year Total</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{new Date().getFullYear()}</p>
                    <p className="text-2xl font-bold text-gray-900">{yearlyComparison.currentYearUsers}</p>
                    <p className="text-xs text-gray-500 mt-1">Jan - {currentMonthName} Total</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Workshop Growth
                  </h3>
                  <div className={`flex items-center gap-1 ${parseFloat(workshopGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(workshopGrowth) >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="font-medium">{workshopGrowth}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{new Date().getFullYear() - 1}</p>
                    <p className="text-2xl font-bold text-gray-900">{yearlyComparison.previousYearWorkshops}</p>
                    <p className="text-xs text-gray-500 mt-1">Full Year Total</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{new Date().getFullYear()}</p>
                    <p className="text-2xl font-bold text-gray-900">{yearlyComparison.currentYearWorkshops}</p>
                    <p className="text-xs text-gray-500 mt-1">Jan - {currentMonthName} Total</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section - Only Two Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Registration Chart */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Registrations {new Date().getFullYear()}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Monthly user registration trend (real data up to {currentMonthName}, future months show as 0)
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userRegistrationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#666" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      stroke="#666" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<UserTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="New Users"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users (Jan - {currentMonthName})</p>
                    <p className="text-2xl font-bold text-gray-900">{yearlyComparison.currentYearUsers}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{userGrowth}%</p>
                    <p className="text-xs text-gray-500">vs same period last year</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Workshop Registrations {new Date().getFullYear()}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Monthly workshop registration trend (real data up to {currentMonthName}, future months show as 0)
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workshopRegistrationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#666" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      stroke="#666" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip content={<WorkshopTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Bar
                      dataKey="workshops"
                      name="New Workshops"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Workshops (Jan - {currentMonthName})</p>
                    <p className="text-2xl font-bold text-gray-900">{yearlyComparison.currentYearWorkshops}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">+{workshopGrowth}%</p>
                    <p className="text-xs text-gray-500">vs same period last year</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default DashboardAdmin;