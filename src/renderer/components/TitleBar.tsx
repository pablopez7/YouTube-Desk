import React from 'react'
import { Minimize, Maximize, X, ArrowLeft, ArrowRight, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'
import { clsx } from 'clsx'
import { TabSystem } from './TabSystem'
import { useAppStore } from '../store'

export const TitleBar: React.FC = () => {
    const { triggerNavigation, activeTabState, theme, globalZoomLevel } = useAppStore()
    const isLight = theme === 'light'

    const handleMinimize = () => window.electron.minimize()
    const handleMaximize = () => window.electron.maximize()
    const handleClose = () => window.electron.close()

    // Base styles for buttons depending on theme
    const btnBase = clsx(
        "p-1 rounded-full transition-colors",
        isLight
            ? "text-gray-600 hover:text-black hover:bg-black/10"
            : "text-gray-400 hover:text-white hover:bg-white/10"
    )

    const btnDisabled = "disabled:opacity-30"

    // Format zoom percentage
    const zoomPercent = Math.round(globalZoomLevel * 100)

    return (
        <div className={clsx(
            "flex h-8 w-full select-none items-center app-drag-region border-b transition-colors",
            isLight
                ? "bg-youtube-light-base border-black/10"
                : "bg-youtube-base border-white/5"
        )}>
            {/* Left Controls: Navigation */}
            <div className="flex items-center px-2 space-x-1 no-drag">
                <button
                    onClick={() => triggerNavigation('back')}
                    disabled={!activeTabState.canGoBack}
                    className={clsx(btnBase, btnDisabled)}
                >
                    <ArrowLeft size={14} />
                </button>
                <button
                    onClick={() => triggerNavigation('forward')}
                    disabled={!activeTabState.canGoForward}
                    className={clsx(btnBase, btnDisabled)}
                >
                    <ArrowRight size={14} />
                </button>
                <button
                    onClick={() => triggerNavigation('reload')}
                    className={clsx(btnBase, activeTabState.isLoading && "animate-spin")}
                >
                    <RotateCw size={14} />
                </button>
            </div>

            {/* Middle: Tabs */}
            <div className="flex-1 overflow-hidden h-full flex items-end ml-1 pb-0.5">
                <TabSystem />
            </div>

            {/* Right Controls: Zoom & Window */}
            <div className="flex items-center pl-2 no-drag space-x-1 h-full">
                {/* Zoom */}
                <div className={clsx(
                    "flex items-center space-x-0.5 mr-1 border-r pr-2 h-4 my-auto",
                    isLight ? "border-black/10" : "border-white/10"
                )}>
                    <button onClick={() => triggerNavigation('zoomOut')} className={btnBase}>
                        <ZoomOut size={12} />
                    </button>
                    <span className={clsx(
                        "text-xs font-medium min-w-[36px] text-center tabular-nums",
                        isLight ? "text-gray-600" : "text-gray-400"
                    )}>
                        {zoomPercent}%
                    </span>
                    <button onClick={() => triggerNavigation('zoomIn')} className={btnBase}>
                        <ZoomIn size={12} />
                    </button>
                </div>

                {/* Window Controls */}
                <div className="flex items-center h-full">
                    <button
                        onClick={handleMinimize}
                        className={clsx(
                            "h-full w-10 flex items-center justify-center transition-colors",
                            isLight
                                ? "text-gray-600 hover:bg-black/10 hover:text-black"
                                : "text-gray-400 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        <Minimize size={14} />
                    </button>
                    <button
                        onClick={handleMaximize}
                        className={clsx(
                            "h-full w-10 flex items-center justify-center transition-colors",
                            isLight
                                ? "text-gray-600 hover:bg-black/10 hover:text-black"
                                : "text-gray-400 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        <Maximize size={14} />
                    </button>
                    <button
                        onClick={handleClose}
                        className={clsx(
                            "h-full w-10 flex items-center justify-center transition-colors",
                            isLight
                                ? "text-gray-600 hover:bg-red-600 hover:text-white"
                                : "text-gray-400 hover:bg-red-600 hover:text-white"
                        )}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}
