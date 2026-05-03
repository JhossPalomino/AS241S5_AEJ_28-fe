export interface Translate {
    id: string;
    sourceLanguage: string;
    targetLanguage: string;
    originalText: string;
    translatedText: string;
    createdAt: Date;
    status: boolean; 
    showMenu?: boolean;
    menuPosition?: 'up' | 'down';
    menuTop?: number;
    menuLeft?: number;
}
