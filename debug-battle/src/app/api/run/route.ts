import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createFullProgram, compileCpp, runExecutable } from './utils';

export async function POST(request: Request) {
    try {
        // Ensure this is a server-side route
        headers();
        
        const { code, input } = await request.json();
        
        // Create a complete program for this test case
        const fullProgram = createFullProgram(code, input);
        
        // Compile the program
        const executablePath = await compileCpp(fullProgram);
        
        // Run the program
        const output = await runExecutable(executablePath);
        
        return NextResponse.json({ success: true, output });
    } catch (error: any) {
        console.error('Error running code:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
} 