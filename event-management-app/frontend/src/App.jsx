import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes.jsx';
import { CustomCursor } from './components/CustomCursor.jsx';
import { ScrollProgress } from './components/ScrollProgress.jsx';
import { useMotionSystem } from './hooks/useMotionSystem.js';

export default function App() {
  const location = useLocation();
  useMotionSystem();

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <AnimatePresence mode="wait">
        <AppRoutes key={location.pathname} />
      </AnimatePresence>
    </>
  );
}
