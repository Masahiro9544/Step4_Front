export const dynamic = 'force-dynamic';

import Image from 'next/image';

type Props = {
    coveredEye: 'left' | 'right' | 'none';
};

export default function VisionTestCharacter({ coveredEye }: Props) {
    return (
        <div className="relative w-28 h-28 mx-auto mb-4">
            <Image
                src="/images/character/character_normal.png"
                alt="Navi Character"
                fill
                className="object-contain"
                priority
            />

            {/* Occluder (Spoon) Overlay */}
            {coveredEye !== 'none' && (
                <div
                    className={`absolute top-[40%] w-12 h-12 bg-[#333] rounded-full border-4 border-gray-400 shadow-lg flex items-center justify-center transform -translate-y-1/2 transition-all duration-300 ${coveredEye === 'left'
                        ? 'left-[28%]'
                        : 'right-[28%]'
                        }`}
                >
                    {/* Handle of the spoon */}
                    <div
                        className={`absolute top-full w-3 h-16 bg-gray-400 rounded-b-lg ${coveredEye === 'left' ? 'rotate-[30deg] -left-2' : '-rotate-[30deg] -right-2'
                            }`}
                        style={{ transformOrigin: 'top center' }}
                    >
                        {/* Hand holding the spoon - Simple rounded shape */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-[#FFD700] rounded-full border-2 border-orange-200 shadow-sm z-10" />
                    </div>
                </div>
            )}
        </div>
    );
}
