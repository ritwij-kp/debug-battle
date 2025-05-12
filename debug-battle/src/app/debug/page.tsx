'use client';

import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { MockProblem, getRandomProblem } from '@/lib/mockProblems';
import { runTests } from '@/lib/codeRunner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TestResult {
    passed: boolean;
    output: string;
    expected: string;
    error?: string;
    executionTime?: number;
}

export default function DebugPage() {
    const [loading, setLoading] = useState(true);
    const [problem, setProblem] = useState<MockProblem | null>(null);
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState<'description' | 'testcases'>('description');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [runError, setRunError] = useState<string | null>(null);

    useEffect(() => {
        loadProblem();
    }, []);

    function loadProblem() {
        try {
            setLoading(true);
            const randomProblem = getRandomProblem();
            setProblem(randomProblem);
            setCode(randomProblem.buggyCode);
            setTestResults([]);
            setRunError(null);
        } catch (error) {
            console.error('Failed to load problem:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRunTests() {
        if (!problem) return;
        
        setIsRunning(true);
        setRunError(null);
        setActiveTab('testcases'); // Auto-switch to test cases tab
        
        try {
            const result = await runTests(code, problem);
            if (result.success) {
                setTestResults(result.results);
            } else {
                setRunError(result.error || 'Failed to run tests');
            }
        } catch (error) {
            setRunError(error.message);
        } finally {
            setIsRunning(false);
        }
    }

    // Add animation classes
    const getTestResultClass = (passed: boolean) => `
        transform transition-all duration-500 ease-out
        ${passed ? 'animate-success' : 'animate-failure'}
    `;

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            {/* Header */}
            <header className="bg-black/30 border-b border-zinc-800">
                <div className="container mx-auto px-4 py-4">
                    <Link 
                        href="/" 
                        className="
                            inline-flex items-center gap-2 
                            text-2xl font-bold text-yellow-400 
                            hover:text-yellow-300 transition-all duration-200
                            group
                        "
                    >
                        <svg 
                            className="w-8 h-8 transform group-hover:rotate-12 transition-transform duration-200" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                        </svg>
                        <span className="relative">
                            Debug Battle
                            <span className="
                                absolute -bottom-1 left-0 w-full h-0.5 
                                bg-yellow-400 transform scale-x-0 
                                group-hover:scale-x-100 
                                transition-transform duration-200
                            "></span>
                        </span>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Panel: Problem Description & Test Cases */}
                    <div className="bg-black/30 rounded-lg overflow-hidden">
                        {/* Problem Header */}
                        <div className="p-6 border-b border-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-yellow-400">
                                    {problem?.title}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    problem?.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                    problem?.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                    {problem?.difficulty}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {problem?.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-zinc-800">
                            <button
                                className={`px-6 py-3 text-sm font-medium ${
                                    activeTab === 'description'
                                        ? 'text-yellow-400 border-b-2 border-yellow-400'
                                        : 'text-zinc-400 hover:text-zinc-300'
                                }`}
                                onClick={() => setActiveTab('description')}
                            >
                                Description
                            </button>
                            <button
                                className={`px-6 py-3 text-sm font-medium ${
                                    activeTab === 'testcases'
                                        ? 'text-yellow-400 border-b-2 border-yellow-400'
                                        : 'text-zinc-400 hover:text-zinc-300'
                                }`}
                                onClick={() => setActiveTab('testcases')}
                            >
                                Test Cases
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 overflow-auto" style={{ height: 'calc(100vh - 400px)' }}>
                            {activeTab === 'description' ? (
                                <div className="space-y-6">
                                    <div className="prose prose-invert max-w-none">
                                        <div className="whitespace-pre-wrap">{problem?.description}</div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium text-zinc-300 mb-2">Constraints:</h3>
                                        <ul className="list-disc list-inside space-y-1 text-zinc-400">
                                            {problem?.constraints.map((constraint, index) => (
                                                <li key={index}>{constraint}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {problem?.examples.map((example, index) => (
                                        <div 
                                            key={index} 
                                            className={`
                                                bg-zinc-800/50 rounded-lg p-4 
                                                transform transition-all duration-500 ease-out
                                                ${isRunning ? 'animate-pulse' : ''}
                                                ${testResults[index] ? 
                                                    (testResults[index].passed ? 'scale-100' : 'scale-100') : 
                                                    'scale-100'
                                                }
                                            `}
                                        >
                                            <h4 className="text-sm font-medium text-zinc-300 mb-2">
                                                Example {index + 1}:
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="bg-black/30 p-3 rounded">
                                                    <div className="text-sm text-zinc-400">Input:</div>
                                                    <code className="text-sm text-zinc-200">{example.input}</code>
                                                </div>
                                                <div className="bg-black/30 p-3 rounded">
                                                    <div className="text-sm text-zinc-400">Output:</div>
                                                    <code className="text-sm text-zinc-200">{example.output}</code>
                                                </div>
                                                {example.explanation && (
                                                    <div className="bg-black/30 p-3 rounded">
                                                        <div className="text-sm text-zinc-400">Explanation:</div>
                                                        <div className="text-sm text-zinc-200">{example.explanation}</div>
                                                    </div>
                                                )}
                                                
                                                {testResults[index] && (
                                                    <div 
                                                        className={`
                                                            mt-2 p-3 rounded 
                                                            transform transition-all duration-500
                                                            ${testResults[index].passed ? 
                                                                'bg-green-500/20 animate-success' : 
                                                                'bg-red-500/20 animate-failure'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className={`
                                                                text-sm font-medium flex items-center gap-2
                                                                ${testResults[index].passed ? 'text-green-400' : 'text-red-400'}
                                                            `}>
                                                                {testResults[index].passed ? (
                                                                    <>
                                                                        <svg className="w-4 h-4 animate-success-icon" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Passed
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <svg className="w-4 h-4 animate-failure-icon" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Failed
                                                                    </>
                                                                )}
                                                            </span>
                                                            {testResults[index].executionTime && (
                                                                <span className="text-xs text-zinc-400 animate-fade-in">
                                                                    {testResults[index].executionTime.toFixed(2)}ms
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        {!testResults[index].passed && (
                                                            <div className="mt-2 space-y-1 animate-slide-down">
                                                                <div className="text-sm text-zinc-400">
                                                                    Your output:
                                                                    <code className="ml-2 text-red-400">
                                                                        {testResults[index].output || 'null'}
                                                                    </code>
                                                                </div>
                                                                {testResults[index].error && (
                                                                    <div className="text-sm text-red-400 animate-fade-in">
                                                                        Error: {testResults[index].error}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Code Editor */}
                    <div className="bg-black/30 rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-zinc-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-yellow-400">
                                    Debug This Code
                                </h2>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-zinc-400">
                                        Language: {problem?.language}
                                    </span>
                                    <Button
                                        onClick={handleRunTests}
                                        disabled={isRunning}
                                        className={`${
                                            isRunning 
                                                ? 'bg-yellow-500/50'
                                                : 'bg-yellow-500 hover:bg-yellow-400'
                                        } text-black font-semibold px-4 py-2 rounded-lg transition-all duration-200`}
                                    >
                                        {isRunning ? 'Running...' : 'Run Tests'}
                                    </Button>
                                </div>
                            </div>
                            {runError && (
                                <div className="mt-4 p-3 bg-red-500/20 rounded-lg">
                                    <span className="text-sm text-red-400">{runError}</span>
                                </div>
                            )}
                        </div>
                        <div className="h-[calc(100vh-200px)]">
                            <Editor
                                height="100%"
                                defaultLanguage="cpp"
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    readOnly: false,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 