export interface Tts {
    id: string;
    text: string;
    voice: string;
    audioFileId: string;
    createdAt: Date;
    status: boolean;

    showMenu?: boolean;
    menuLeft?: number;
    MenuTop?: number;
}
