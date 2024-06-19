"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
}

const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) => {
  return (
    <div
      className={cn(
        "z-10 flex flex-row-reverse -space-x-4 font-peyda !gap-0 !p-0 !m-0 ",
        className
      )}
    >
      <a
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
        href=""
      >
        +۳۲۱
      </a>
      {avatarUrls.map((url, index) => (
        <img
          key={index}
          className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
          src={url}
          width={40}
          height={40}
          alt={`Avatar ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default AvatarCircles;
