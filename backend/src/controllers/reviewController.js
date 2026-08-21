const prisma = require('../utils/prismaClient');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: Number(req.params.productId) },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    });
    res.json({ reviews: reviews.map(r => ({ id: r.id, rating: r.rating, comment: r.comment, userName: r.user.name })) });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ message: 'Could not load reviews' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { rating, comment } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment: comment || '',
        productId: Number(req.params.productId),
        userId,
        userName: user.name
      }
    });
    res.status(201).json({ review: { id: review.id, rating: review.rating, comment: review.comment, userName: review.userName } });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ message: 'Could not submit review' });
  }
};
