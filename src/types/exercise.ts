export type ExerciseType = 'distance_view' | 'blink' | 'eye_tracking';

export interface Exercise {
    exercise_id: number;
    exercise_type: ExerciseType;
    exercise_name: string;
    description?: string;
}

export interface ExerciseStats {
    consecutive_days: number;
    this_week_count: number;
    today_completed: ExerciseType[];
    today_pending: ExerciseType[];
}

export interface LogExerciseRequest {
    exercise_id: number;
    exercise_date: string; // YYYY-MM-DD
}

export interface LogExerciseResponse {
    success: boolean;
    message: string;
    stats: ExerciseStats;
}
