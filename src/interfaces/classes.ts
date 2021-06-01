export interface Movie {
    director?: string,
    title: string,
    released: string,
    tagline: string,
    score?: number,
    likes?: number,
    persons?: any
}

export interface User {
    password: string,
    card_number?: string,
    role_type: string,
    sirname: string,
    birthyear: number,
    premium_end_date: number,
    id: string,
    subsciption_tier?: string,
    email: string,
    username: string,
    lastname: string
}
