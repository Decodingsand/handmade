
import { Navigate } from 'react-router-dom';

// Redirect from the index to the HomePage
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
