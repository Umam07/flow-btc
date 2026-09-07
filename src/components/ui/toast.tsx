"use client";

import React from "react";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[9999] pointer-events-none flex justify-center sm:justify-end">
      <div className="klarna-toast max-w-sm">
        <span className="text-klarna-pink font-bold">●</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
