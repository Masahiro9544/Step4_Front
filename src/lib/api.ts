import { ExerciseStats, LogExerciseRequest, LogExerciseResponse } from '@/types/exercise';
import { HomeResponse } from '@/types/home';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_ENDPOINT}` ;

export async function getHomeData(childId: number): Promise<HomeResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/home/${childId}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error(`ホームデータの取得に失敗しました: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API Error (getHomeData):", error);
        throw error;
    }
}

export async function getExerciseStats(childId: number): Promise<ExerciseStats> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/child/${childId}/exercise/stats`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error(`統計情報の取得に失敗しました: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API Error (getExerciseStats):", error);
        throw error;
    }
}

export async function logExercise(
    childId: number,
    request: LogExerciseRequest
): Promise<LogExerciseResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/child/${childId}/exercise/log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        if (!response.ok) {
            throw new Error(`実施記録に失敗しました: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API Error (logExercise):", error);
        throw error;
    }
}
