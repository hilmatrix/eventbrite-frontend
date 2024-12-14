"use client";

import { API_REVIEWS_CREATE } from '@/constants/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import useAuthRedirect from '../../../hooks/useAuthRedirect';

export default function CreateReview() {
  const { isLoggedIn, getJwtToken } = useAuth();
  const [responseText, setResponseText] = useState('');
  const [reviewForm, setReviewForm] = useState({
    review_rating_id: 0, // backend will modify this
    trx_id: 0, // backend will modify this
    review: '',
    suggestion: '',
    rating: 1, // default to minimum rating
  });
  const router = useRouter();
  const eventId = useParams().id;

  useAuthRedirect();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Math.max(1, Math.min(5, parseInt(value) || 1)) : value, // ensure rating is 1-5
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setResponseText('You must be logged in to submit a review');
      return;
    }

    try {
      const token = getJwtToken();
      const response = await fetch(API_REVIEWS_CREATE + "/" + eventId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_rating_id: reviewForm.review_rating_id, // will be modified by backend
          trx_id: reviewForm.trx_id, // will be modified by backend
          review: reviewForm.review,
          suggestion: reviewForm.suggestion,
          rating: reviewForm.rating,
          created_at:"",
          updated_at:"",
          deleted_at:""
        }),
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        router.push('/account?tab=reviews');
        setReviewForm({
          review_rating_id: 0,
          trx_id: 0,
          review: '',
          suggestion: '',
          rating: 1,
        });
      } else {
        const errorText = await response.text();
        alert(`Failed to submit review: ${errorText}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  return (
    <div className="p-4">
      <Link href="/account?tab=reviews" className="m-4 flex justify-center">
        <button className="rounded-[10px] bg-[#AAAAAA] h-10 p-4 flex items-center justify-center">Back to My Reviews</button>
      </Link>
      <h1 className="text-3xl font-bold">Submit a Review</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label htmlFor="review" className="block">Review</label>
          <textarea
            id="review"
            name="review"
            value={reviewForm.review}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="suggestion" className="block">Suggestion</label>
          <textarea
            id="suggestion"
            name="suggestion"
            value={reviewForm.suggestion}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="rating" className="block">Rating (1-5)</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={reviewForm.rating}
            onChange={handleChange}
            min="1"
            max="5"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded">Submit Review</button>
        </div>
      </form>
      {responseText && <p className="mt-4 text-gray-700">{responseText}</p>}
    </div>
  );
} 
