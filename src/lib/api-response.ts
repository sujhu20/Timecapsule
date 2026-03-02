import { NextResponse } from "next/server";

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
};

export function apiResponse<T>(
    data: T | null,
    message: string = "Success",
    status: number = 200,
    success: boolean = true,
    error?: any
) {
    const responseBody: ApiResponse<T> = {
        success,
        message,
        data: data || undefined,
        error: error || undefined,
    };

    return NextResponse.json(responseBody, { status });
}

export function apiError(
    message: string = "Internal Server Error",
    status: number = 500,
    error?: any
) {
    return apiResponse(null, message, status, false, error);
}
