$port = 8080
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host " ============================================"
Write-Host "  National Jobs Alert - Website Running"
Write-Host " ============================================"
Write-Host ""
Write-Host "  Open in browser: http://localhost:$port"
Write-Host ""
Write-Host "  Google Sheet is linked. Edit your sheet,"
Write-Host "  then press F5 in browser to see changes."
Write-Host ""
Write-Host "  Press Ctrl+C to stop."
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Start-Process "http://localhost:$port/index.html"

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.csv'  = 'text/csv; charset=utf-8'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.ico'  = 'image/x-icon'
  '.txt'  = 'text/plain; charset=utf-8'
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }

    $filePath = Join-Path $root ($path.TrimStart('/').Replace('/', [IO.Path]::DirectorySeparatorChar))

    if (Test-Path $filePath -PathType Leaf) {
      $bytes = [IO.File]::ReadAllBytes($filePath)
      $ext = [IO.Path]::GetExtension($filePath).ToLower()
      $response.ContentType = $mime[$ext]
      if (-not $response.ContentType) { $response.ContentType = 'application/octet-stream' }
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $msg = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $response.OutputStream.Write($msg, 0, $msg.Length)
    }

    $response.Close()
  }
} finally {
  $listener.Stop()
}
