import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <img 
            src="/image/logo.png" 
            alt="Website Logo" 
            className="h-24 w-24 object-contain rounded-lg shadow-md"
          />
        </div>
        
        <h1 className="text-9xl font-bold text-orange-600 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for seems to have taken a wrong turn. 
          It might have been moved, deleted, or never existed in the first place.
        </p>
        
        <Button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Return to Home
        </Button>
        
        <div className="mt-12 pt-8 border-t border-orange-200">
          <p className="text-sm text-gray-500">
            Need help? Check our navigation menu or contact support if you believe this is an error.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;