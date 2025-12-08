import { ExerciseStats, LogExerciseRequest, LogExerciseResponse } from '@/types/exercise';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function getExerciseStats(childId: number): Promise<ExerciseStats> {
    const response = await fetch(`${API_BASE_URL}/api/child/${childId}/exercise/stats`, {
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error('統計情報の取得に失敗しました');
    }
    return response.json();
}

export async function logExercise(
    childId: number,
    request: LogExerciseRequest
): Promise<LogExerciseResponse> {
    const response = await fetch(`${API_BASE_URL}/api/child/${childId}/exercise/log`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) {
        throw new Error('実施記録に失敗しました');
    }
    return response.json();
}
