param(
  [string]$Output = "jobpulse-safe.zip"
)

$ErrorActionPreference = "Stop"

$trackedEnv = git ls-files ".env*" 2>$null
if ($trackedEnv) {
  Write-Error "Refusing to create zip: tracked env file(s) found: $trackedEnv"
}

git archive --worktree-attributes --format=zip --output=$Output HEAD
Write-Host "Created $Output from tracked git files only."
