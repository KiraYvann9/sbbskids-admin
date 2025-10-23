export type schema = {
    id: number,
    title: string,
    module_id: number,
    admin_id: number,
    created_at: Date,
    updated_at: Date,
    conclusion: string,
    module: {
        id: number,
        name: string,
        applications: string,
    },
    supports: [
        {
            id: number,
            libelle: string,
            pdf: string | null,
            video: string | null,
            description: string | null,
            video_url: string | null,
            pdf_url: string | null
        }
    ],
    activities: [
        {
            id: number,
            title: string,
            libelle: string,
            description: string,
        }
    ],
    workshops: [],
    level: {
        id: number,
        name: string,
        age_group: string,
    },
    admin: {
        id: number,
        user_id: number,
        avatar: string | null,
        name: string,
        email: string,
        avatar_url: null
    }
}
