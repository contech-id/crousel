type SnapCallbacks = {
  onSuccess?: (result: unknown) => void;
  onPending?: (result: unknown) => void;
  onError?: (result: unknown) => void;
  onClose?: () => void;
};

type MidtransSnap = { pay: (token: string, callbacks?: SnapCallbacks) => void };

declare global {
  interface Window {
    snap?: MidtransSnap;
  }
}

let scriptPromise: Promise<MidtransSnap> | null = null;

export function loadMidtransSnap(): Promise<MidtransSnap> {
  if (window.snap) return Promise.resolve(window.snap);
  if (scriptPromise) return scriptPromise;
  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
  if (!clientKey) return Promise.reject(new Error('Client Key Midtrans belum dikonfigurasi.'));

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-midtrans-snap]');
    if (existing) {
      existing.addEventListener('load', () => window.snap ? resolve(window.snap) : reject(new Error('Midtrans Snap tidak tersedia.')));
      existing.addEventListener('error', () => reject(new Error('Midtrans Snap gagal dimuat.')));
      return;
    }
    const script = document.createElement('script');
    script.src = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.dataset.midtransSnap = 'true';
    script.dataset.clientKey = clientKey;
    script.onload = () => window.snap ? resolve(window.snap) : reject(new Error('Midtrans Snap tidak tersedia.'));
    script.onerror = () => reject(new Error('Midtrans Snap gagal dimuat.'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}
