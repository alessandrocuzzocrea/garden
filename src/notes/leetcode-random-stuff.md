---
title: Leetcode Rando Stuff
permalink: /leetcode-random-stuff/
codeHighlighting: true
tags: 
  - coding
  - algorithm
  - leetcode
---
# Midpoint

```python
class Solution:
    def search(self, nums: List[int], target: int) -> int:
        lo = 0
        hi = len(nums) - 1
        
        while lo <= hi:
            mid = (lo + hi) // 2
            n = nums[mid] 
            if n == target:
                return mid
            elif n < target:
                lo = mid + 1
            else:
                hi = mid - 1
        
        return -1
```

**Q:** Why do we find the middle point like this? Why not `(lo - hi)//2` ?

**A:** We find the middle point by adding the _low (lo)_ and _high (hi)_ numbers together and then dividing by 2. This is because when you add them together, you get the total of the two numbers. When you divide that total by 2, you get the point right in the middle of them. If we did `(lo - hi)//2`, we might get a wrong number because we're taking one number away from the other, instead of finding the point in between them.
