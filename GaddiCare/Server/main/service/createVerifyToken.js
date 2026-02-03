export const generateVerificationToken = () => {
  const token = Math.floor(1000 + Math.random() * 9000).toString(); 
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

  return { token, expiresAt };
};