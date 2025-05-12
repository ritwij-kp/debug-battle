import crypto from 'crypto';

interface CodeforcesProblem {
    contestId: number;
    index: string;
    name: string;
    type: string;
    points?: number;
    rating?: number;
    tags: string[];
}

interface CodeforcesSubmission {
    id: number;
    contestId: number;
    problem: CodeforcesProblem;
    programmingLanguage: string;
    verdict: string;
    source: string;
}

interface ProblemsetResponse {
    status: string;
    result: {
        problems: CodeforcesProblem[];
        problemStatistics: {
            contestId: number;
            index: string;
            solvedCount: number;
        }[];
    };
}

// We'll use a simpler approach without authentication for now
const BASE_URL = 'https://codeforces.com';

export async function getRandomProblemWithWrongSubmission(): Promise<{
    problem: CodeforcesProblem;
    problemHTML: string;
    wrongSubmission: {
        source: string;
        programmingLanguage: string;
    };
}> {
    try {
        // Fetch problems from the problemset
        const response = await fetch('https://codeforces.com/api/problemset.problems');
        if (!response.ok) {
            throw new Error(`Failed to fetch problems: ${response.statusText}`);
        }

        const data: ProblemsetResponse = await response.json();
        if (data.status !== 'OK') {
            throw new Error('Failed to fetch problems from Codeforces API');
        }

        // Filter problems that have statistics
        const validProblems = data.result.problems.filter((problem, index) => {
            const stats = data.result.problemStatistics[index];
            return stats && stats.solvedCount > 0 && problem.type === 'PROGRAMMING';
        });

        if (validProblems.length === 0) {
            throw new Error('No valid problems found');
        }

        // Select a random problem
        const randomProblem = validProblems[Math.floor(Math.random() * validProblems.length)];

        // Fetch the problem HTML content
        const problemUrl = `https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`;
        const problemPageResponse = await fetch(problemUrl);
        if (!problemPageResponse.ok) {
            throw new Error(`Failed to fetch problem content: ${problemPageResponse.statusText}`);
        }

        const problemHTML = await problemPageResponse.text();

        // For now, we'll use a sample wrong submission
        const wrongSubmission = {
            source: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // This is an intentionally incorrect solution
    int n;
    cin >> n;
    vector<int> a(n);
    for(int i = 0; i < n; i++) {
        cin >> a[i];
    }
    // Wrong: Only outputs the first number
    cout << a[0] << "\\n";
    return 0;
}`,
            programmingLanguage: 'GNU C++17'
        };

        return {
            problem: randomProblem,
            problemHTML,
            wrongSubmission
        };
    } catch (error) {
        console.error('Error in getRandomProblemWithWrongSubmission:', error);
        throw error;
    }
}

export async function submitSolution(
    contestId: number,
    problemIndex: string,
    source: string,
    programmingLanguage: string
): Promise<string> {
    // Note: Direct submission through API might not be supported
    // We might need to use browser automation or provide instructions
    // for manual submission
    
    throw new Error('Direct submission is not supported. Please submit through Codeforces website.');
} 