import { describe, it, expect } from 'vitest'
import { extractVideoId } from './utils'

describe('extractVideoId', () => {
    describe('standard watch URLs', () => {
        it('extracts ID from youtube.com/watch?v=ID', () => {
            expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))
                .toBe('dQw4w9WgXcQ')
        })

        it('extracts ID with additional query params', () => {
            expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120'))
                .toBe('dQw4w9WgXcQ')
        })

        it('extracts ID when v is not first param', () => {
            expect(extractVideoId('https://www.youtube.com/watch?list=PLfoo&v=dQw4w9WgXcQ'))
                .toBe('dQw4w9WgXcQ')
        })
    })

    describe('short URLs', () => {
        it('extracts ID from youtu.be/ID', () => {
            expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ'))
                .toBe('dQw4w9WgXcQ')
        })

        it('extracts ID from youtu.be with query params', () => {
            expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ?t=120'))
                .toBe('dQw4w9WgXcQ')
        })
    })

    describe('shorts URLs', () => {
        it('extracts ID from youtube.com/shorts/ID', () => {
            expect(extractVideoId('https://www.youtube.com/shorts/abc123XYZ'))
                .toBe('abc123XYZ')
        })
    })

    describe('embed URLs', () => {
        it('extracts ID from youtube.com/embed/ID', () => {
            expect(extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ'))
                .toBe('dQw4w9WgXcQ')
        })
    })

    describe('invalid URLs', () => {
        it('returns null for empty string', () => {
            expect(extractVideoId('')).toBeNull()
        })

        it('returns null for non-YouTube URLs', () => {
            expect(extractVideoId('https://google.com')).toBeNull()
        })

        it('returns null for YouTube homepage', () => {
            expect(extractVideoId('https://www.youtube.com')).toBeNull()
        })

        it('returns null for YouTube channel URLs', () => {
            expect(extractVideoId('https://www.youtube.com/channel/UCfoo'))
                .toBeNull()
        })

        it('returns null for null/undefined input', () => {
            expect(extractVideoId(null as unknown as string)).toBeNull()
            expect(extractVideoId(undefined as unknown as string)).toBeNull()
        })
    })
})
