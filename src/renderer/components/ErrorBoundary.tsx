import React, { Component, ErrorInfo, ReactNode } from 'react'
import { createLogger } from '../../shared/logger'

const log = createLogger('ErrorBoundary')

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

/**
 * Error Boundary component to catch and display errors gracefully
 * Wraps components that might throw errors during rendering
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        log.error('Uncaught error in component tree', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        })
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex-1 flex flex-col h-full bg-youtube-base items-center justify-center p-8">
                    <div className="text-red-500 text-2xl mb-4">⚠️ Algo salió mal</div>
                    <p className="text-gray-400 text-center mb-6 max-w-md">
                        Ha ocurrido un error inesperado. Puedes intentar recargar esta pestaña.
                    </p>
                    <div className="text-gray-600 text-xs mb-6 font-mono bg-youtube-surface p-4 rounded max-w-md overflow-auto">
                        {this.state.error?.message || 'Error desconocido'}
                    </div>
                    <button
                        onClick={this.handleRetry}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
