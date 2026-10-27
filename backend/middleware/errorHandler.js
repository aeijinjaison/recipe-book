export const notFound = (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

export const errorHandler = (error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON' });
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((item) =>
      item.name === 'CastError' ? `${item.path} has an invalid value` : item.message
    );
    return res.status(400).json({ message: messages.join('. '), errors: messages });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid recipe id' });
  }

  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server' });
};
