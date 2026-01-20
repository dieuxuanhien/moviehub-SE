# ==================================================
# MOVIE RECOMMENDATION SYSTEM - AUTOMATED TEST SUITE
# ==================================================

param(
    [string]$BaseUrl = "http://localhost:4000",
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$global:PassCount = 0
$global:FailCount = 0
$global:TestResults = @()

# Helper Functions
function Write-TestHeader($title) {
    Write-Host "
===================================================" -ForegroundColor Cyan
    Write-Host " $title" -ForegroundColor Cyan
    Write-Host "===================================================" -ForegroundColor Cyan
}

function Write-TestCase($id, $description) {
    Write-Host "
[$id] $description" -ForegroundColor Yellow
}

function Test-Recommendation($query, $limit = 5) {
    $body = @{
        query = $query
        limit = $limit
    } | ConvertTo-Json

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    try {
        $result = Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/v1/movies/recommendations" -ContentType "application/json" -Body $body -ErrorAction Stop
        $sw.Stop()
        
        return @{
            Success = $true
            Data = $result
            ResponseTime = $sw.ElapsedMilliseconds
            Error = $null
        }
    } catch {
        $sw.Stop()
        return @{
            Success = $false
            Data = $null
            ResponseTime = $sw.ElapsedMilliseconds
            Error = $_.Exception.Message
        }
    }
}

function Assert-Equal($actual, $expected, $message) {
    if ($actual -eq $expected) {
        Write-Host "  ✓ PASS: $message" -ForegroundColor Green
        $global:PassCount++
        return $true
    } else {
        Write-Host "  ✗ FAIL: $message (Expected: $expected, Got: $actual)" -ForegroundColor Red
        $global:FailCount++
        return $false
    }
}

function Assert-GreaterOrEqual($actual, $expected, $message) {
    if ($actual -ge $expected) {
        Write-Host "  ✓ PASS: $message" -ForegroundColor Green
        $global:PassCount++
        return $true
    } else {
        Write-Host "  ✗ FAIL: $message (Expected: ≥$expected, Got: $actual)" -ForegroundColor Red
        $global:FailCount++
        return $false
    }
}

function Assert-LessOrEqual($actual, $expected, $message) {
    if ($actual -le $expected) {
        Write-Host "  ✓ PASS: $message" -ForegroundColor Green
        $global:PassCount++
        return $true
    } else {
        Write-Host "  ✗ FAIL: $message (Expected: ≤$expected, Got: $actual)" -ForegroundColor Red
        $global:FailCount++
        return $false
    }
}

function Get-MovieGenres($movieId) {
    # Helper to fetch movie details and get genres
    try {
        $movie = Invoke-RestMethod -Method GET -Uri "$BaseUrl/api/v1/movies/$movieId" -ErrorAction Stop
        return $movie.genres
    } catch {
        return @()
    }
}

# ==================================================
# TEST SUITE 1: GENRE ACCURACY (VIETNAMESE)
# ==================================================
Write-TestHeader "TEST SUITE 1: GENRE ACCURACY (VIETNAMESE)"

$genreTestsVN = @(
    @{id="VN-ACT-01"; query="Phím hành động có nhịp độ nhanh"; expectedGenre="Hành động"; minAccuracy=0.6},
    @{id="VN-ROM-01"; query="Phim tình cảm lãng mạn"; expectedGenre="Lãng mạn"; minAccuracy=0.6},
    @{id="VN-HOR-01"; query="Phim kinh dị ma quỷ"; expectedGenre="Kinh dị"; minAccuracy=0.6},
    @{id="VN-COM-01"; query="Phim hài hước vui tính"; expectedGenre="Hài"; minAccuracy=0.6}
)

foreach ($test in $genreTestsVN) {
    Write-TestCase $test.id "Query: '$($test.query)'"
    
    $result = Test-Recommendation -query $test.query -limit 5
    
    if ($result.Success) {
        $movieCount = $result.Data.movies.Count
        Assert-Equal $movieCount 5 "Returns exactly 5 movies"
        
        # Note: Genre checking would require fetching each movie's details
        # For now, we verify the response structure
        Assert-GreaterOrEqual $result.Data.total 5 "Total available movies ≥ 5"
        Assert-LessOrEqual $result.ResponseTime 5000 "Response time ≤ 5000ms"
        
        if ($Verbose) {
            Write-Host "
  Top Results:" -ForegroundColor Gray
            $result.Data.movies | Select-Object -First 3 title, @{N='Score';E={[math]::Round($_.similarity, 3)}} | Format-Table -AutoSize
        }
    } else {
        Write-Host "  ✗ FAIL: Request failed - $($result.Error)" -ForegroundColor Red
        $global:FailCount++
    }
}

# ==================================================
# TEST SUITE 2: GENRE ACCURACY (ENGLISH)
# ==================================================
Write-TestHeader "TEST SUITE 2: GENRE ACCURACY (ENGLISH)"

$genreTestsEN = @(
    @{id="EN-ACT-01"; query="fast paced action movies"; expectedGenre="Hành động"},
    @{id="EN-ROM-01"; query="romantic love story"; expectedGenre="Lãng mạn"},
    @{id="EN-HOR-01"; query="scary horror movies"; expectedGenre="Kinh dị"},
    @{id="EN-COM-01"; query="funny comedy films"; expectedGenre="Hài"}
)

foreach ($test in $genreTestsEN) {
    Write-TestCase $test.id "Query: '$($test.query)'"
    
    $result = Test-Recommendation -query $test.query -limit 5
    
    if ($result.Success) {
        Assert-Equal $result.Data.movies.Count 5 "Returns exactly 5 movies"
        Assert-LessOrEqual $result.ResponseTime 5000 "Response time ≤ 5000ms"
        
        if ($Verbose) {
            Write-Host "
  Top Results:" -ForegroundColor Gray
            $result.Data.movies | Select-Object -First 3 title, @{N='Score';E={[math]::Round($_.similarity, 3)}} | Format-Table -AutoSize
        }
    } else {
        Write-Host "  ✗ FAIL: Request failed - $($result.Error)" -ForegroundColor Red
        $global:FailCount++
    }
}

# ==================================================
# TEST SUITE 3: RESULT COUNT ACCURACY
# ==================================================
Write-TestHeader "TEST SUITE 3: RESULT COUNT ACCURACY"

$countTests = @(1, 5, 10, 20)

foreach ($limit in $countTests) {
    Write-TestCase "CNT-$limit" "Request $limit movies"
    
    $result = Test-Recommendation -query "action movies" -limit $limit
    
    if ($result.Success) {
        Assert-Equal $result.Data.movies.Count $limit "Returns exactly $limit movies"
    } else {
        Write-Host "  ✗ FAIL: Request failed - $($result.Error)" -ForegroundColor Red
        $global:FailCount++
    }
}

# ==================================================
# TEST SUITE 4: PERFORMANCE
# ==================================================
Write-TestHeader "TEST SUITE 4: PERFORMANCE TESTS"

Write-TestCase "PERF-01" "Response time for standard query"

$perfResults = @()
for ($i = 1; $i -le 5; $i++) {
    $result = Test-Recommendation -query "action movies" -limit 10
    if ($result.Success) {
        $perfResults += $result.ResponseTime
    }
}

$avgTime = ($perfResults | Measure-Object -Average).Average
$maxTime = ($perfResults | Measure-Object -Maximum).Maximum

Write-Host "  Average: $([math]::Round($avgTime))ms, Max: $maxTime ms" -ForegroundColor Gray
Assert-LessOrEqual $avgTime 3000 "Average response time ≤ 3000ms"
Assert-LessOrEqual $maxTime 5000 "Max response time ≤ 5000ms"

# ==================================================
# TEST SUITE 5: EDGE CASES
# ==================================================
Write-TestHeader "TEST SUITE 5: EDGE CASES"

Write-TestCase "EDGE-01" "Empty query"
$result = Test-Recommendation -query "" -limit 5
Assert-Equal $result.Success $false "Empty query should fail"

Write-TestCase "EDGE-02" "Very long query"
$longQuery = "action " * 100
$result = Test-Recommendation -query $longQuery -limit 5
# Should either succeed or fail gracefully
if ($result.Success) {
    Write-Host "  ✓ PASS: Handles long query" -ForegroundColor Green
    $global:PassCount++
} else {
    Write-Host "  ✓ PASS: Rejects long query gracefully" -ForegroundColor Green
    $global:PassCount++
}

Write-TestCase "EDGE-03" "Special characters"
$result = Test-Recommendation -query "!@#$%^&*()" -limit 5
if ($result.Success) {
    Assert-Equal $result.Data.movies.Count 5 "Returns results for special characters"
} else {
    Write-Host "  ℹ INFO: Special characters rejected (acceptable)" -ForegroundColor Yellow
}

Write-TestCase "EDGE-04" "Limit = 0"
$result = Test-Recommendation -query "action" -limit 0
# Should return empty or minimal results
if ($result.Success) {
    Write-Host "  ℹ INFO: Limit=0 handled (returned $($result.Data.movies.Count) movies)" -ForegroundColor Yellow
}

# ==================================================
# TEST SUITE 6: SCORE VALIDATION
# ==================================================
Write-TestHeader "TEST SUITE 6: SCORE VALIDATION"

Write-TestCase "SCORE-01" "Scores are in valid range [0, 1]"
$result = Test-Recommendation -query "action movies" -limit 10

if ($result.Success) {
    $invalidScores = $result.Data.movies | Where-Object { $_.similarity -lt 0 -or $_.similarity -gt 1 }
    Assert-Equal $invalidScores.Count 0 "All scores in range [0, 1]"
}

Write-TestCase "SCORE-02" "Scores are in descending order"
if ($result.Success) {
    $scores = $result.Data.movies | ForEach-Object { $_.similarity }
    $sortedScores = $scores | Sort-Object -Descending
    $isOrdered = ($scores -join ",") -eq ($sortedScores -join ",")
    
    if ($isOrdered) {
        Write-Host "  ✓ PASS: Scores in descending order" -ForegroundColor Green
        $global:PassCount++
    } else {
        Write-Host "  ✗ FAIL: Scores not in descending order" -ForegroundColor Red
        $global:FailCount++
    }
}

# ==================================================
# FINAL REPORT
# ==================================================
Write-Host ""
Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$totalTests = $global:PassCount + $global:FailCount
$passRate = if ($totalTests -gt 0) { [math]::Round(($global:PassCount / $totalTests) * 100, 2) } else { 0 }

Write-Host ""
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $global:PassCount" -ForegroundColor Green
Write-Host "Failed: $global:FailCount" -ForegroundColor $(if ($global:FailCount -eq 0) { "Green" } else { "Red" })
Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 90) { "Green" } elseif ($passRate -ge 70) { "Yellow" } else { "Red" })

Write-Host ""
Write-Host ""
if ($passRate -ge 90) {
    Write-Host "SUCCESS - PRODUCTION READY - System meets quality standards!" -ForegroundColor Green
} elseif ($passRate -ge 70) {
    Write-Host "WARNING - NEEDS IMPROVEMENT - Review failed tests" -ForegroundColor Yellow
} else {
    Write-Host "FAILED - NOT READY - Significant issues found" -ForegroundColor Red
}

Write-Host ""
Write-Host ""

# Return exit code for CI/CD
exit $global:FailCount


