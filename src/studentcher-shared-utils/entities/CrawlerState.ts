export interface ICrawlerState {
    crawlerId: string;
    totalProfilesToSearch: number;
    errorsCount: number;
    profilesSearchedOverAll: number;
    isDone: boolean;
}

export type IncrementStateProperty = Exclude<keyof Omit<ICrawlerState, "isDone" | "crawlerId">, "isDone">;
