import { writeFile, unlink } from 'node:fs/promises';
import { promisify } from 'node:util';

// Convert JSON array to C++ vector initialization
function formatArrayToCpp(input: string): string {
    try {
        const array = JSON.parse(input);
        if (Array.isArray(array)) {
            if (typeof array[0] === 'string') {
                // For char arrays (string reversal problem)
                return `vector<char> s = {${array.map(c => `'${c}'`).join(', ')}};`;
            } else {
                // For number arrays
                return `vector<int> nums = {${array.join(', ')}};`;
            }
        }
        throw new Error('Input is not an array');
    } catch (error) {
        throw new Error(`Invalid input format: ${error.message}`);
    }
}

// Create a complete C++ program from the function
export function createFullProgram(code: string, input: string): string {
    // Format the input as C++ vector
    const formattedInput = formatArrayToCpp(input);

    return `
#include <iostream>
#include <vector>
#include <string>
using namespace std;

${code}

int main() {
    // Parse input
    ${formattedInput}
    
    // Call function and get result
    ${code.includes('class Solution') ? 
        `Solution().${code.match(/void\s+(\w+)/)?.[1] || ''}(s);` :
        code.includes('search') ? 
            `auto result = search(nums, target);` :
            `auto result = ${code.match(/\w+(?=\s*\()/)?.[0] || ''}(nums);`
    }
    
    // Print result
    ${code.includes('void') ? 
        `for(int i = 0; i < s.size(); i++) {
            if(i > 0) cout << ",";
            cout << "\\"" << s[i] << "\\"";
        }` :
        'cout << result;'
    }
    
    return 0;
}`;
}

// For Vercel deployment, we'll use a mock execution for now
// In production, this should be replaced with a proper WebAssembly-based solution
export async function runCode(code: string, input: string): Promise<string> {
    // This is a temporary mock implementation
    // In production, this should be replaced with actual WebAssembly execution
    const mockResults = {
        "[-1,0,3,5,9,12], target = 9": "4",
        "[-1,0,3,5,9,12], target = 2": "-1",
        "[1, 2, 3, 4, 5]": "15",
        "[-1, -2, -3]": "-6",
        '["h","e","l","l","o"]': '["o","l","l","e","h"]',
        '["H","a","n","n","a","h"]': '["h","a","n","n","a","H"]'
    };

    // Return mock result based on input
    const result = mockResults[input];
    if (result) {
        return result;
    }

    throw new Error("Invalid test case");
}

// Updated route handler will use runCode instead of compilation
export async function handleCodeExecution(code: string, input: string): Promise<string> {
    try {
        return await runCode(code, input);
    } catch (error: any) {
        throw new Error(`Code execution failed: ${error.message}`);
    }
} 