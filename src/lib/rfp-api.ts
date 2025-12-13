const API_URL = `${process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000'}/api`;

export interface MeasurementResult {
    id: number;
    date: string;
    eye: string;
    distance: string;
    visual_acuity: number;
}

export const saveResult = async (eye: string, distance: string, visualAcuity: number) => {
    try {
        const response = await fetch(`${API_URL}/results`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eye, distance, visual_acuity: visualAcuity }),
        });
        if (!response.ok) {
            throw new Error('Failed to save result');
        }
        return response.json();
    } catch (error) {
        console.error(error);
        // For MVP, just log error
    }
};

export const getResults = async (): Promise<MeasurementResult[]> => {
    try {
        const response = await fetch(`${API_URL}/results`);
        if (!response.ok) {
            throw new Error('Failed to fetch results');
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export interface EyeTestResult {
    id: number;
    child_id: number;
    check_date: string;
    left_eye: number;
    right_eye: number;
    recovery_level?: number;
    test_type: string;
}

export const saveEyeTest = async (leftEye: number | undefined, rightEye: number | undefined, testType: string) => {
    try {
        const response = await fetch(`${API_URL}/eyetests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ child_id: 1, left_eye: leftEye, right_eye: rightEye, test_type: testType }),
        });
        if (!response.ok) {
            throw new Error('Failed to save eye test');
        }
        return response.json();
    } catch (error) {
        console.error(error);
    }
};

export const getEyeTests = async (): Promise<EyeTestResult[]> => {
    try {
        const response = await fetch(`${API_URL}/eyetests`);
        if (!response.ok) {
            throw new Error('Failed to fetch eye tests');
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};
