export const dynamic = 'force-dynamic';

import { useCallback } from 'react';

export const useSound = () => {
    const playSound = useCallback((fileName: string) => {
        // 現在はローカルのpublicフォルダを参照
        // 将来的にAzure Blob Storageに移行する場合は、这里的baseUrlを変更するだけで対応可能です
        const baseUrl = '/sounds';

        const audio = new Audio(`${baseUrl}/${fileName}`);
        audio.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }, []);

    return { playSound };
};
