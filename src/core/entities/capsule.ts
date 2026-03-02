
export interface Capsule {
    id: string;
    ownerId: string;
    content: string; // Encrypted content
    createdAt: Date;
    unlockTime: Date;
    isLocked: boolean;
    title: string;
}

export interface CreateCapsuleDTO {
    ownerId: string;
    content: string;
    unlockTime: Date;
    title: string;
}

export const CapsuleRules = {
    MIN_UNLOCK_TIME_MINUTES: 5,
    MAX_UNLOCK_TIME_YEARS: 100,

    isValidUnlockTime(unlockTime: Date): boolean {
        const now = new Date();
        const minTime = new Date(now.getTime() + this.MIN_UNLOCK_TIME_MINUTES * 60000);
        const maxTime = new Date(now.setFullYear(now.getFullYear() + this.MAX_UNLOCK_TIME_YEARS));
        return unlockTime >= minTime && unlockTime <= maxTime;
    }
};
