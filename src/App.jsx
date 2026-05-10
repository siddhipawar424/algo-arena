import { useState, useEffect, useRef, useCallback } from "react";

// ─── SOUND ENGINE ─────────────────────────────────────────────────────────────
const AudioCtx = typeof window !== 'undefined' ? (window.AudioContext || window.webkitAudioContext) : null;
let actx = null;
function getACtx() { if (!actx && AudioCtx) actx = new AudioCtx(); return actx; }

function playTone(freq, type = 'square', dur = 0.1, vol = 0.15, delay = 0) {
  try {
    const ctx = getACtx(); if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(ctx.currentTime + delay); o.stop(ctx.currentTime + delay + dur);
  } catch(e) {}
}

const SFX = {
  click: () => { playTone(440, 'square', 0.05, 0.1); },
  success: () => {
    [523, 659, 784, 1047].forEach((f, i) => playTone(f, 'sine', 0.15, 0.2, i * 0.1));
  },
  fail: () => {
    [300, 250, 200].forEach((f, i) => playTone(f, 'sawtooth', 0.2, 0.18, i * 0.1));
  },
  damage: () => {
    [150, 120].forEach((f, i) => playTone(f, 'sawtooth', 0.3, 0.25, i * 0.08));
  },
  levelUp: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => playTone(f, 'sine', 0.2, 0.25, i * 0.08));
  },
  typing: () => { playTone(800 + Math.random() * 200, 'square', 0.03, 0.05); },
  hover: () => { playTone(660, 'sine', 0.04, 0.05); },
  gameOver: () => {
    [400, 350, 300, 220].forEach((f, i) => playTone(f, 'sawtooth', 0.4, 0.2, i * 0.15));
  },
  victory: () => {
    const melody = [523,659,784,1047,784,1047,1319];
    melody.forEach((f, i) => playTone(f, 'sine', 0.25, 0.3, i * 0.12));
  },
  xp: () => {
    [800, 1000, 1200].forEach((f, i) => playTone(f, 'sine', 0.1, 0.12, i * 0.06));
  }
};

// ─── LANGUAGES ────────────────────────────────────────────────────────────────
const LANGS = [
  { id: 'javascript', label: 'JavaScript', ext: 'js', color: '#f7df1e' },
  { id: 'python', label: 'Python', ext: 'py', color: '#3572A5' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts', color: '#3178c6' },
  { id: 'java', label: 'Java', ext: 'java', color: '#f89820' },
  { id: 'cpp', label: 'C++', ext: 'cpp', color: '#f34b7d' },
  { id: 'rust', label: 'Rust', ext: 'rs', color: '#dea584' },
];

// ─── LEVELS DATA ───────────────────────────────────────────────────────────────
const LEVELS = [
  {
    id: 1, name: "Goblin King", monsterEmoji: "👺", monsterHP: 80, monsterColor: "#22c55e",
    problem: "Two Sum", difficulty: "Easy",
    description: "Given an array nums and a target integer, return the indices of the two numbers that add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "Exactly one solution exists"],
    optimalTag: "O(n) HashMap",
    testCases: [
      { args: { nums: [2,7,11,15], target: 9 }, expected: [0,1] },
      { args: { nums: [3,2,4], target: 6 }, expected: [1,2] },
      { args: { nums: [3,3], target: 6 }, expected: [0,1] }
    ],
    starters: {
      javascript: `function twoSum(nums, target) {\n  // your code here\n}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  // your code here\n  return [];\n}`,
      python: `def twoSum(nums, target):\n    # your code here\n    pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your code here\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    // your code here\n    return {};\n}`,
      rust: `use std::collections::HashMap;\nfn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    // your code here\n    vec![]\n}`
    },
    jsRunner: (tc) => `twoSum(${JSON.stringify(tc.args.nums)}, ${tc.args.target})`,
    pyRunner: (code, tc) => `${code}\nresult = twoSum(${JSON.stringify(tc.args.nums)}, ${tc.args.target})\nprint(result)`,
  },
  {
    id: 2, name: "Sliding Serpent", monsterEmoji: "🐍", monsterHP: 100, monsterColor: "#a855f7",
    problem: "Longest Substring Without Repeating Characters", difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3" },
      { input: 's = "bbbbb"', output: "1" }
    ],
    constraints: ["0 ≤ s.length ≤ 5×10⁴", "s consists of letters, digits, symbols"],
    optimalTag: "O(n) Sliding Window",
    testCases: [
      { args: { s: "abcabcbb" }, expected: 3 },
      { args: { s: "bbbbb" }, expected: 1 },
      { args: { s: "pwwkew" }, expected: 3 }
    ],
    starters: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // your code here\n}`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  // your code here\n  return 0;\n}`,
      python: `def lengthOfLongestSubstring(s):\n    # your code here\n    pass`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // your code here\n        return 0;\n    }\n}`,
      cpp: `#include <string>\n#include <unordered_set>\nusing namespace std;\nint lengthOfLongestSubstring(string s) {\n    // your code here\n    return 0;\n}`,
      rust: `fn length_of_longest_substring(s: String) -> i32 {\n    // your code here\n    0\n}`
    },
    jsRunner: (tc) => `lengthOfLongestSubstring(${JSON.stringify(tc.args.s)})`,
    pyRunner: (code, tc) => `${code}\nresult = lengthOfLongestSubstring(${JSON.stringify(tc.args.s)})\nprint(result)`,
  },
  {
    id: 3, name: "Binary Basilisk", monsterEmoji: "🦎", monsterHP: 120, monsterColor: "#06b6d4",
    problem: "Search in Rotated Sorted Array", difficulty: "Medium",
    description: "Given a sorted array possibly rotated at an unknown pivot and a target, return the index of target or -1.",
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [1], target = 0", output: "-1" }
    ],
    constraints: ["1 ≤ nums.length ≤ 5000", "All values are unique"],
    optimalTag: "O(log n) Binary Search",
    testCases: [
      { args: { nums: [4,5,6,7,0,1,2], target: 0 }, expected: 4 },
      { args: { nums: [1], target: 0 }, expected: -1 },
      { args: { nums: [1,3], target: 3 }, expected: 1 }
    ],
    starters: {
      javascript: `function search(nums, target) {\n  // your code here\n}`,
      typescript: `function search(nums: number[], target: number): number {\n  // your code here\n  return -1;\n}`,
      python: `def search(nums, target):\n    # your code here\n    pass`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        // your code here\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\nint search(vector<int>& nums, int target) {\n    // your code here\n    return -1;\n}`,
      rust: `fn search(nums: Vec<i32>, target: i32) -> i32 {\n    // your code here\n    -1\n}`
    },
    jsRunner: (tc) => `search(${JSON.stringify(tc.args.nums)}, ${tc.args.target})`,
    pyRunner: (code, tc) => `${code}\nresult = search(${JSON.stringify(tc.args.nums)}, ${tc.args.target})\nprint(result)`,
  },
  {
    id: 4, name: "The Kraken", monsterEmoji: "🐙", monsterHP: 140, monsterColor: "#3b82f6",
    problem: "Number of Islands", difficulty: "Medium",
    description: "Given an m×n grid of '1's (land) and '0's (water), count the number of islands.",
    examples: [{ input: 'grid=[["1","1","0"],["0","1","0"],["0","0","1"]]', output: "2" }],
    constraints: ["1 ≤ m, n ≤ 300"],
    optimalTag: "O(m×n) BFS/DFS",
    testCases: [
      { args: { grid: [["1","1","0"],["0","1","0"],["0","0","1"]] }, expected: 2 },
      { args: { grid: [["1","1","1"],["0","1","0"],["1","1","1"]] }, expected: 1 },
      { args: { grid: [["0","0"],["0","0"]] }, expected: 0 }
    ],
    starters: {
      javascript: `function numIslands(grid) {\n  // your code here\n}`,
      typescript: `function numIslands(grid: string[][]): number {\n  // your code here\n  return 0;\n}`,
      python: `def numIslands(grid):\n    # your code here\n    pass`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // your code here\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\nint numIslands(vector<vector<char>>& grid) {\n    // your code here\n    return 0;\n}`,
      rust: `fn num_islands(grid: Vec<Vec<char>>) -> i32 {\n    // your code here\n    0\n}`
    },
    jsRunner: (tc) => `numIslands(${JSON.stringify(tc.args.grid)})`,
    pyRunner: (code, tc) => `${code}\nresult = numIslands(${JSON.stringify(tc.args.grid)})\nprint(result)`,
  },
  {
    id: 5, name: "The Sphinx", monsterEmoji: "🦁", monsterHP: 160, monsterColor: "#f59e0b",
    problem: "LRU Cache", difficulty: "Hard",
    description: "Design a LRU cache with get(key) and put(key,value) operations. Both must run in O(1) time.",
    examples: [{ input: 'LRUCache(2); put(1,1); put(2,2); get(1)→1; put(3,3); get(2)→-1', output: "correct" }],
    constraints: ["1 ≤ capacity ≤ 3000", "O(1) average per operation"],
    optimalTag: "O(1) HashMap + DLL",
    testCases: [
      { args: { ops: ["LRUCache","put","put","get","put","get","put","get","get","get"], vals: [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]] }, expected: [null,null,null,1,null,-1,null,-1,3,4] }
    ],
    starters: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    // your code\n  }\n  get(key) {\n    // your code\n  }\n  put(key, value) {\n    // your code\n  }\n}`,
      typescript: `class LRUCache {\n  constructor(private capacity: number) {\n    // your code\n  }\n  get(key: number): number {\n    return -1;\n  }\n  put(key: number, value: number): void {\n    // your code\n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass`,
      java: `import java.util.*;\nclass LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,
      cpp: `#include <unordered_map>\n#include <list>\nusing namespace std;\nclass LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,
      rust: `use std::collections::HashMap;\nstruct LRUCache { capacity: usize }\nimpl LRUCache {\n    fn new(capacity: i32) -> Self { LRUCache { capacity: capacity as usize } }\n    fn get(&mut self, key: i32) -> i32 { -1 }\n    fn put(&mut self, key: i32, value: i32) {}\n}`
    },
    jsRunner: (tc) => `(function(){ const ops=${JSON.stringify(tc.args.ops)},vals=${JSON.stringify(tc.args.vals)};let obj=null,r=[];for(let i=0;i<ops.length;i++){if(ops[i]==="LRUCache"){obj=new LRUCache(vals[i][0]);r.push(null);}else if(ops[i]==="get"){r.push(obj.get(vals[i][0]));}else{obj.put(vals[i][0],vals[i][1]);r.push(null);}}return r;})()`,
    pyRunner: (code, tc) => `${code}\nops=${JSON.stringify(tc.args.ops)}\nvals=${JSON.stringify(tc.args.vals)}\nobj=None\nresults=[]\nfor op,val in zip(ops,vals):\n    if op=="LRUCache":obj=LRUCache(val[0]);results.append(None)\n    elif op=="get":results.append(obj.get(val[0]))\n    elif op=="put":obj.put(val[0],val[1]);results.append(None)\nprint(results)`,
  },
  {
    id: 6, name: "The Dragon", monsterEmoji: "🐉", monsterHP: 180, monsterColor: "#ef4444",
    problem: "Course Schedule", difficulty: "Hard",
    description: "There are numCourses courses. Given prerequisites [a,b] (must take b before a), return true if you can finish all.",
    examples: [
      { input: "numCourses=2, prerequisites=[[1,0]]", output: "true" },
      { input: "numCourses=2, prerequisites=[[1,0],[0,1]]", output: "false (cycle)" }
    ],
    constraints: ["1 ≤ numCourses ≤ 2000"],
    optimalTag: "O(V+E) Topological Sort",
    testCases: [
      { args: { n: 2, pre: [[1,0]] }, expected: true },
      { args: { n: 2, pre: [[1,0],[0,1]] }, expected: false },
      { args: { n: 1, pre: [] }, expected: true }
    ],
    starters: {
      javascript: `function canFinish(numCourses, prerequisites) {\n  // your code here\n}`,
      typescript: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  // your code here\n  return true;\n}`,
      python: `def canFinish(numCourses, prerequisites):\n    # your code here\n    pass`,
      java: `class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        return true;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\nbool canFinish(int n, vector<vector<int>>& pre) {\n    // your code here\n    return true;\n}`,
      rust: `fn can_finish(num_courses: i32, prerequisites: Vec<Vec<i32>>) -> bool {\n    true\n}`
    },
    jsRunner: (tc) => `canFinish(${tc.args.n}, ${JSON.stringify(tc.args.pre)})`,
    pyRunner: (code, tc) => `${code}\nresult = canFinish(${tc.args.n}, ${JSON.stringify(tc.args.pre)})\nprint(result)`,
  },
  {
    id: 7, name: "The Hydra", monsterEmoji: "🐲", monsterHP: 190, monsterColor: "#8b5cf6",
    problem: "Merge K Sorted Arrays", difficulty: "Hard",
    description: "Given k sorted arrays, return a single merged sorted array containing all elements.",
    examples: [{ input: "arrays = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }],
    constraints: ["k == arrays.length", "0 ≤ k ≤ 10⁴"],
    optimalTag: "O(n log k) Min-Heap",
    testCases: [
      { args: { arrays: [[1,4,5],[1,3,4],[2,6]] }, expected: [1,1,2,3,4,4,5,6] },
      { args: { arrays: [[1],[0]] }, expected: [0,1] },
      { args: { arrays: [] }, expected: [] }
    ],
    starters: {
      javascript: `function mergeKArrays(arrays) {\n  // your code here\n}`,
      typescript: `function mergeKArrays(arrays: number[][]): number[] {\n  // your code here\n  return [];\n}`,
      python: `def mergeKArrays(arrays):\n    # your code here\n    pass`,
      java: `import java.util.*;\nclass Solution {\n    public int[] mergeKArrays(int[][] arrays) {\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <queue>\nusing namespace std;\nvector<int> mergeKArrays(vector<vector<int>>& arrays) {\n    return {};\n}`,
      rust: `use std::collections::BinaryHeap;\nfn merge_k_arrays(arrays: Vec<Vec<i32>>) -> Vec<i32> {\n    vec![]\n}`
    },
    jsRunner: (tc) => `mergeKArrays(${JSON.stringify(tc.args.arrays)})`,
    pyRunner: (code, tc) => `${code}\nresult = mergeKArrays(${JSON.stringify(tc.args.arrays)})\nprint(result)`,
  },
  {
    id: 8, name: "FINAL BOSS", monsterEmoji: "💀", monsterHP: 200, monsterColor: "#ec4899",
    problem: "Word Ladder", difficulty: "Hard",
    description: "Return the length of the shortest transformation sequence from beginWord to endWord, changing one letter at a time. Each word must be in wordList.",
    examples: [
      { input: 'begin="hit", end="cog", list=["hot","dot","dog","lot","log","cog"]', output: "5" },
    ],
    constraints: ["1 ≤ beginWord.length ≤ 10"],
    optimalTag: "O(m²×n) BFS",
    testCases: [
      { args: { begin: "hit", end: "cog", list: ["hot","dot","dog","lot","log","cog"] }, expected: 5 },
      { args: { begin: "hit", end: "cog", list: ["hot","dot","dog","lot","log"] }, expected: 0 },
      { args: { begin: "a", end: "c", list: ["a","b","c"] }, expected: 2 }
    ],
    starters: {
      javascript: `function ladderLength(beginWord, endWord, wordList) {\n  // your code here\n}`,
      typescript: `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {\n  // your code here\n  return 0;\n}`,
      python: `def ladderLength(beginWord, endWord, wordList):\n    # your code here\n    pass`,
      java: `import java.util.*;\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        return 0;\n    }\n}`,
      cpp: `#include <string>\n#include <vector>\n#include <queue>\n#include <unordered_set>\nusing namespace std;\nint ladderLength(string begin, string end, vector<string>& list) {\n    return 0;\n}`,
      rust: `use std::collections::{HashSet, VecDeque};\nfn ladder_length(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {\n    0\n}`
    },
    jsRunner: (tc) => `ladderLength(${JSON.stringify(tc.args.begin)}, ${JSON.stringify(tc.args.end)}, ${JSON.stringify(tc.args.list)})`,
    pyRunner: (code, tc) => `${code}\nresult = ladderLength(${JSON.stringify(tc.args.begin)}, ${JSON.stringify(tc.args.end)}, ${JSON.stringify(tc.args.list)})\nprint(result)`,
  }
];

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: 'first_blood', icon: '🩸', title: 'First Blood', desc: 'Defeat your first monster' },
  { id: 'speedrun', icon: '⚡', title: 'Speed Demon', desc: 'Solve a level in under 60 seconds' },
  { id: 'no_damage', icon: '🛡️', title: 'Untouchable', desc: 'Reach level 5 without taking damage' },
  { id: 'optimal_5', icon: '💎', title: 'Efficiency Expert', desc: 'Get optimal complexity 5 times' },
  { id: 'polyglot', icon: '🌐', title: 'Polyglot', desc: 'Solve in 3 different languages' },
  { id: 'comeback', icon: '🔥', title: 'Comeback King', desc: 'Win after reaching < 20 HP' },
  { id: 'final_boss', icon: '👑', title: 'Dragon Slayer', desc: 'Defeat the Final Boss' },
];

// ─── COMPLEXITY DETECTION ─────────────────────────────────────────────────────
function detectComplexity(code) {
  const loopPattern = /^\s*(for|while)\s/;
  const lines = code.split('\n');
  let maxDepth = 0;
  const stack = [];
  for (const line of lines) {
    const currentIndent = line.length - line.trimStart().length;
    while (stack.length > 0 && stack[stack.length - 1] >= currentIndent) stack.pop();
    if (loopPattern.test(line)) { stack.push(currentIndent); maxDepth = Math.max(maxDepth, stack.length); }
  }
  return maxDepth >= 2 ? 'suboptimal' : 'optimal';
}

// ─── STATE ────────────────────────────────────────────────────────────────────
function loadState() { try { const s = localStorage.getItem('algoarena_v3'); if (s) return JSON.parse(s); } catch {} return null; }
function saveState(s) { try { localStorage.setItem('algoarena_v3', JSON.stringify(s)); } catch {} }
function initState() { return { playerHP: 100, playerMaxHP: 100, clearedLevels: [], xp: 0, attempts: 0, achievements: [], langs: {}, streak: 0, totalDamageDealt: 0 }; }

// ─── PYODIDE ──────────────────────────────────────────────────────────────────
let pyodideInstance = null, pyodideLoading = null;
async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;
  pyodideLoading = (async () => {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
    pyodideInstance = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/' });
    return pyodideInstance;
  })();
  return pyodideLoading;
}

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function parseOutput(raw, expected) {
  if (raw === null || raw === undefined) return raw;
  if (typeof raw === typeof expected) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw.trim().replace(/None/g,'null').replace(/True/g,'true').replace(/False/g,'false')); } catch { return raw; }
  }
  return raw;
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;600&family=Exo+2:wght@300;400;600;800&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}
body{background:#020409;font-family:'Exo 2',sans-serif;color:#e2e8f0;min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:#0a0f1e;}
::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#7c3aed,#ec4899);border-radius:3px;}

@keyframes shake{0%,100%{transform:translateX(0)}15%,45%,75%{transform:translateX(-10px)}30%,60%,90%{transform:translateX(10px)}}
@keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-6px) rotate(-1deg)}75%{transform:translateY(-3px) rotate(1deg)}}
@keyframes glowPulse{0%,100%{filter:drop-shadow(0 0 8px currentColor)}50%{filter:drop-shadow(0 0 24px currentColor) drop-shadow(0 0 48px currentColor)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}
@keyframes ripple{0%{transform:scale(0);opacity:0.8}100%{transform:scale(4);opacity:0}}
@keyframes hpFlash{0%,100%{opacity:1}50%{opacity:0.3}}
@keyframes xpPop{0%{transform:scale(0) translateY(0);opacity:1}100%{transform:scale(1.5) translateY(-60px);opacity:0}}
@keyframes borderGlow{0%,100%{box-shadow:0 0 8px 1px rgba(124,58,237,0.3)}50%{box-shadow:0 0 24px 4px rgba(124,58,237,0.7),0 0 48px 8px rgba(236,72,153,0.2)}}
@keyframes starBurst{0%{transform:scale(0) rotate(0deg);opacity:1}100%{transform:scale(3) rotate(360deg);opacity:0}}
@keyframes typing{0%,100%{opacity:1}50%{opacity:0}}
@keyframes damageNumber{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-80px) scale(1.5);opacity:0}}
@keyframes bgShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes progressFill{from{width:0}to{width:var(--target-width)}}
@keyframes monsterHit{0%,100%{filter:brightness(1)}20%,60%{filter:brightness(3) saturate(0)}}

.shake{animation:shake 0.5s ease;}
.float-anim{animation:float 4s ease-in-out infinite;}
.fadeUp{animation:fadeUp 0.4s ease both;}
.glow-pulse{animation:glowPulse 2.5s ease-in-out infinite;}
.border-glow{animation:borderGlow 2s ease-in-out infinite;}
.orbitron{font-family:'Orbitron',monospace;}
.mono{font-family:'JetBrains Mono',monospace;}

.hp-track{background:#0a0f1e;border-radius:999px;height:10px;overflow:hidden;border:1px solid #1e293b;position:relative;}
.hp-fill{height:100%;border-radius:999px;transition:width 0.6s cubic-bezier(0.4,0,0.2,1);position:relative;overflow:hidden;}
.hp-fill::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);animation:scanline 2s linear infinite;}
.hp-player{background:linear-gradient(90deg,#dc2626,#f97316,#fbbf24);}
.hp-monster{background:linear-gradient(90deg,#7c3aed,#a855f7,#ec4899);}
.hp-progress{background:linear-gradient(90deg,#4f46e5,#7c3aed);}

.card{background:rgba(10,15,30,0.9);border:1px solid rgba(99,102,241,0.2);border-radius:14px;backdrop-filter:blur(12px);}

.btn{border:none;border-radius:8px;font-family:'Exo 2',sans-serif;font-weight:600;cursor:pointer;transition:all 0.15s;letter-spacing:1px;text-transform:uppercase;position:relative;overflow:hidden;}
.btn::before{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background 0.15s;}
.btn:hover::before{background:rgba(255,255,255,0.08);}
.btn:active{transform:scale(0.97);}
.btn-primary{background:linear-gradient(135deg,#6d28d9,#4f46e5);color:#fff;padding:10px 22px;font-size:14px;box-shadow:0 4px 15px rgba(109,40,217,0.4);}
.btn-primary:hover{box-shadow:0 6px 25px rgba(109,40,217,0.6);}
.btn-success{background:linear-gradient(135deg,#059669,#047857);color:#fff;padding:10px 22px;font-size:14px;box-shadow:0 4px 15px rgba(5,150,105,0.4);}
.btn-success:hover{box-shadow:0 6px 25px rgba(5,150,105,0.6);}
.btn-danger{background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;padding:10px 22px;font-size:14px;}
.btn-ghost{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:#94a3b8;padding:8px 16px;font-size:13px;}
.btn:disabled{opacity:0.45;cursor:not-allowed;transform:none;}

.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;}
.badge-optimal{background:#14532d;color:#4ade80;border:1px solid #22c55e44;}
.badge-suboptimal{background:#451a03;color:#fb923c;border:1px solid #f9731644;}
.badge-xp{background:#1e1b4b;color:#a78bfa;border:1px solid #7c3aed44;}
.badge-easy{background:#14532d44;color:#4ade80;border:1px solid #22c55e22;}
.badge-medium{background:#78350f44;color:#fb923c;border:1px solid #f9731622;}
.badge-hard{background:#7f1d1d44;color:#f87171;border:1px solid #ef444422;}

.lang-pill{padding:5px 14px;border-radius:999px;cursor:pointer;font-weight:700;font-size:12px;letter-spacing:0.5px;border:1.5px solid transparent;transition:all 0.2s;}
.lang-pill.active{border-color:currentColor;}
.lang-pill:not(.active){background:rgba(255,255,255,0.04);color:#475569;border-color:#1e293b;}
.lang-pill:not(.active):hover{background:rgba(255,255,255,0.07);color:#64748b;}

.code-wrap{border:1px solid rgba(99,102,241,0.25);border-radius:10px;overflow:hidden;}
.code-header{background:#070b15;padding:8px 14px;border-bottom:1px solid rgba(99,102,241,0.15);display:flex;align-items:center;gap:8px;}
.dot{width:11px;height:11px;border-radius:50%;}

textarea.editor{width:100%;min-height:260px;background:#070b15;color:#e2e8f0;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.65;padding:14px 16px;border:none;outline:none;resize:vertical;tab-size:4;}
textarea.editor::selection{background:rgba(99,102,241,0.3);}

.level-node{border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.25s;position:relative;border:2px solid transparent;font-family:'Exo 2',sans-serif;}
.level-node.cleared{background:linear-gradient(135deg,#064e3b,#052e16);border-color:#22c55e;}
.level-node.unlocked{background:linear-gradient(135deg,#1e1b4b,#14103e);border-color:#7c3aed;animation:borderGlow 2s ease-in-out infinite;}
.level-node.unlocked:hover{transform:scale(1.07) translateY(-3px);box-shadow:0 12px 30px rgba(124,58,237,0.4);}
.level-node.locked{background:#0a0f1e;border-color:#1e293b;cursor:not-allowed;opacity:0.5;}

.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;backdrop-filter:blur(4px);}

.particle{position:fixed;pointer-events:none;border-radius:50%;animation:float 3s ease-in-out infinite;}

.grid-bg{background-image:linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px);background-size:40px 40px;}

.damage-float{position:absolute;font-family:'Orbitron',monospace;font-weight:900;pointer-events:none;animation:damageNumber 1s ease-out forwards;z-index:50;}

.streak-bar{height:4px;background:linear-gradient(90deg,#f59e0b,#ef4444);border-radius:2px;transition:width 0.3s;}

.test-line{font-family:'JetBrains Mono',monospace;font-size:12px;padding:5px 10px;border-radius:6px;margin-bottom:4px;}
.test-pass{background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);color:#4ade80;}
.test-fail{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171;}
.test-error{background:rgba(251,146,60,0.08);border:1px solid rgba(251,146,60,0.2);color:#fb923c;}

.achievement-toast{position:fixed;bottom:24px;right:24px;z-index:200;padding:14px 20px;background:rgba(10,15,30,0.97);border:1px solid #7c3aed;border-radius:12px;display:flex;align-items:center;gap:12px;animation:slideIn 0.4s ease;box-shadow:0 8px 32px rgba(124,58,237,0.4);}

.hp-crit{animation:hpFlash 0.4s ease 3;}
`;

// ─── HP BAR ───────────────────────────────────────────────────────────────────
function HPBar({ current, max, type = 'player', label, flash }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const isLow = pct < 25;
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
          <span style={{ fontSize: 12, color: isLow ? '#f87171' : '#94a3b8', fontWeight: 700 }}>{current}/{max}</span>
        </div>
      )}
      <div className="hp-track">
        <div
          className={`hp-fill hp-${type} ${flash ? 'hp-crit' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── FLOATING DAMAGE ──────────────────────────────────────────────────────────
function DamageFloat({ value, color, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1100); return () => clearTimeout(t); }, []);
  return (
    <div className="damage-float" style={{ color, fontSize: 28, top: '10%', left: '50%', transform: 'translateX(-50%)' }}>
      {value > 0 ? `-${value}` : `+${Math.abs(value)}`}
    </div>
  );
}

// ─── MONSTER ─────────────────────────────────────────────────────────────────
function Monster({ level, shake, hit }) {
  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{ fontSize: 90, lineHeight: 1, display: 'inline-block' }}
        className={`float-anim ${shake ? 'shake' : ''} ${hit ? 'monster-hit' : ''}`}
        style={{ fontSize: 90, filter: `drop-shadow(0 0 20px ${level.monsterColor}aa)` }}>
        {level.monsterEmoji}
      </div>
    </div>
  );
}

// ─── ACHIEVEMENT TOAST ────────────────────────────────────────────────────────
function AchievementToast({ achievement, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, []);
  return (
    <div className="achievement-toast">
      <span style={{ fontSize: 28 }}>{achievement.icon}</span>
      <div>
        <div style={{ fontSize: 11, color: '#7c3aed', letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' }}>Achievement Unlocked!</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginTop: 2 }}>{achievement.title}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{achievement.desc}</div>
      </div>
    </div>
  );
}

// ─── PARTICLES ────────────────────────────────────────────────────────────────
function Particles({ count = 15 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    color: ['#7c3aed', '#ec4899', '#06b6d4', '#4ade80', '#f59e0b'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 4,
    dur: 3 + Math.random() * 4
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, opacity: 0.3,
          animation: `float ${p.dur}s ${p.delay}s ease-in-out infinite`
        }} />
      ))}
    </div>
  );
}

// ─── DUNGEON MAP ──────────────────────────────────────────────────────────────
function DungeonMap({ state, onSelectLevel }) {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const rows = [[0,1],[2,3],[4,5],[6,7]];
  const totalXPNeeded = 800;
  const lvl = Math.floor(state.xp / 100) + 1;

  return (
    <div style={{ minHeight: '100vh', background: '#020409', padding: '24px 16px', position: 'relative' }} className="grid-bg">
      <Particles />
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 8 }}>
          <div className="orbitron fadeUp" style={{ fontSize: 26, fontWeight: 900, letterSpacing: 3, marginBottom: 6 }}>
            <span style={{ background: 'linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ⚔ ALGO ARENA ⚔
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>
            Conquer monsters with code
          </p>
        </div>

        {/* PLAYER CARD */}
        <div className="card fadeUp" style={{ marginBottom: 24, padding: '16px 20px', borderColor: 'rgba(124,58,237,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>🧙</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <div>
                  <span className="orbitron" style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>HERO</span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: '#7c3aed', fontWeight: 700 }}>LVL {lvl}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-xp">{state.xp} XP</span>
                  {state.streak > 1 && <span className="badge" style={{ background: '#7c1d1d44', color: '#f87171', border: '1px solid #f8717144' }}>🔥 {state.streak}×</span>}
                </div>
              </div>
              <HPBar current={state.playerHP} max={state.playerMaxHP || 100} type="player" label="HP" flash={state.playerHP < 25} />
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>XP Progress</span>
                  <span style={{ fontSize: 10, color: '#475569' }}>{state.xp % 100}/100</span>
                </div>
                <div style={{ background: '#0a0f1e', borderRadius: 999, height: 6, overflow: 'hidden', border: '1px solid #1e293b' }}>
                  <div style={{ height: '100%', width: `${(state.xp % 100)}%`, background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: 999, transition: 'width 0.5s' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Achievements strip */}
          {state.achievements?.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(99,102,241,0.15)', paddingTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {state.achievements.map(id => {
                const a = ACHIEVEMENTS.find(x => x.id === id);
                return a ? <span key={id} title={a.title} style={{ fontSize: 18, cursor: 'default' }}>{a.icon}</span> : null;
              })}
            </div>
          )}
        </div>

        {/* LEVELS */}
        <div style={{ marginBottom: 24 }}>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {row.map(idx => {
                const lvl = LEVELS[idx];
                const cleared = state.clearedLevels.includes(lvl.id);
                const unlocked = idx === 0 || state.clearedLevels.includes(LEVELS[idx - 1]?.id);
                const status = cleared ? 'cleared' : unlocked ? 'unlocked' : 'locked';
                const isHovered = hoveredLevel === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    className={`level-node ${status}`}
                    style={{ padding: '14px 12px', minHeight: 90 }}
                    onClick={() => { if (status !== 'locked') { SFX.click(); onSelectLevel(lvl.id); } }}
                    onMouseEnter={() => { if (status === 'unlocked') { SFX.hover(); setHoveredLevel(lvl.id); } }}
                    onMouseLeave={() => setHoveredLevel(null)}
                  >
                    <div style={{ fontSize: 32, marginBottom: 4, filter: cleared ? 'none' : `drop-shadow(0 0 8px ${lvl.monsterColor})` }}>
                      {cleared ? '✅' : status === 'locked' ? '🔒' : lvl.monsterEmoji}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, textAlign: 'center', color: cleared ? '#4ade80' : unlocked ? '#a78bfa' : '#334155', lineHeight: 1.3, letterSpacing: 0.5 }}>
                      {lvl.name}
                    </div>
                    <div style={{ fontSize: 9, color: '#334155', marginTop: 2 }}>
                      Lv.{lvl.id} · {lvl.difficulty}
                    </div>
                    {status === 'unlocked' && !cleared && (
                      <div style={{ marginTop: 4 }}>
                        <span className={`badge badge-${lvl.difficulty.toLowerCase()}`}>{lvl.difficulty}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* PROGRESS */}
        <div className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Dungeon Progress</div>
          <HPBar current={state.clearedLevels.length} max={8} type="progress" />
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
            {state.clearedLevels.length}/8 bosses defeated · {state.totalDamageDealt || 0} total damage
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BATTLE SCREEN ────────────────────────────────────────────────────────────
function BattleScreen({ levelId, state, onResult, onBack }) {
  const level = LEVELS.find(l => l.id === levelId);
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState(level.starters.javascript);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [monsterHP, setMonsterHP] = useState(level.monsterHP);
  const [pyLoading, setPyLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [monsterHit, setMonsterHit] = useState(false);
  const [damage, setDamage] = useState(null);
  const [startTime] = useState(Date.now());
  const [hintOpen, setHintOpen] = useState(false);

  useEffect(() => {
    setCode(level.starters[lang] || level.starters.javascript);
    setTestResults([]);
  }, [lang, levelId]);

  async function ensurePy() {
    if (pyodideInstance) return true;
    setPyLoading(true);
    try { await loadPyodide(); setPyLoading(false); return true; }
    catch { setPyLoading(false); return false; }
  }

  async function runCases(all = false) {
    const cases = all ? level.testCases : level.testCases.slice(0, 2);
    const results = [];
    for (const tc of cases) {
      if (lang === 'python') {
        const ok = await ensurePy();
        if (!ok) { results.push({ error: 'Pyodide unavailable', pass: false }); continue; }
        const script = level.pyRunner(code, tc);
        try {
          let stdout = '';
          pyodideInstance.setStdout({ batched: s => { stdout += s + '\n'; } });
          await pyodideInstance.runPythonAsync(script);
          const out = parseOutput(stdout.trim(), tc.expected);
          results.push({ output: out, expected: tc.expected, pass: deepEqual(out, tc.expected), error: null });
        } catch (e) {
          results.push({ output: null, expected: tc.expected, pass: false, error: e.message.split('\n').slice(-2).join(' ') });
        }
      } else {
        // JS/TS (treat TS as JS for eval), others show unsupported note
        if (['java','cpp','rust'].includes(lang)) {
          results.push({ output: null, expected: tc.expected, pass: false, error: `${lang.toUpperCase()} requires server-side execution. Try JavaScript or Python.` });
          continue;
        }
        const runner = level.jsRunner(tc);
        const fullCode = code + '\n\nreturn (' + runner + ');';
        const res = await new Promise(resolve => {
          const t = setTimeout(() => resolve({ output: null, error: 'Timeout (3s)' }), 3000);
          try { const fn = new Function(fullCode); clearTimeout(t); resolve({ output: fn(), error: null }); }
          catch (e) { clearTimeout(t); resolve({ output: null, error: e.message }); }
        });
        if (res.error) { results.push({ ...res, pass: false, expected: tc.expected }); continue; }
        results.push({ output: res.output, expected: tc.expected, pass: deepEqual(res.output, tc.expected), error: null });
      }
    }
    return results;
  }

  async function handleRun() {
    SFX.click();
    setRunning(true);
    setTestResults([]);
    const results = await runCases(false);
    setTestResults(results);
    setRunning(false);
    if (results.some(r => r.pass)) SFX.xp();
  }

  async function handleSubmit() {
    SFX.click();
    setSubmitting(true);
    setTestResults([]);
    const results = await runCases(true);
    setTestResults(results);
    const allPass = results.every(r => r.pass);
    const elapsed = (Date.now() - startTime) / 1000;
    if (allPass) {
      const complexity = detectComplexity(code);
      const dmg = complexity === 'optimal' ? level.monsterHP : Math.floor(level.monsterHP * 0.55);
      const xp = complexity === 'optimal' ? 100 : 55;
      setMonsterHP(prev => Math.max(0, prev - dmg));
      setMonsterHit(true);
      setDamage({ value: dmg, color: '#4ade80' });
      setTimeout(() => setMonsterHit(false), 600);
      SFX.success();
      setTimeout(() => SFX.levelUp(), 400);
      onResult({ type: 'win', damage: dmg, xp, complexity, elapsed, lang });
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setDamage({ value: 20, color: '#f87171' });
      SFX.fail();
      SFX.damage();
      const failReason = results.find(r => r.error)?.error || `Expected ${JSON.stringify(results.find(r=>!r.pass)?.expected)}, got ${JSON.stringify(results.find(r=>!r.pass)?.output)}`;
      onResult({ type: 'loss', damage: 20, failReason });
    }
    setSubmitting(false);
  }

  const runnable = !['java','cpp','rust'].includes(lang);

  return (
    <div style={{ minHeight: '100vh', background: '#020409', padding: '14px', position: 'relative' }} className="grid-bg">
      <Particles count={8} />
      <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* TOP BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={() => { SFX.click(); onBack(); }} className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}>
            ← MAP
          </button>
          <div style={{ flex: 1, maxWidth: 300 }}>
            <HPBar current={state.playerHP} max={state.playerMaxHP || 100} type="player" label="HERO HP" flash={state.playerHP < 25} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-xp">{state.xp} XP</span>
            <span className="badge" style={{ background: '#0a0f1e', border: '1px solid #1e293b', color: '#475569', fontSize: 10 }}>
              🕐 {Math.floor((Date.now() - startTime) / 1000)}s
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 14 }}>

          {/* LEFT */}
          <div>
            {/* Monster Card */}
            <div className="card" style={{ marginBottom: 12, padding: 20, textAlign: 'center', position: 'relative', overflow: 'hidden', borderColor: `${level.monsterColor}33` }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${level.monsterColor}08, transparent 70%)`, pointerEvents: 'none' }} />
              <div className="orbitron" style={{ fontSize: 10, color: level.monsterColor, letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase' }}>
                ⚔ {level.name} ⚔
              </div>

              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ fontSize: 88, lineHeight: 1, filter: `drop-shadow(0 0 24px ${level.monsterColor}aa)` }}
                  className={`float-anim ${shake ? 'shake' : ''}`}>
                  {level.monsterEmoji}
                </div>
                {damage && <DamageFloat value={damage.value} color={damage.color} onDone={() => setDamage(null)} />}
              </div>

              <div style={{ marginTop: 14 }}>
                <HPBar current={monsterHP} max={level.monsterHP} type="monster" label="MONSTER HP" />
              </div>

              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 8 }}>
                <span className={`badge badge-${level.difficulty.toLowerCase()}`}>{level.difficulty}</span>
                <span className="badge badge-optimal">{level.optimalTag}</span>
              </div>
            </div>

            {/* Problem */}
            <div className="card" style={{ padding: '16px 18px', marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#a78bfa', marginBottom: 8 }}>{level.problem}</div>
              <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{level.description}</div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Examples</div>
                {level.examples.map((ex, i) => (
                  <div key={i} className="mono" style={{ background: '#070b15', borderRadius: 8, padding: '8px 12px', marginBottom: 6, fontSize: 12, borderLeft: '3px solid #4f46e5' }}>
                    <div><span style={{ color: '#475569' }}>in:</span> <span style={{ color: '#e2e8f0' }}>{ex.input}</span></div>
                    <div><span style={{ color: '#475569' }}>out:</span> <span style={{ color: '#4ade80' }}>{ex.output}</span></div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 10, color: '#475569', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>Constraints</div>
                {level.constraints.map((c, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#475569', marginBottom: 3 }}>• {c}</div>
                ))}
              </div>

              <button
                className="btn btn-ghost"
                style={{ marginTop: 12, fontSize: 12, padding: '6px 14px', width: '100%' }}
                onClick={() => { SFX.click(); setHintOpen(h => !h); }}>
                {hintOpen ? '🙈 Hide Hint' : '💡 Show Hint'}
              </button>
              {hintOpen && (
                <div style={{ marginTop: 8, padding: '10px 12px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, fontSize: 12, color: '#a78bfa', lineHeight: 1.6 }}>
                  Try using a <strong>{level.optimalTag}</strong> approach. Think about what data structure gives you O(1) lookups.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="card" style={{ padding: '16px', marginBottom: 12 }}>
              {/* Language selector */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {LANGS.map(l => (
                  <button
                    key={l.id}
                    className={`lang-pill ${lang === l.id ? 'active' : ''}`}
                    style={{ color: lang === l.id ? l.color : undefined, borderColor: lang === l.id ? l.color : undefined, fontSize: 11 }}
                    onClick={() => { SFX.click(); setLang(l.id); }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {pyLoading && (
                <div style={{ fontSize: 12, color: '#fbbf24', marginBottom: 8, padding: '6px 10px', background: 'rgba(251,191,36,0.08)', borderRadius: 6, border: '1px solid rgba(251,191,36,0.2)' }}>
                  ⏳ Loading Python runtime...
                </div>
              )}
              {['java','cpp','rust'].includes(lang) && (
                <div style={{ fontSize: 12, color: '#fb923c', marginBottom: 8, padding: '6px 10px', background: 'rgba(251,146,60,0.08)', borderRadius: 6, border: '1px solid rgba(251,146,60,0.2)' }}>
                  ℹ {lang.toUpperCase()} code shown for reference. Use Run/Submit with JS or Python for live execution.
                </div>
              )}

              {/* Editor */}
              <div className="code-wrap">
                <div className="code-header">
                  <div className="dot" style={{ background: '#ff5f57' }} />
                  <div className="dot" style={{ background: '#ffbd2e' }} />
                  <div className="dot" style={{ background: '#28c940' }} />
                  <span className="mono" style={{ fontSize: 11, color: '#475569', marginLeft: 8 }}>
                    solution.{LANGS.find(l => l.id === lang)?.ext || 'js'}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: LANGS.find(l => l.id === lang)?.color, fontWeight: 700 }}>
                    {LANGS.find(l => l.id === lang)?.label}
                  </span>
                </div>
                <textarea
                  className="editor"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  onKeyDown={e => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const s = e.target.selectionStart, en = e.target.selectionEnd;
                      const nv = code.substring(0, s) + '    ' + code.substring(en);
                      setCode(nv);
                      requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; });
                    }
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn btn-primary" onClick={handleRun} disabled={running || submitting || !runnable} style={{ flex: 1 }}>
                  {running ? '▶ Running...' : '▶ Run Tests'}
                </button>
                <button className="btn btn-success" onClick={handleSubmit} disabled={running || submitting || !runnable} style={{ flex: 1 }}>
                  {submitting ? '⚔ Checking...' : '⚔ Submit'}
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="card" style={{ padding: '12px 14px', minHeight: 80 }}>
              {testResults.length === 0 ? (
                <span className="mono" style={{ color: '#334155', fontSize: 12 }}>Run your code to see output...</span>
              ) : testResults.map((r, i) => (
                <div key={i} className={`test-line ${r.error ? 'test-error' : r.pass ? 'test-pass' : 'test-fail'}`}>
                  <span style={{ opacity: 0.7 }}>Test {i + 1}:</span>{' '}
                  {r.error ? `⚠ ${r.error}` : r.pass
                    ? `✓ Pass — ${JSON.stringify(r.output)}`
                    : `✗ Fail — got ${JSON.stringify(r.output)}, expected ${JSON.stringify(r.expected)}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RESULT MODAL ─────────────────────────────────────────────────────────────
function ResultModal({ result, level, state, onContinue, onRetry }) {
  if (!result) return null;
  const isWin = result.type === 'win';
  return (
    <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) isWin ? onContinue() : onRetry(); }}>
      <div className="card fadeUp" style={{
        maxWidth: 440, width: '100%', padding: 32, textAlign: 'center',
        borderColor: isWin ? '#22c55e44' : '#ef444444',
        boxShadow: `0 0 60px ${isWin ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
      }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>{isWin ? '🏆' : '💀'}</div>
        <div className="orbitron" style={{ fontSize: 14, marginBottom: 10, color: isWin ? '#4ade80' : '#f87171', letterSpacing: 2 }}>
          {isWin ? 'ENEMY DEFEATED!' : 'WRONG ANSWER'}
        </div>

        {isWin ? (
          <>
            <div style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>
              Dealt <span style={{ color: '#f87171', fontWeight: 700 }}>{result.damage}</span> damage to <span style={{ color: level.monsterColor }}>{level.name}</span>!
              {result.elapsed < 60 && <span style={{ marginLeft: 6 }}>⚡ Solved in {Math.floor(result.elapsed)}s!</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
              <span className={`badge ${result.complexity === 'optimal' ? 'badge-optimal' : 'badge-suboptimal'}`}>
                {result.complexity === 'optimal' ? '⚡ Optimal Code' : '🐢 Brute Force'}
              </span>
              <span className="badge badge-xp">+{result.xp} XP</span>
              <span className="badge" style={{ background: '#0a0f1e', border: '1px solid #1e293b', color: '#64748b' }}>
                🌐 {result.lang}
              </span>
            </div>
            {result.complexity === 'suboptimal' && (
              <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#fbbf24', textAlign: 'left' }}>
                💡 <strong>Tip:</strong> Use <strong>{level.optimalTag}</strong> for 100% damage (+45 more XP)!
              </div>
            )}
            <button className="btn btn-success" style={{ width: '100%', padding: '12px' }} onClick={onContinue}>
              → CONTINUE
            </button>
          </>
        ) : (
          <>
            <div style={{ color: '#64748b', fontSize: 14, marginBottom: 6 }}>
              Took <span style={{ color: '#f87171', fontWeight: 700 }}>20 damage</span>! HP: {state.playerHP - 20}/100
            </div>
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: '#94a3b8', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace' }}>
              {result.failReason}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={onRetry}>
              ↺ TRY AGAIN
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── GAME OVER ────────────────────────────────────────────────────────────────
function GameOverScreen({ state, onRestart, onFullRestart }) {
  return (
    <div style={{ minHeight: '100vh', background: '#020409', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} className="grid-bg">
      <div className="card fadeUp" style={{ maxWidth: 460, width: '100%', textAlign: 'center', padding: 44, borderColor: '#ef444444', boxShadow: '0 0 80px rgba(220,38,38,0.15)' }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>💀</div>
        <div className="orbitron" style={{ fontSize: 16, color: '#f87171', letterSpacing: 3, marginBottom: 10 }}>GAME OVER</div>
        <div style={{ color: '#475569', marginBottom: 24, fontSize: 14 }}>
          Your hero has fallen in battle...<br />
          <span style={{ color: '#64748b' }}>{state.clearedLevels.length}/8 levels cleared · {state.xp} XP earned</span>
        </div>

        <div style={{ background: '#070b15', borderRadius: 10, padding: '14px 18px', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#334155', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Levels Cleared</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {LEVELS.map(l => (
              <span key={l.id} style={{ fontSize: 24 }} title={l.name}>
                {state.clearedLevels.includes(l.id) ? l.monsterEmoji : '⬛'}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[['XP Earned', state.xp], ['Attempts', state.attempts || 0], ['HP at Death', 0], ['Cleared', `${state.clearedLevels.length}/8`]].map(([l, v]) => (
            <div key={l} style={{ background: '#070b15', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#7c3aed', marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, padding: '12px' }} onClick={onRestart}>↺ Keep Progress</button>
          <button className="btn btn-danger" style={{ flex: 1, padding: '12px' }} onClick={onFullRestart}>⚠ Full Reset</button>
        </div>
      </div>
    </div>
  );
}

// ─── VICTORY ──────────────────────────────────────────────────────────────────
function VictoryScreen({ state, onRestart }) {
  useEffect(() => {
    SFX.victory();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    s.onload = () => {
      const fire = (angle, x) => window.confetti?.({ particleCount: 80, angle, spread: 60, origin: { x, y: 0.6 }, colors: ['#7c3aed','#ec4899','#4ade80','#06b6d4','#f59e0b'] });
      fire(60, 0.2); setTimeout(() => fire(120, 0.8), 300); setTimeout(() => fire(90, 0.5), 600);
    };
    document.head.appendChild(s);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#020409', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} className="grid-bg">
      <Particles count={20} />
      <div className="card fadeUp" style={{ maxWidth: 520, width: '100%', textAlign: 'center', padding: 44, position: 'relative', zIndex: 1, borderColor: '#22c55e44', boxShadow: '0 0 100px rgba(34,197,94,0.1)' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
        <div className="orbitron" style={{ fontSize: 16, color: '#4ade80', letterSpacing: 3, marginBottom: 8 }}>DUNGEON CLEARED!</div>
        <div style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>All 8 bosses defeated. You are a true Algorithm Champion!</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[['Total XP', state.xp + ' XP'], ['HP Remaining', state.playerHP + '/100'], ['Attempts', state.attempts || 0], ['Cleared', '8 / 8']].map(([l, v]) => (
            <div key={l} style={{ background: '#070b15', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#a78bfa', marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'left', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#334155', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>DSA Mastery Unlocked</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {['HashMap · Two Pointers', 'Sliding Window', 'Binary Search', 'BFS / DFS', 'LRU Cache Design', 'Topological Sort', 'Min-Heap', 'BFS Word Transform'].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                <span style={{ color: '#4ade80' }}>✓</span> {c}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1, padding: '12px' }} onClick={onRestart}>↺ Play Again</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function AlgoArena() {
  const [gameState, setGameState] = useState(() => {
    const s = loadState(); return s || initState();
  });
  const [screen, setScreen] = useState('map');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [resultModal, setResultModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [tick, setTick] = useState(0);

  // Timer tick for elapsed display
  useEffect(() => {
    if (screen !== 'battle') return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [screen]);

  function updateState(patch) {
    setGameState(prev => { const next = { ...prev, ...patch }; saveState(next); return next; });
  }

  function checkAchievements(state, result, elapsed) {
    const newAch = [];
    const current = state.achievements || [];
    if (!current.includes('first_blood') && state.clearedLevels.length === 0) newAch.push('first_blood');
    if (!current.includes('speedrun') && elapsed < 60) newAch.push('speedrun');
    if (!current.includes('no_damage') && state.playerHP === 100 && state.clearedLevels.length >= 4) newAch.push('no_damage');
    if (!current.includes('optimal_5') && result.complexity === 'optimal') {
      const optimalCount = (state.optimalCount || 0) + 1;
      if (optimalCount >= 5) newAch.push('optimal_5');
    }
    if (!current.includes('comeback') && state.playerHP < 20) newAch.push('comeback');
    if (!current.includes('final_boss') && selectedLevel === 8) newAch.push('final_boss');
    const langs = { ...(state.langs || {}), [result.lang]: true };
    if (!current.includes('polyglot') && Object.keys(langs).length >= 3) newAch.push('polyglot');
    return { newAch, langs };
  }

  function handleSelectLevel(id) {
    setSelectedLevel(id);
    setResultModal(null);
    setScreen('battle');
  }

  function handleResult(result) {
    const attempts = (gameState.attempts || 0) + 1;
    if (result.type === 'win') {
      const newXP = gameState.xp + result.xp;
      const newCleared = gameState.clearedLevels.includes(selectedLevel)
        ? gameState.clearedLevels : [...gameState.clearedLevels, selectedLevel];
      const dmgDealt = (gameState.totalDamageDealt || 0) + result.damage;
      const { newAch, langs } = checkAchievements(gameState, result, result.elapsed || 999);
      const allAch = [...(gameState.achievements || []), ...newAch];
      const optimalCount = (gameState.optimalCount || 0) + (result.complexity === 'optimal' ? 1 : 0);
      const streak = (gameState.streak || 0) + 1;
      updateState({ xp: newXP, clearedLevels: newCleared, attempts, totalDamageDealt: dmgDealt, achievements: allAch, langs, optimalCount, streak });
      setResultModal(result);
      if (newAch.length > 0) setTimeout(() => { setToast(ACHIEVEMENTS.find(a => a.id === newAch[0])); }, 600);
      if (newCleared.length === 8) setTimeout(() => { setResultModal(null); setScreen('victory'); SFX.victory(); }, 2200);
    } else {
      const newHP = Math.max(0, gameState.playerHP - 20);
      updateState({ playerHP: newHP, attempts, streak: 0 });
      setResultModal(result);
      if (newHP <= 0) setTimeout(() => { setResultModal(null); setScreen('gameover'); SFX.gameOver(); }, 1800);
    }
  }

  const currentLevel = LEVELS.find(l => l.id === selectedLevel);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {screen === 'map' && <DungeonMap state={gameState} onSelectLevel={handleSelectLevel} />}
      {screen === 'battle' && (
        <>
          <BattleScreen
            levelId={selectedLevel}
            state={gameState}
            onResult={handleResult}
            onBack={() => setScreen('map')}
          />
          {resultModal && (
            <ResultModal
              result={resultModal}
              level={currentLevel}
              state={gameState}
              onContinue={() => { SFX.click(); setResultModal(null); setScreen('map'); }}
              onRetry={() => { SFX.click(); setResultModal(null); }}
            />
          )}
        </>
      )}
      {screen === 'gameover' && (
        <GameOverScreen
          state={gameState}
          onRestart={() => { updateState({ playerHP: 100, streak: 0 }); setScreen('map'); }}
          onFullRestart={() => { const next = initState(); updateState(next); setScreen('map'); }}
        />
      )}
      {screen === 'victory' && (
        <VictoryScreen state={gameState} onRestart={() => { updateState(initState()); setScreen('map'); }} />
      )}
      {toast && <AchievementToast achievement={toast} onDone={() => { SFX.xp(); setToast(null); }} />}
    </>
  );
}
