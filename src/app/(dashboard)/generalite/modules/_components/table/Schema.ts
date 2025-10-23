export type schema = {
    id: number,
    name: string,
    applications: string,
    level_id: string,
    admin_id: string,
    updated_at: string,
    created_at: Date,
    level: {
        "id": number,
        "name": string,
        "age_group": string,
    },
    admin: {
        "id": number,
        "user_id": number,
        "avatar": null,
        "name": string,
    },
    courses: Array<any>,
};