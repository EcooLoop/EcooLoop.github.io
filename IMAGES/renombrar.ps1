$base = "C:\Users\LENOVO\Desktop\HS\IMAGES"

$items = @(
  @{ from = "WhatsApp Image 2026-05-31 at 4.54.11 PM.jpeg"; to = "proceso-1.jpg" },
  @{ from = "WhatsApp Image 2026-05-31 at 5.16.17 PM.jpeg"; to = "proceso-2.jpg" },
  @{ from = "WhatsApp Image 2026-05-31 at 5.20.45 PM.jpeg"; to = "proceso-3.jpg" },
  @{ from = "SnapVid.Net_7590175734077934868.mp4";           to = "video-ecoloop.mp4" }
)

foreach ($item in $items) {
  $src = Join-Path $base $item.from
  $dst = Join-Path $base $item.to
  if (Test-Path $src) {
    Rename-Item $src $dst
    Write-Host "OK: $($item.to)"
  } elseif (Test-Path $dst) {
    Write-Host "Ya existe: $($item.to)"
  } else {
    Write-Host "No encontrado: $($item.from)"
  }
}

Write-Host ""
Write-Host "Archivos en IMAGES:"
Get-ChildItem $base -File | Select-Object -ExpandProperty Name
