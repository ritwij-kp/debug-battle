import { writeFile, unlink } from 'node:fs/promises';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { randomBytes } from 'node:crypto';
import path from 'node:path';

const execAsync = promisify(exec);

// Convert JSON array to C++ vector initialization
function formatArrayToCpp(input: string): string {
    try {
        // Handle binary search format with array and target
        if (input.includes('target =')) {
            const [arrayPart, targetPart] = input.split('target =').map(s => s.trim());
            const cleanArrayPart = arrayPart.replace(/,$/, '').trim(); // Remove trailing comma
            const array = JSON.parse(cleanArrayPart);
            const target = parseInt(targetPart);
            
            if (!Array.isArray(array)) {
                throw new Error('First part must be an array');
            }
            
            if (isNaN(target)) {
                throw new Error('Target must be a number');
            }
            
            return `vector<int> nums = {${array.join(', ')}};\nint target = ${target};`;
        }
        
        // Handle regular array input (for other problems)
        const cleanInput = input.trim().replace(/,\s*$/, '');
        const array = JSON.parse(cleanInput);
        
        if (!Array.isArray(array)) {
            throw new Error('Input must be an array');
        }
        
        if (array.length === 0) {
            return 'vector<int> nums;';
        }
        
        if (typeof array[0] === 'string') {
            // For char arrays (string reversal problem)
            return `vector<char> s = {${array.map(c => `'${c}'`).join(', ')}};`;
        } else {
            // For number arrays
            return `vector<int> nums = {${array.join(', ')}};`;
        }
    } catch (error) {
        console.error('Input parsing error:', input);
        throw new Error(`Invalid input format: ${error.message}. Input was: ${input}`);
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
        `cout << "[";
        for(int i = 0; i < s.size(); i++) {
            if(i > 0) cout << ",";
            cout << "\\"" << s[i] << "\\"";
        }
        cout << "]";` :
        'cout << result;'
    }
    
    return 0;
}`;
}

export async function compileCpp(code: string): Promise<string> {
    const filename = `temp_${randomBytes(8).toString('hex')}`;
    const sourcePath = path.join(process.cwd(), `${filename}.cpp`);
    const executablePath = path.join(process.cwd(), `${filename}.exe`);

    try {
        // Write the source code to a file
        await writeFile(sourcePath, code);
        
        // Compile the code
        await execAsync(`g++ "${sourcePath}" -o "${executablePath}"`);
        
        return executablePath;
    } catch (error: any) {
        // Clean up the source file
        await unlink(sourcePath).catch(() => {});
        throw new Error(`Compilation error: ${error.message}`);
    } finally {
        // Clean up the source file
        await unlink(sourcePath).catch(() => {});
    }
}

export async function runExecutable(executablePath: string): Promise<string> {
    try {
        // Add a 10 second timeout to prevent infinite loops
        const { stdout } = await execAsync(`"${executablePath}"`, { 
            timeout: 10000,  // Changed from 5000 to 10000 ms
            killSignal: 'SIGTERM'
        });
        return stdout.trim();
    } catch (error: any) {
        if (error.killed || error.signal === 'SIGTERM') {
            throw new Error('Code execution timed out. Your code might be stuck in an infinite loop.');
        }
        throw error;
    } finally {
        // Clean up the executable
        await unlink(executablePath).catch(() => {});
    }
} 