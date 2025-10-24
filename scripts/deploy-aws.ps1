param(
  [string]$Region = $env:AWS_REGION,
  [string]$Bucket = $env:S3_BUCKET,
  [string]$DistributionId = $env:CLOUDFRONT_DISTRIBUTION_ID
)

if (-not $Bucket) { Write-Error "S3 bucket name is required. Set S3_BUCKET env var or pass -Bucket"; exit 1 }
if (-not $Region) { $Region = "us-east-1" }

Push-Location $PSScriptRoot\.. | Out-Null

Write-Host "Installing deps..."
npm ci

Write-Host "Building Angular app..."
npm run build

$browserPath = Join-Path (Get-Location) 'dist/omni-scholar-app/browser'
if (-not (Test-Path $browserPath)) {
  Write-Error "Browser build not found at $browserPath"
  Pop-Location | Out-Null
  exit 1
}

Write-Host "Syncing assets to s3://$Bucket ..."
aws s3 sync $browserPath s3://$Bucket --delete --cache-control "max-age=31536000,public" --exclude index.html

Write-Host "Uploading index.html with no-cache..."
aws s3 cp (Join-Path $browserPath 'index.html') s3://$Bucket/index.html --cache-control "no-cache,public" --content-type "text/html"

if ($DistributionId) {
  Write-Host "Creating CloudFront invalidation..."
  aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/index.html" "/assets/*" "/"
}

Pop-Location | Out-Null
Write-Host "Deploy complete."
