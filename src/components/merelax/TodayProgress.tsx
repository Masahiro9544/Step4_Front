import { ExerciseType } from '@/types/exercise';

interface TodayProgressProps {
    completed: ExerciseType[];
}

export default function TodayProgress({ completed }: TodayProgressProps) {
    const items = [
        { type: 'distance_view', label: '遠く' },
        { type: 'blink', label: 'まばたき' },
        { type: 'eye_tracking', label: '体操' },
    ];

    return (
        <div className="p-4 bg-white mt-2 shadow-sm">
            <h3 className="text-center text-gray-700 font-bold mb-3">今日のこれやった？</h3>
            <div className="flex justify-center space-x-6">
                {items.map((item) => {
                    const isDone = completed.includes(item.type as ExerciseType);
                    return (
                        <div key={item.type} className="text-center">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1 transition-all ${isDone
                                        ? 'bg-merelax-success text-white shadow-md transform scale-110'
                                        : 'bg-gray-100 text-gray-300'
                                    }`}
                            >
                                {isDone ? 'OK' : '?'}
                            </div>
                            <span className={`text-xs ${isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
