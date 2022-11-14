export interface Block {
    name: string;
    keyName: string;
    project: string;
    fields: Field[];
}

export interface Field {
    keyName: string;
    type: string;
}
