import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axiosClient from "@/services/axiosMain";
import { ADD_REVIEW } from "@/routes/serverEndpoints";
import { fetchAllReviews } from "@/store/slice/getAllReviews";

const RatingDialog = ({ 
  open, 
  onOpenChange, 
  workshopId, 
  workshopName,
  userId 
}) => {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const dispatch = fetchAllReviews(); 

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!review.trim()) {
      setError("Please write a review");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosClient.post(
       `${ADD_REVIEW}/${userId}/${workshopId}`,
        {
          rating,
          review
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message ||"Review submitted successfully!");
        await dispatch(fetchAllReviews());
        handleClose();
      }
    } catch (err) {
      console.error("Review submission error:", err);
      setError(err?.response?.data?.message || "Failed to submit review. Please try again.");
      toast.error(err?.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setReview("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-orange-600">
            <Star className="h-6 w-6" />
            Rate {workshopName}
          </DialogTitle>
          <DialogDescription>
            Share your experience to help others choose the best service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">How would you rate your experience?</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-orange-500 text-orange-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {rating === 0 ? "Select a rating" : `${rating} star${rating !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-orange-600" />
              <label className="font-medium text-gray-900">Your Review *</label>
            </div>
            <Textarea
              placeholder="Share details about your experience with this workshop..."
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Minimum 10 characters required
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            <div className={`px-2 py-1 rounded ${rating === 1 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
              Poor
            </div>
            <div className={`px-2 py-1 rounded ${rating === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
              Fair
            </div>
            <div className={`px-2 py-1 rounded ${rating === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
              Good
            </div>
            <div className={`px-2 py-1 rounded ${rating === 4 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
              Very Good
            </div>
            <div className={`px-2 py-1 rounded ${rating === 5 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
              Excellent
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || rating === 0 || review.trim().length < 10}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;