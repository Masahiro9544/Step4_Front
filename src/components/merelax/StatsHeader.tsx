import { ExerciseStats } from '@/types/exercise';

interface StatsHeaderProps {
    stats: ExerciseStats;
}

export default function StatsHeader({ stats }: StatsHeaderProps) {
    return (
        <div className="bg-white p-4 shadow-sm">
            <div className="flex justify-around items-center text-center">
                <div>
                    <div className="text-gray-500 text-sm">つづけた ひ</div>
                    <div className="text-3xl font-bold text-merelax-primary">
                        {stats.consecutive_days}<span className="text-sm text-gray-400 font-normal">にち</span>
                    </div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div>
                    <div className="text-gray-500 text-sm">こんしゅう やったひ</div>
                    <div className="text-3xl font-bold text-merelax-secondary">
                        {stats.this_week_count}<span className="text-sm text-gray-400 font-normal">にち</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
