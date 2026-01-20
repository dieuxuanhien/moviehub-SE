# Test Recommendation Quality
Write-Host "`n========== RECOMMENDATION QUALITY TEST ==========`n" -ForegroundColor Cyan

# Wait for service to be ready
Start-Sleep -Seconds 3

# Test 1: Vietnamese Action Query
Write-Host "TEST 1: Vietnamese Action Query" -ForegroundColor Yellow
Write-Host "Query: 'Phim hành động có nhịp độ nhanh với những cảnh rượt đuổi gay cấn'`n" -ForegroundColor Gray

$body1 = @{
    query = "Phim hành động có nhịp độ nhanh với những cảnh rượt đuổi gay cấn"
    limit = 5
} | ConvertTo-Json

try {
    $result1 = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/v1/movies/recommendations" -ContentType "application/json" -Body $body1 -ErrorAction Stop
    
    Write-Host "✓ Results Count: $($result1.movies.Count)/5" -ForegroundColor $(if ($result1.movies.Count -eq 5) { "Green" } else { "Red" })
    Write-Host "✓ Total Available: $($result1.total)" -ForegroundColor Green
    Write-Host "`nTop Results:" -ForegroundColor White
    $result1.movies | Select-Object title, @{Name='Score';Expression={[math]::Round($_.similarity, 4)}} | Format-Table -AutoSize
} catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-------------------------------------------`n"

# Test 2: English Action Query
Write-Host "TEST 2: English Action Query" -ForegroundColor Yellow
Write-Host "Query: 'fast paced action movies with explosions'`n" -ForegroundColor Gray

$body2 = @{
    query = "fast paced action movies with explosions"
    limit = 5
} | ConvertTo-Json

try {
    $result2 = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/v1/movies/recommendations" -ContentType "application/json" -Body $body2 -ErrorAction Stop
    
    Write-Host "✓ Results Count: $($result2.movies.Count)/5" -ForegroundColor $(if ($result2.movies.Count -eq 5) { "Green" } else { "Red" })
    Write-Host "`nTop Results:" -ForegroundColor White
    $result2.movies | Select-Object title, @{Name='Score';Expression={[math]::Round($_.similarity, 4)}} | Format-Table -AutoSize
} catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-------------------------------------------`n"

# Test 3: Romance Query
Write-Host "TEST 3: Romance Query" -ForegroundColor Yellow
Write-Host "Query: 'romantic love story'`n" -ForegroundColor Gray

$body3 = @{
    query = "romantic love story"
    limit = 5
} | ConvertTo-Json

try {
    $result3 = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/v1/movies/recommendations" -ContentType "application/json" -Body $body3 -ErrorAction Stop
    
    Write-Host "✓ Results Count: $($result3.movies.Count)/5" -ForegroundColor $(if ($result3.movies.Count -eq 5) { "Green" } else { "Red" })
    Write-Host "`nTop Results:" -ForegroundColor White
    $result3.movies | Select-Object title, @{Name='Score';Expression={[math]::Round($_.similarity, 4)}} | Format-Table -AutoSize
} catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-------------------------------------------`n"

# Test 4: Horror Query
Write-Host "TEST 4: Horror Query (Vietnamese)" -ForegroundColor Yellow
Write-Host "Query: 'phim kinh dị ma quỷ'`n" -ForegroundColor Gray

$body4 = @{
    query = "phim kinh dị ma quỷ"
    limit = 5
} | ConvertTo-Json

try {
    $result4 = Invoke-RestMethod -Method POST -Uri "http://localhost:4000/api/v1/movies/recommendations" -ContentType "application/json" -Body $body4 -ErrorAction Stop
    
    Write-Host "✓ Results Count: $($result4.movies.Count)/5" -ForegroundColor $(if ($result4.movies.Count -eq 5) { "Green" } else { "Red" })
    Write-Host "`nTop Results:" -ForegroundColor White
    $result4.movies | Select-Object title, @{Name='Score';Expression={[math]::Round($_.similarity, 4)}} | Format-Table -AutoSize
} catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========== TEST COMPLETE ==========`n" -ForegroundColor Cyan
