import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Download, Share2, Smartphone } from 'lucide-react';
import { ContactCard } from '../types';
import { generateVCardString } from '../utils/exportUtils';

interface QrCodeModalProps {
  card: ContactCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ card, isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && card && canvasRef.current) {
      const vCardText = generateVCardString(card);
      QRCode.toCanvas(canvasRef.current, vCardText, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }).catch((err) => console.error('QR code render error:', err));
    }
  }, [isOpen, card]);

  if (!isOpen || !card) return null;

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.fullName.toLowerCase().replace(/\s+/g, '_')}_vcard_qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm p-6 text-center">
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-left">
            <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">vCard QR Code</h3>
              <p className="text-[11px] text-slate-500">Scan to add to smartphone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center mb-4">
          <canvas ref={canvasRef} className="max-w-full rounded-lg" />
        </div>

        <div className="mb-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{card.fullName}</h4>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {card.jobTitle} {card.company ? `• ${card.company}` : ''}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadQR}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Save QR PNG
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
