---
title: Rolling Hash
permalink: /rolling-hash/
codeHighlighting: true
tags: 
  - coding
  - algorithm
  - leetcode
---
A rolling hash is a hash function where the input is typically a window of the data stream. It allows for the efficient recalculation of the hash value when the window moves through the data (by adding a new piece and removing an old one).

The [Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/) problem on LeetCode can be solved using rolling hashes.

1. **Goal**: Find the shortest palindrome by adding characters to the beginning of the given string.

2. **Use Rolling Hash**: A rolling hash is employed to efficiently find the longest palindrome starting at the first character of the string. 

3. **Check Palindrome**: Calculate rolling hashes from both ends of the string and compare them. When the hashes match, check for palindrome to confirm (to handle hash collisions).

4. **Find Longest Palindrome**: Find the longest palindrome starting at the first character.

5. **Construct Solution**: Once the longest initial palindrome is found, append the reverse of the remaining substring (the part not included in the palindrome) to the beginning of the original string. This forms the shortest palindrome.

6. **Optimization**: Use a good hash function to minimize collisions and optimize the palindrome check.

This solution leverages the efficiency of rolling hashes to quickly compare substrings and identify palindromes, greatly reducing the time complexity compared to brute force approaches.

```python
class Solution:
    def shortestPalindrome(self, s: str) -> str:
        A = ord('a')
        base, mod = 26, 10**9 + 7
        left, right, mul = 0, 0, 1
        
        best = -1
        for i in range(len(s)):
            left = (left * base + ord(s[i]) - A) % mod
            right = (right + (ord(s[i]) - A) * mul) % mod
            if left == right:
                best = i
            mul = mul * base % mod

        add = ("" if best == len(s) - 1 else s[best+1:])
        return add[::-1] + s
```

This code calculates rolling hashes from both ends of the string. If the hashes match, it updates the position of the best palindrome found. After iterating through the string, it appends the reverse of the non-palindromic part to the beginning of the original string to form the shortest palindrome. The `mod` is used to avoid overflow of hash values.
