import { isRouteErrorResponse } from '@remix-run/react';

export type ErrorStatus = 404 | 500 | number;
export type HumanReadableErrors = Record<ErrorStatus, string>;
export interface ErrorDetails {
    errorMessage: string;
    errorStatus: ErrorStatus;
}

const humanReadableErrors: HumanReadableErrors = {
    404: 'Sorry, the page you are looking for does not exist.',
    500: 'Sorry, something went wrong on our end.',
};

export function getErrorDetails(error: unknown): ErrorDetails {
    let errorMessage = 'Unknown error';
    let errorStatus: ErrorStatus = 500;

    if (isRouteErrorResponse(error)) {
        errorStatus = error.status;
        errorMessage = error.data?.message ?? error.data;
        errorMessage = humanReadableErrors[errorStatus] ?? errorMessage;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return { errorMessage, errorStatus };
}