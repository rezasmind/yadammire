import React, { useEffect } from 'react';
import Image from 'next/image';
import iconn from '../../../public/icon-message.png'; // Make sure this path is correct

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <figure className="relative mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4 font-peyda bg-slate-50 shadow-lg border transition-all duration-500 ease-in-out hover:scale-[103%] dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
        <div className="flex flex-row items-center gap-1 z-99">
          <div className="flex items-center justify-center rounded-2xl">
            <span className="text-lg flex p-0 justify-center items-center">
              <Image src={iconn} alt="" width={65} height={65} />
            </span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
              <span className="text-sm sm:text-lg">وظیفه جدید ایجاد شد</span>
              <span className="mx-1">·</span>
              <span className="text-xs text-gray-500">الان</span>
            </figcaption>
            <p className="text-sm font-normal dark:text-white/60">
              {message}
            </p>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default Notification;