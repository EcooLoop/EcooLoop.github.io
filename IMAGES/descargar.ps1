$base = "C:\Users\LENOVO\Desktop\Hector Sotelo\IMAGES"

# Crear subcarpetas
@('slides','mujer','hombre','ninos','calzado','accesorios','vintage') | ForEach-Object {
  $p = Join-Path $base $_
  if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p | Out-Null }
}

$downloads = @(
  # Hero slides
  [pscustomobject]@{url="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=700&fit=crop&q=80"; file="slides\hero-1.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=700&fit=crop&q=80"; file="slides\hero-2.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=700&fit=crop&q=80"; file="slides\hero-3.jpg"},
  # Mujer
  [pscustomobject]@{url="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop&q=80"; file="mujer\mujer-1.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&h=1000&fit=crop&q=80"; file="mujer\mujer-2.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&q=80"; file="mujer\mujer-3.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop&q=80"; file="mujer\mujer-4.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=1000&fit=crop&q=80"; file="mujer\mujer-5.jpg"},
  # Hombre
  [pscustomobject]@{url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&q=80"; file="hombre\hombre-1.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=1000&fit=crop&q=80"; file="hombre\hombre-2.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=80"; file="hombre\hombre-3.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop&q=80"; file="hombre\hombre-4.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=1000&fit=crop&q=80"; file="hombre\hombre-5.jpg"},
  # Ninos
  [pscustomobject]@{url="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1000&fit=crop&q=80"; file="ninos\ninos-1.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=1000&fit=crop&q=80"; file="ninos\ninos-2.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&h=1000&fit=crop&q=80"; file="ninos\ninos-3.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=800&h=1000&fit=crop&q=80"; file="ninos\ninos-4.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1476234251651-f353703a034d?w=800&h=1000&fit=crop&q=80"; file="ninos\ninos-5.jpg"},
  # Calzado
  [pscustomobject]@{url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop&q=80"; file="calzado\calzado-1.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop&q=80"; file="calzado\calzado-2.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=1000&fit=crop&q=80"; file="calzado\calzado-3.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop&q=80"; file="calzado\calzado-4.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=1000&fit=crop&q=80"; file="calzado\calzado-5.jpg"},
  # Accesorios
  [pscustomobject]@{url="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1000&fit=crop&q=80"; file="accesorios\acc-1.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=1000&fit=crop&q=80"; file="accesorios\acc-2.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop&q=80"; file="accesorios\acc-3.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=1000&fit=crop&q=80"; file="accesorios\acc-4.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&h=1000&fit=crop&q=80"; file="accesorios\acc-5.jpg"},
  # Vintage
  [pscustomobject]@{url="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop&q=80"; file="vintage\vintage-1.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=1000&fit=crop&q=80"; file="vintage\vintage-2.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=1000&fit=crop&q=80"; file="vintage\vintage-3.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&h=1000&fit=crop&q=80"; file="vintage\vintage-4.jpg"},
  [pscustomobject]@{url="https://images.unsplash.com/photo-1462395216809-e71b5327cf0e?w=800&h=1000&fit=crop&q=80"; file="vintage\vintage-5.jpg"}
)

$ok = 0; $fail = 0
foreach ($d in $downloads) {
  $dest = Join-Path $base $d.file
  try {
    Invoke-WebRequest -Uri $d.url -OutFile $dest -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop
    Write-Host "OK  $($d.file)"
    $ok++
  } catch {
    Write-Host "FAIL $($d.file) => $_"
    $fail++
  }
}
Write-Host ""
Write-Host "==> $ok descargadas, $fail fallidas"
