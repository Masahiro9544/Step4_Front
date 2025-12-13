export const dynamic = 'force-dynamic';

interface ExerciseButtonProps {
    title: string;
    subtitle: string;
    color: string;
    completed?: boolean;
    onClick: () => void;
}

export default function ExerciseButton({
    title,
    subtitle,
    color,
    completed,
    onClick,
}: ExerciseButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full p-4 rounded-2xl shadow-md text-left transition-transform active:scale-95 flex items-center justify-between text-white ${color} relative overflow-hidden`}
        >
            <div className="z-10">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm opacity-90">{subtitle}</p>
            </div>

            {completed && (
                <div className="bg-white/20 rounded-full p-2 z-10">
                    <span className="text-2xl">✅</span>
                </div>
            )}

            {/* Decorative circle */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full pointer-events-none"></div>
        </button>
    );
}
