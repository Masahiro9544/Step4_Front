interface CompleteButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export default function CompleteButton({ onClick, disabled }: CompleteButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        text-white text-xl px-8 py-4 rounded-full shadow-lg transition transform
        ${disabled
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-merelax-success hover:scale-105 hover:bg-green-600'
                }
      `}
        >
            できた！
        </button>
    );
}
