'use client';
import { useEffect, useState } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Don't show if dismissed recently
    const dismissed = localStorage.getItem('pwa_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);
    const android = /android/i.test(navigator.userAgent);
    setIsAndroid(android);

    if (ios) {
      // iOS Safari: show our own hint
      const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
      if (isSafari) setTimeout(() => setShow(true), 2000);
    } else if (android) {
      // Android: show APK download banner after 2 seconds
      setTimeout(() => setShow(true), 2000);
    } else {
      // Android/Chrome: wait for install prompt
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setTimeout(() => setShow(true), 2000);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem('pwa_dismissed', Date.now().toString());
    setShow(false);
    setShowIOSHint(false);
  };

  const install = async () => {
    if (isIOS) {
      setShowIOSHint(true);
      return;
    }
    if (isAndroid) {
      // Trigger download of appsminers.apk
      const link = document.createElement('a');
      link.href = '/appsminers.apk';
      link.download = 'appsminers.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShow(false);
      return;
    }
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShow(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Main Banner */}
      <div
        className="fixed bottom-20 lg:bottom-6 left-3 right-3 z-[300]"
        style={{
          animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
          transform: 'translateY(100px)',
          opacity: 0,
        }}
      >
        <div className="bg-[#071028] border border-[#60a5fa]/20 rounded-2xl p-4 flex items-center gap-3 shadow-2xl shadow-black/50">
          <div className="w-10 h-10 rounded-xl bg-[#60a5fa]/10 flex items-center justify-center flex-shrink-0 border border-[#60a5fa]/20">
            <Smartphone size={20} className="text-[#60a5fa]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white uppercase tracking-wider">Install App</p>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
              {isIOS ? 'Tap Share → Add to Home Screen' : isAndroid ? 'Download AppsMiners native Android app' : 'Add AppsMiners to your home screen'}
            </p>
          </div>
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#60a5fa] text-black text-[10px] font-black uppercase tracking-wider flex-shrink-0 transition-all hover:bg-[#60a5fa]/90 active:scale-95"
          >
            <Download size={12} />
            {isAndroid ? 'Download APK' : 'Install'}
          </button>
          <button
            onClick={dismiss}
            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white flex-shrink-0 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* iOS hint overlay */}
      {showIOSHint && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center p-4 bg-black/60" onClick={() => setShowIOSHint(false)}>
          <div className="bg-[#071028] border border-[#60a5fa]/20 rounded-2xl p-6 w-full max-w-sm text-center mb-16">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">Add to Home Screen</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Tap the <strong className="text-white">Share</strong> button at the bottom of Safari,
              then tap <strong className="text-white">Add to Home Screen</strong>
            </p>
            <div className="text-3xl">⬆️ Share → Add to Home Screen</div>
            <button onClick={() => setShowIOSHint(false)} className="mt-4 text-[#60a5fa] text-xs font-bold">Got it</button>
          </div>
        </div>
      )}
    </>
  );
}
