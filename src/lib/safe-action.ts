
import { z } from "zod";

type ActionState<T> = {
    data?: T;
    error?: string;
};

export function createSafeAction<TInput, TOutput>(
    schema: z.Schema<TInput>,
    action: (data: TInput) => Promise<TOutput>
): (data: TInput) => Promise<ActionState<TOutput>> {
    return async (data: TInput): Promise<ActionState<TOutput>> => {
        const validationResult = schema.safeParse(data);

        if (!validationResult.success) {
            return { error: validationResult.error.errors[0].message };
        }

        try {
            const result = await action(validationResult.data);
            return { data: result };
        } catch (error) {
            console.error("Action Error:", error);
            // In production, log to Sentry/Pino. 
            // Don't expose raw error to client.
            return { error: "An unexpected error occurred." };
        }
    };
}
