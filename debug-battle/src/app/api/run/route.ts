import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { handleCodeExecution } from './utils';

export async function POST(request: Request) {
    try {
        // Ensure this is a server-side route
        headers();
        
        const { code, input } = await request.json();
        
        // Execute the code using our new handler
        const output = await handleCodeExecution(code, input);
        
        return NextResponse.json({ success: true, output });
    } catch (error: any) {
        console.error('Error running code:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
} 