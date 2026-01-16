import React from 'react'
import { Minimize, Maximize, X, ArrowLeft, ArrowRight, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'
import { clsx } from 'clsx'
import { TabSystem } from './TabSystem'
import { useAppStore } from '../store'

export const TitleBar: React.FC = () => {
    const { triggerNavigation, activeTabState } = useAppStore()

    const handleMinimize = () => window.electron.minimize()
    const handleMaximize = () => window.electron.maximize()
    const handleClose = () => window.electron.close()

    return (
        <div className="flex h-8 bg-youtube-base w-full select-none items-center app-drag-region border-b border-white/5">
            {/* Left Controls: Navigation */}
            <div className="flex items-center px-2 space-x-1 no-drag">
                <button
                    onClick={() => triggerNavigation('back')}
                    disabled={!activeTabState.canGoBack}
                    className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                    <ArrowLeft size={14} />
                </button>
                <button
                    onClick={() => triggerNavigation('forward')}
                    disabled={!activeTabState.canGoForward}
                    className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                    <ArrowRight size={14} />
                </button>
                <button
                    onClick={() => triggerNavigation('reload')}
                    className={clsx("p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors", activeTabState.isLoading && "animate-spin")}
                >
                    <RotateCw size={14} />
                </button>
            </div>

            {/* Middle: Tabs (Drag Region is on parent, but buttons in TabSystem are no-drag) */}
            <div className="flex-1 overflow-hidden h-full flex items-end ml-1 pb-0.5">
                <TabSystem />
            </div>

            {/* Right Controls: Zoom & Window */}
            <div className="flex items-center pl-2 no-drag space-x-1 h-full">
                {/* Zoom */}
                <div className="flex items-center space-x-0.5 mr-1 border-r border-white/10 pr-2 h-4 my-auto">
                    <button onClick={() => triggerNavigation('zoomOut')} className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <ZoomOut size={12} />
                    </button>
                    <button onClick={() => triggerNavigation('zoomIn')} className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <ZoomIn size={12} />
                    </button>
                </div>

                {/* Window Controls */}
                <div className="flex items-center h-full">
                    <button onClick={handleMinimize} className="h-full w-10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                        <Minimize size={14} />
                    </button>
                    <button onClick={handleMaximize} className="h-full w-10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                        <Maximize size={14} />
                    </button>
                    <button onClick={handleClose} className="h-full w-10 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}
