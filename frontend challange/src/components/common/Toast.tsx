import { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div className={`toast-notification ${visible ? 'toast-show' : 'toast-hide'}`}>
      {message}
    </div>
  );
};

export default Toast;
