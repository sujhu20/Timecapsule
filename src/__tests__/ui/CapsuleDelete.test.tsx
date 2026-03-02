
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CapsuleViewPage from '../../app/capsules/[id]/page';
import '@testing-library/jest-dom';

// Mock params
jest.mock('next/navigation', () => ({
    useParams: () => ({ id: 'capsule-123' }),
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn(),
    }),
    usePathname: () => '/capsules/capsule-123',
}));

// Mock Link
jest.mock('next/link', () => {
    return ({ children }: { children: React.ReactNode }) => children;
});

// Mock Lucide icons to avoid rendering issues if any
jest.mock('lucide-react', () => ({
    Calendar: () => <div data-testid="icon-calendar" />,
    Clock: () => <div data-testid="icon-clock" />,
    User: () => <div data-testid="icon-user" />,
    Lock: () => <div data-testid="icon-lock" />,
    ArrowLeft: () => <div data-testid="icon-arrow-left" />,
    MessageSquare: () => <div data-testid="icon-message-square" />,
    Download: () => <div data-testid="icon-download" />,
    Share2: () => <div data-testid="icon-share-2" />,
    Trash: () => <div data-testid="icon-trash" />,
}));

describe('CapsuleViewPage - Delete Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        global.confirm = jest.fn();
        global.alert = jest.fn();
    });

    it('should handle delete flow correctly without crashing', async () => {
        // 1. Mock GET capsule response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                data: {
                    capsule: {
                        id: 'capsule-123',
                        title: 'Test Capsule',
                        content: 'Secret Content',
                        created_at: new Date().toISOString(),
                        scheduled_date: new Date().toISOString(),
                        privacy: 'private',
                        isLocked: false,
                        media_url: null,
                    }
                }
            })
        });

        // 2. Render Component
        render(<CapsuleViewPage />);

        // 3. Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('Test Capsule')).toBeInTheDocument();
        });

        // 4. Find Delete Button
        const deleteBtn = screen.getByText('Delete');
        expect(deleteBtn).toBeInTheDocument();

        // 5. Click Delete
        // Mock Confirmation to be TRUE
        (global.confirm as jest.Mock).mockReturnValue(true);

        // Mock DELETE API Success
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        fireEvent.click(deleteBtn);

        // 6. Verify "Deleting..." state (text changes)
        expect(global.confirm).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.getByText('Deleting...')).toBeInTheDocument();
        });

        // 7. Verify API call
        expect(global.fetch).toHaveBeenLastCalledWith('/api/capsules/capsule-123', {
            method: 'DELETE',
        });

        // Router push verification would happen here if we could import the mock instance,
        // but checking state change and API interaction validates "No Crash".
    });

    it('should cancel delete if user declines confirmation', async () => {
        // 1. Mock GET capsule response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                data: {
                    capsule: {
                        id: 'capsule-123',
                        title: 'Test Capsule',
                        content: 'Secret Content',
                        created_at: new Date().toISOString(),
                        scheduled_date: new Date().toISOString(),
                        privacy: 'private',
                        isLocked: false,
                    }
                }
            })
        });

        render(<CapsuleViewPage />);

        await waitFor(() => {
            expect(screen.getByText('Test Capsule')).toBeInTheDocument();
        });

        const deleteBtn = screen.getByText('Delete');

        // Mock Confirmation to be FALSE
        (global.confirm as jest.Mock).mockReturnValue(false);

        fireEvent.click(deleteBtn);

        expect(global.confirm).toHaveBeenCalled();
        // API should NOT be called for DELETE
        expect(global.fetch).toHaveBeenCalledTimes(1); // Only the GET call
        expect(screen.getByText('Delete')).toBeInTheDocument(); // Should revert/stay as Delete
    });
});
