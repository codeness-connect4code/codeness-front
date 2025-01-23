import React, { useState, useEffect } from 'react';// useHistory for React Router v5
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MentoringPostDetail = () => {
  const { mentoringPostId } = useParams();
  const [mentoringPost, setMentoringPost] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  useEffect(() => {
    const fetchMentoringPostDetail = async () => {
      try {
        const response = await axios.get(`/mentoring/{mentoringPostId}`);
        setMentoringPost(response.data.data);
      } catch (error) {
        console.error('Error fetching mentoring post detail:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/mentoring-posts/${mentoringPostId}/reviews?page=${currentPage}&size=${reviewsPerPage}`);
        setReviews(response.data.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchMentoringPostDetail();
    fetchReviews();
  }, [mentoringPostId, currentPage]);

  if (!mentoringPost) return <div>Loading...</div>;

  return (
      <div>
        <div>
          <img src={mentoringPost.mentorProfilePicture} alt="Mentor Profile" />
          <h2>{mentoringPost.mentorNickname}</h2>
          <p>{mentoringPost.company}</p>
        </div>
        <h1>{mentoringPost.title}</h1>
        <p>Field: {mentoringPost.field}</p>
        <p>Career: {mentoringPost.career} years</p>
        <p>Region: {mentoringPost.region}</p>
        <p>Price: {mentoringPost.price} per hour</p>
        <p>Description: {mentoringPost.description}</p>
        <p>Average Rating: {mentoringPost.starRating}</p>
        <h2>Reviews</h2>
        {reviews.map((review) => (
            <div key={review.id}>
              <p>Rating: {review.starRating}</p>
              <p>{review.content}</p>
              <p>Created: {review.createdAt}</p>
            </div>
        ))}
        <button>Apply for Mentoring</button>
      </div>
  );
};

export default MentoringPostDetail;
