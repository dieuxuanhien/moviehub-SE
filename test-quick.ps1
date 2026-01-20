# Automated Test Suite for Movie Recommendations
$BaseUrl = "http://localhost:4000"
$Pass = 0
$Fail = 0

Write-Host "=== RECOMMENDATION TEST SUITE ===" -ForegroundColor Cyan

# Test 1: Vietnamese Action
Write-Host ""
Write-Host "[TEST 1] Vietnamese Action Query" -ForegroundColor Yellow
$body = @{query="Phim hành động có nhịp độ nhanh"; limit=5} | ConvertTo-Json
$r = Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/v1/movies/recommendations" -ContentType "application/json" -Body $body
if ($r.movies.Count -eq 5) { Write-Host "  PASS: Count = 5" -ForegroundColor Green; $Pass++ } else { Write-Host "  FAIL: Count = $($r.movies.Count)" -ForegroundColor Red; $Fail++ }
$r.movies | Select -First 3 title,@{N="Score";E={[math]::Round($_.similarity,3)}} | ft -Auto

# Test 2: English Action  
Write-Host "[TEST 2] English Action Query" -ForegroundColor Yellow
$body = @{query="fast paced action movies"; limit=5} | ConvertTo-Json
$r = Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/v1/movies/recommendations" -ContentType "application/json" -Body $body
if ($r.movies.Count -eq 5) { Write-Host "  PASS: Count = 5" -ForegroundColor Green; $Pass++ } else { Write-Host "  FAIL: Count = $($r.movies.Count)" -ForegroundColor Red; $Fail++ }

# Test 3: Result Counts
Write-Host ""
Write-Host "[TEST 3] Result Count Tests" -ForegroundColor Yellow
foreach ($limit in @(1,5,10)) {
    $body = @{query="action"; limit=$limit} | ConvertTo-Json
    $r = Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/v1/movies/recommendations" -ContentType "application/json" -Body $body
    if ($r.movies.Count -eq $limit) { Write-Host "  PASS: Limit=$limit returns $limit" -ForegroundColor Green; $Pass++ } else { Write-Host "  FAIL: Limit=$limit returns $($r.movies.Count)" -ForegroundColor Red; $Fail++ }
}

# Results
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
$Total = $Pass + $Fail
$Rate = [math]::Round(($Pass/$Total)*100,0)
Write-Host "Passed: $Pass/$Total ($Rate%)" -ForegroundColor $(if($Rate -ge 90){"Green"}else{"Red"})
Write-Host "==================================" -ForegroundColor Cyan
