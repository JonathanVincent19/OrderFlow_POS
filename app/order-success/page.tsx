/**
 * Order Success Page
 * 
 * Purpose: Display order confirmation and payment instructions
 * Route: /order-success
 * User Role: Customer
 */
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto redirect to menu after 10 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-lg w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-3">
          Pemesanan Berhasil!
        </h1>

        {/* Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-center font-medium">
            Order Anda telah berhasil dibuat
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Langkah Selanjutnya:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Silahkan datang ke kasir untuk melakukan pembayaran</li>
                <li>Sebutkan nama Anda kepada kasir</li>
                <li>Setelah pembayaran dikonfirmasi, order Anda akan segera diproses</li>
                <li>Pesanan akan disiapkan dan diantarkan ke meja Anda</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="font-semibold text-gray-900">Pembayaran di Kasir</p>
          </div>
          <p className="text-sm text-gray-600 ml-7">
            Kami menerima pembayaran tunai atau kartu debit di kasir
          </p>
        </div>

        {/* Countdown */}
        <p className="text-center text-sm text-gray-500 mb-6">
          Redirecting ke menu dalam {countdown} detik...
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition text-center shadow-sm"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

