export interface DocumentData{
    email: string;
    password: string;
}

export interface DocumentDataWithId extends DocumentData {
    id: string;
}
