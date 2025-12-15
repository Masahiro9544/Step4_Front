export interface Settings {
    settings_id: number;
    parent_id: number;
    child_id: number | null;
    voice_enabled: boolean;
    updated_at?: string;
}

export interface Child {
    child_id: number;
    parent_id: number;
    name: string;
    age?: number;
    grade?: string;
}

export interface ChildCreate {
    parent_id: number;
    name: string;
    age?: number;
    grade?: string;
}

export interface ChildUpdate {
    name?: string;
    age?: number;
    grade?: string;
}
