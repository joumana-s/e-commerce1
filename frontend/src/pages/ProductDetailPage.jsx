import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { addToCart } from '../services/cartService';
import { getReviews, createReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [quantity, setQuantity] = useState(1);
  const [addToCartMsg, setAddToCartMsg] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewStatus, setReviewStatus] = useState('idle');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');


  useEffect(() => {
    setStatus('loading');
    getProduct(id)
      .then((res) => {
        setProduct(res.data.product);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setReviewStatus('loading');
    getReviews(id)
      .then((res) => {
        setReviews(res.data.reviews || []);
        setReviewStatus('loaded');
      })
      .catch(() => {
        setReviews([]);
        setReviewStatus('error');
      });
  }, [id]);

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await createReview(id, reviewForm);
      setReviews((prev) => [...prev, res.data.review]);
      setReviewForm({ rating: 5, comment: '' });
      setReviewMsg('Review submitted');
      setTimeout(() => setReviewMsg(''), 2000);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Could not submit review');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      setAddToCartMsg('Added to cart');
      setTimeout(() => setAddToCartMsg(''), 2000);

    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    }
  };

  if (status === 'loading') return <p className="loading" style={{ padding: '1.5rem' }}>Loading...</p>;
  if (status === 'error' || !product) return <p className="notice" style={{ padding: '1.5rem' }}>Product not found.</p>;

  return (
    <div className="product-detail">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
        />
      )}
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        {product.category?.name && <p className="product-detail-category">Category: {product.category.name}</p>}
        <p className="product-detail-price">${Number(product.price).toFixed(2)}</p>
        <p className="product-detail-desc">{product.description}</p>
        <div className="product-detail-actions">
          <label>
            Quantity:{' '}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
          <button onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>

        {addToCartMsg && (
          <p className="notice" style={{ marginTop: 12 }}>{addToCartMsg}</p>
        )}

        <div style={{ marginTop: 24 }}>
          <h2>Reviews</h2>
          {reviewStatus === 'loading' && <p>Loading reviews...</p>}
          {reviewStatus === 'error' && <p className="notice">Could not load reviews.</p>}
          {reviews.length === 0 && reviewStatus === 'loaded' && <p>No reviews yet.</p>}
          <ul className="reviews-list" style={{ listStyle: 'none', padding: 0 }}>
            {reviews.map((r) => (
              <li key={r.id} style={{ marginBottom: 12, borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <strong>Rating: {r.rating}/5</strong>
                {r.comment && <p>{r.comment}</p>}
              </li>
            ))}
          </ul>

          {user && (
            <form onSubmit={handleCreateReview} style={{ marginTop: 16 }}>
              <h3>Write a review</h3>
              <label>
                Rating:{' '}
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                >
                  {[1,2,3,4,5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <br />
              <textarea
                placeholder="Your review"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
                style={{ width: '100%', marginTop: 8 }}
              />
              <br />
              <button type="submit" style={{ marginTop: 8 }}>Submit review</button>
              {reviewMsg && <p className="notice" style={{ marginTop: 8 }}>{reviewMsg}</p>}
            </form>
          )}
        </div>

        <p className="product-detail-back">
          <Link to="/products" className="btn back-to-products">Back to products</Link>
        </p>


      </div>
    </div>
  );
}
