export interface DailyMission {
    mission_id: string;
    title: string;
    status: string;
    link: string;
}

export interface LastResults {
    eye_test_date?: string;
    left_eye?: string;
    right_eye?: string;
    distance_check_date?: string;
    avg_distance_cm?: number;
    posture_score?: number;
}

export interface HomeResponse {
    missions: DailyMission[];
    last_results: LastResults;
    character_message: string;
}
