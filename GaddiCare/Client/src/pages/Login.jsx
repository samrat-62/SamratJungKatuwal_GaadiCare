import { useState } from "react"
import { Link } from "react-router"
import { Mail, Lock, Car, CheckCircle, DollarSign, Headphones, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import EmailDialog from "@/components/EmailDialog"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import axiosClient from "@/services/axiosMain"
import { LOGIN_USER } from "@/routes/serverEndpoints"
import { useDispatch } from "react-redux"
import { fetchAuthUser } from "@/store/slice/userSlice"

const Login = () => {
  const dispatch=useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    if (!password) return "Password is required"
    if (password.length < 6) return "Password must be at least 6 characters"
    return ""
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }

    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }))
      } else {
        setErrors(prev => ({ ...prev, email: "" }))
      }
    }

    if (field === 'password' && value) {
      const passwordError = validatePassword(value)
      if (passwordError) {
        setErrors(prev => ({ ...prev, password: passwordError }))
      } else {
        setErrors(prev => ({ ...prev, password: "" }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit =async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    const loginData = {
      email: formData.email,
      password: formData.password,
    }

  try{
    const response = await axiosClient.post(LOGIN_USER,loginData,{ withCredentials:true });
    if(response.status===200){
      await dispatch(fetchAuthUser());
      toast.success(response?.data?.message||"Login successful.");
      switch(response?.data?.userType){
        case "vehicleOwner":
          navigate("/");
          break;
        case "workshop":
          navigate("/workshopdashboard");
          break;
        case "admin":
          navigate("/admindashboard");
          break;
        default:
          navigate("/");
      }
    }
  }catch(error){
    console.log("Login error:",error)
    toast.error(error?.response?.data?.message||"Login failed. Please try again.")
  }
  finally{
    setIsLoading(false) 
  }
  }

  const features = [
    {
      icon: CheckCircle,
      title: "Verified Workshops",
      description: "Only trusted and certified service centers"
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden charges, clear cost breakdown"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always here to help with your queries"
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          <div className="lg:col-span-5 p-8 sm:p-12">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-blue-600 rounded-lg">
                 <img src="/image/logo.png" alt="GaddiCare Logo" className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900">GaddiCare</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 mb-8">Sign in to continue to GaddiCare</p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <button onClick={() => setOpenEmailDialog(true)} className="text-sm text-primary hover:underline cursor-pointer">
                  Forgot Password?
                </button>
              </div>
              {
                openEmailDialog && (
                  <EmailDialog
                    open={openEmailDialog}
                    onOpenChange={setOpenEmailDialog}
                  />
                )
              }

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-medium hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>

          <div
            className="relative hidden lg:block lg:col-span-7 bg-cover bg-center"
            style={{ backgroundImage: "url('/image/login.jpg')" }}
          >
            <div className="h-full bg-gradient-to-t from-black/80 via-black/50 to-black/30 p-16 flex items-center">
              <div className="text-white max-w-lg">
                <h2 className="text-4xl font-bold mb-6">
                  Your Trusted Vehicle Care Partner
                </h2>
                <p className="text-gray-200 mb-10">
                  Connect with verified workshops, track your services, and manage your vehicle maintenance in one place.
                </p>

                <div className="space-y-8">
                  {features.map((feature) => {
                    const Icon = feature.icon
                    return (
                      <div key={feature.title} className="flex gap-4">
                        <div className="bg-white/20 p-3 rounded-full">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{feature.title}</h3>
                          <p className="text-gray-200">{feature.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login