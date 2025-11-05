const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('Missing JWT_SECRET in environment');
}

if(!jwtExpiry){
  throw new Error('Missing JWT_EXPIRY in environment')
}

const JWT_SECRET = jwtSecret as string; 
const JWT_EXPIRY = jwtExpiry as string;

export  { JWT_SECRET, JWT_EXPIRY }