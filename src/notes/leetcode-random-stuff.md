---
title: Leetcode Rando Stuff
permalink: /leetcode-random-stuff/
tags: 
  - coding
  - leetcode
---
# Midpoint

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo = 0
        hi = len(nums) - 1
        
        while lo **<=** hi:
            mid = **(lo + hi) // 2**
            n = nums[mid] 
            if n == target:
                return mid
            elif n < target:
                lo = mid + 1
            else:
                hi = mid - 1
        
        return -1
```

Q: # WHY DO WE CALC THE MID POINT LIKE THIS? WHY NOT (lo - hi)//2 ?

A: Finding the midpoint between any two numbers is the same as finding the average between them. Add the numbers and divide by two.
