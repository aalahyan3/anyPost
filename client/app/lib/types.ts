export type ProjectType = {
    id: string;
    name: string;
    ownerId: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export type FormType = {
    id: string;
    projectId: string;
    name: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export type SubmissionType = {
    id: string;
    formId: string;
    data: Record<string, any>;
    createdAt: string;
}
