export interface AppPlugin {
    init(): Promise<void>;
    start(): Promise<void>;
}