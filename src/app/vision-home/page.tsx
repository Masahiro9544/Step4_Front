'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getResults } from '@/lib/rfp-api';
import { useSound } from '@/hooks/useSound';

export default function Home() {
  const [showReminder, setShowReminder] = useState(false);
  const { playSound } = useSound();

  useEffect(() => {
    const checkReminder = async () => {
      const results = await getResults();
      if (results.length > 0) {
        const lastDate = new Date(results[results.length - 1].date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
          setShowReminder(true);
        }
      }
    };
    checkReminder();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#E0F2F7] p-4 font-sans relative">
      <div className="absolute top-4 left-4 z-10">
        <Link href="/home" className="flex items-center font-bold text-gray-600 hover:text-gray-800 transition-colors">
          <span className="text-xl sm:text-2xl mr-1 sm:mr-2">←</span>
          <span className="text-base sm:text-lg">もどる</span>
        </Link>
      </div>

      {showReminder && (
        <div className="absolute top-4 w-full max-w-md bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded shadow-md animate-bounce" role="alert">
          <p className="font-bold">お知らせ</p>
          <p>前回のチェックから30日がたちました。そろそろ視力チェックしませんか？</p>
        </div>
      )}

      <div className="max-w-md w-full text-center space-y-8 pt-16 sm:pt-0">
        <h1 className="text-3xl sm:text-5xl font-bold text-[#0093D0] tracking-wider drop-shadow-sm">
          視力チェック
        </h1>
        <p className="text-base sm:text-xl text-[#0093D0] font-medium">
          おうちでかんたん視力チェック
        </p>

        <div className="flex justify-center my-6">
          <Image
            src="/images/character/chackLiveDoc.jpeg"
            alt="Character"
            width={300}
            height={300}
            className="shadow-lg border-4 border-white rounded-3xl"
          />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6 border-4 border-[#0093D0]">
          <p className="text-gray-700 text-lg font-bold">
            きょりをえらんでね
          </p>

          <div className="grid grid-cols-1 gap-4">
            <Link href="/test?distance=30cm" onClick={() => playSound('/sounds/shiryokutyekku.wav')} className="block w-full py-5 bg-[#0093D0] hover:bg-[#007bb5] text-white rounded-2xl text-2xl font-bold transition-all shadow-md active:scale-95">
              30cm (ちかく)
            </Link>
            <Link href="/test?distance=3m" onClick={() => playSound('/sounds/shiryokutyekku.wav')} className="block w-full py-5 bg-[#81D4FA] hover:bg-[#4FC3F7] text-[#005b82] rounded-2xl text-2xl font-bold transition-all shadow-md active:scale-95">
              3m (とおく)
            </Link>
          </div>
        </div>

        <div className="w-full">
          <Link href="/dashboard" onClick={() => playSound('/sounds/bottan.mp3')} className="block w-full py-3 bg-white text-xl text-[#0093D0] border-2 border-[#0093D0] rounded-2xl font-bold hover:bg-gray-50 transition-colors">
            きろくをみる
          </Link>
        </div>

        <div className="text-sm text-gray-400 mt-8">
          ※このアプリは簡易チェック用です。<br />
          正確な視力は眼科で測りましょう。
        </div>
      </div>
    </main>
  );
}
