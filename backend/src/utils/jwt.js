import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };
    // Log the JWT_SECRET to verify if it's consistent
  console.log('Signing Secret:', process.env.JWT_SECRET);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); 
};

export const generateRefreshToken = (user) => {
  const payload = { id: user._id };
   // Log the JWT_REFRESH_SECRET to verify consistency
   console.log('Signing Secret (Refresh):', process.env.JWT_REFRESH_SECRET);
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); 
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.log('Token Verification Error:', error.message);
    return null;
  }
};