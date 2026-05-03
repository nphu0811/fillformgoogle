'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, ChevronUp } from 'lucide-react';

export function ChatWidget() {
  return (
    <a
      href="https://github.com/nphu0811"
      target="_blank"
      rel="noopener noreferrer"
      className="chat-widget"
      aria-label="Chat with us"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </a>
  );
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scroll-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-5 h-5 text-white" />
    </button>
  );
}
