import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Lock, Check, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import axiosClient from '@/services/axiosMain';
import { UPDATE_PASSWORD } from '@/routes/serverEndpoints';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate(-1);
    }
  }, [email, navigate]);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validatePassword = () => {
    if (!passwordPattern.test(newPassword)) {
      return false;
    }
    if (newPassword !== confirmPassword) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      toast.error('Please check password requirements');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axiosClient.post(UPDATE_PASSWORD,{email, newPassword});

      if (response.status === 200) {
        toast.success('Password reset successfully');
        navigate('/login');
      } else {
        toast.error(response.data?.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message||'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Enter your new password below
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-10"
                    placeholder="Confirm new password"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center">
                  {newPassword.length >= 8 ? (
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className={`text-sm ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-600'}`}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center">
                  {/(?=.*[a-z])/.test(newPassword) ? (
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className={`text-sm ${/(?=.*[a-z])/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}`}>
                    At least one lowercase letter
                  </span>
                </div>
                <div className="flex items-center">
                  {/(?=.*[A-Z])/.test(newPassword) ? (
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className={`text-sm ${/(?=.*[A-Z])/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}`}>
                    At least one uppercase letter
                  </span>
                </div>
                <div className="flex items-center">
                  {/(?=.*\d)/.test(newPassword) ? (
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className={`text-sm ${/(?=.*\d)/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}`}>
                    At least one number
                  </span>
                </div>
                <div className="flex items-center">
                  {/(?=.*[@$!%*?&])/.test(newPassword) ? (
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className={`text-sm ${/(?=.*[@$!%*?&])/.test(newPassword) ? 'text-green-600' : 'text-gray-600'}`}>
                    At least one special character (@$!%*?&)
                  </span>
                </div>
                <div className="flex items-center">
                  {newPassword && newPassword === confirmPassword ? (
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className={`text-sm ${newPassword && newPassword === confirmPassword ? 'text-green-600' : 'text-gray-600'}`}>
                    Passwords match
                  </span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading || !validatePassword()}
                  className="w-full py-3.5 text-lg"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;