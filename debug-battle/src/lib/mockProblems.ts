interface MockTestCase {
    input: string;
    output: string;
    explanation?: string;
}

export interface MockProblem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    examples: MockTestCase[];
    constraints: string[];
    buggyCode: string;
    language: string;
    tags: string[];
}

export const mockProblems: MockProblem[] = [
    {
        id: "array-sum",
        title: "Array Sum Bug",
        difficulty: "Easy",
        description: `Given an array of integers \`nums\`, return the sum of all elements.
        
The current implementation has a bug that causes it to return incorrect results for certain inputs.`,
        examples: [
            {
                input: "nums = [1, 2, 3, 4, 5]",
                output: "15",
                explanation: "1 + 2 + 3 + 4 + 5 = 15"
            },
            {
                input: "nums = [-1, -2, -3]",
                output: "-6",
                explanation: "(-1) + (-2) + (-3) = -6"
            }
        ],
        constraints: [
            "1 <= nums.length <= 10^4",
            "-10^4 <= nums[i] <= 10^4"
        ],
        buggyCode: `#include <vector>
using namespace std;

int arraySum(vector<int>& nums) {
    int sum = 0;
    // Bug: Loop starts from index 1, missing the first element
    for(int i = 1; i < nums.size(); i++) {
        sum += nums[i];
    }
    return sum;
}`,
        language: "C++",
        tags: ["Arrays", "Math"]
    },
    {
        id: "string-reverse",
        title: "String Reversal Error",
        difficulty: "Medium",
        description: `Write a function that reverses a string in-place. The input string is given as an array of characters \`s\`.
        
You must do this by modifying the input array in-place with O(1) extra memory.

The current implementation has a bug that causes incomplete reversal.`,
        examples: [
            {
                input: 's = ["h","e","l","l","o"]',
                output: '["o","l","l","e","h"]',
                explanation: "Reversed string from 'hello' to 'olleh'"
            },
            {
                input: 's = ["H","a","n","n","a","h"]',
                output: '["h","a","n","n","a","H"]',
                explanation: "Reversed string from 'Hannah' to 'hannaH'"
            }
        ],
        constraints: [
            "1 <= s.length <= 10^5",
            "s[i] is a printable ascii character"
        ],
        buggyCode: `class Solution {
public:
    void reverseString(vector<char>& s) {
        // Bug: Only reverses half of what it should
        // because of incorrect loop condition
        for(int i = 0; i < s.size()/4; i++) {
            char temp = s[i];
            s[i] = s[s.size()-1-i];
            s[s.size()-1-i] = temp;
        }
    }
};`,
        language: "C++",
        tags: ["Two Pointers", "String"]
    },
    {
        id: "binary-search",
        title: "Binary Search Bug",
        difficulty: "Hard",
        description: `Given a sorted array of unique integers \`nums\` and a target value \`target\`, return the index of \`target\` in the array. If \`target\` is not found, return -1.
        
The current implementation has a bug in its binary search logic that causes it to miss certain elements.

You must write an algorithm with O(log n) runtime complexity.`,
        examples: [
            {
                input: "nums = [-1,0,3,5,9,12], target = 9",
                output: "4",
                explanation: "9 exists in nums and its index is 4"
            },
            {
                input: "nums = [-1,0,3,5,9,12], target = 2",
                output: "-1",
                explanation: "2 does not exist in nums so return -1"
            }
        ],
        constraints: [
            "1 <= nums.length <= 10^4",
            "-10^4 <= nums[i] <= 10^4",
            "All integers in nums are unique",
            "nums is sorted in ascending order"
        ],
        buggyCode: `int search(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    // Bug: Uses <= instead of < in while condition
    // and has incorrect mid calculation
    while (left <= right) {
        // Bug: This can overflow for large numbers
        int mid = (left + right) / 2;
        
        if (nums[mid] == target)
            return mid;
        
        if (nums[mid] < target)
            left = mid;
        else
            right = mid;
    }
    
    return -1;
}`,
        language: "C++",
        tags: ["Binary Search", "Array"]
    }
];

export function getRandomProblem(): MockProblem {
    const randomIndex = Math.floor(Math.random() * mockProblems.length);
    return mockProblems[randomIndex];
} 