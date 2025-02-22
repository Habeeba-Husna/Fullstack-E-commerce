import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };
   
  console.log('Signing Secret:', process.env.JWT_SECRET);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); 
};

export const generateRefreshToken = (user) => {
  const payload = { id: user._id };
   
   console.log('Signing Secret (Refresh):', process.env.JWT_REFRESH_SECRET);   // for verify consistency
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