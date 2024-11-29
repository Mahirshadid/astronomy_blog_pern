import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useRedirect(targetPath: string, delay: number): void {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => navigate(targetPath), delay);
    return () => clearTimeout(timeout);
  }, [navigate, targetPath, delay]);
}

export default useRedirect;