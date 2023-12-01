export interface ICrawlerUserAccount {
    id: string;
    username: string;
    password: string;
    description: string;
    postsCollection: string;
}

export type ICrawlerUserAccountInput = Omit<ICrawlerUserAccount, "id">
