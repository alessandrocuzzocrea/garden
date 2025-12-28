---
title: Powershell script to Lunch Apple Music in Japanese (Windows)
permalink: /launch-apple-music-japanese-windows/
codeHighlighting: true
tags:
  - powershell
  - apple-music
  - windows
  - japanese
---

This script temporarily changes the Windows user language preference to Japanese to force Apple Music (which uses the system language) to launch in Japanese. It then reverts the language setting back to English. This is useful for accessing the Japanese library or features if your system is normally set to English.

```powershell
# Get current languages
$List = Get-WinUserLanguageList

try {
    # 1. Locate Japanese
    $Japanese = $List | Where-Object { $_.LanguageTag -like "ja*" }
    
    if ($null -eq $Japanese) {
        throw "Japanese language pack not found. Please install it in Windows Settings."
    }

    # 2. Set Japanese to #1 and apply
    $List.Remove($Japanese)
    $List.Insert(0, $Japanese)
    Set-WinUserLanguageList $List -Force
    
    Write-Host "Priority: Japanese. Launching Apple Music..." -ForegroundColor Green
    Start-Process "music://"
    
    # 3. Wait for the app to initialize (adjust seconds if needed)
    Start-Sleep -Seconds 8
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # 4. EXPLICIT REVERT: Always force English back to the top
    $FinalCheck = Get-WinUserLanguageList
    $English = $FinalCheck | Where-Object { $_.LanguageTag -like "en*" }

    if ($null -ne $English) {
        $FinalCheck.Remove($English)
        $FinalCheck.Insert(0, $English)
        Set-WinUserLanguageList $FinalCheck -Force
        Write-Host "Priority successfully reverted to English." -ForegroundColor Cyan
    } else {
        Write-Host "Warning: Could not find English pack to revert!" -ForegroundColor Yellow
    }
}
```
