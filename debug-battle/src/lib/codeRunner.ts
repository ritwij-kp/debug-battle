export interface TestResult {
    passed: boolean;
    output: string;
    expected: string;
    error?: string;
    executionTime?: number;
}

export interface RunResult {
    success: boolean;
    results: TestResult[];
    error?: string;
}

// Parse input string into actual parameters
function parseInput(input: string): string {
    // Remove variable name and keep just the array
    return input.replace(/^[a-zA-Z]+ = /, '');
}

export async function runTests(code: string, problem: any): Promise<RunResult> {
    const results: TestResult[] = [];

    try {
        for (const example of problem.examples) {
            const startTime = performance.now();
            try {
                // Call the API to run the code
                const response = await fetch('/api/run', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        code,
                        input: parseInput(example.input)
                    }),
                });

                const data = await response.json();
                const endTime = performance.now();

                if (!data.success) {
                    throw new Error(data.error);
                }

                results.push({
                    passed: data.output === example.output,
                    output: data.output,
                    expected: example.output,
                    executionTime: endTime - startTime
                });
            } catch (error: any) {
                results.push({
                    passed: false,
                    output: '',
                    expected: example.output,
                    error: error?.message || 'Unknown error'
                });
            }
        }

        return {
            success: true,
            results
        };
    } catch (error: any) {
        return {
            success: false,
            results: [],
            error: error?.message || 'Unknown error'
        };
    }
} 