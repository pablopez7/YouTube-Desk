/// <reference types="vite/client" />
/// <reference types="vite-plugin-electron/electron-env" />
/// <reference types="vite-plugin-electron-renderer/client" />

interface Window {
    electron: {
        ipcRenderer: {
            invoke(channel: string, ...args: any[]): Promise<any>;
            on(channel: string, func: (...args: any[]) => void): () => void;
            send(channel: string, ...args: any[]): void;
        };
        minimize: () => void;
        maximize: () => void;
        close: () => void;
        isMaximized: () => Promise<boolean>;
        onMaximized: (callback: (isMaximized: boolean) => void) => void;
        showContextMenu: (url: string) => Promise<void>;
        onOpenTab: (callback: (url: string) => void) => void;
        getVideoTitle: (videoId: string) => Promise<{ title: string | null; thumbnail: string | null } | null>;
    }
}

// Add intrinsic elements for Webview
declare namespace JSX {
    interface IntrinsicElements {
        webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            src?: string;
            allowpopups?: boolean;
            nodeintegration?: boolean;
            partition?: string;
        };
    }
}
