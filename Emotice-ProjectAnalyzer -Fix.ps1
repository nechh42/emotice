# ================================================================
# EMOTICE PROJECT ANALYZER & FIXER
# Proje yapısını tarar, hataları bulur ve düzeltir
# ================================================================

param(
    [string]$ProjectPath = ".",
    [switch]$Fix = $false,
    [switch]$Verbose = $false
)

# Ana değişkenler
$ErrorActionPreference = "SilentlyContinue"
$Global:Issues = @()
$Global:FixedIssues = @()

# Renk kodları
$Colors = @{
    Success = "Green"
    Warning = "Yellow" 
    Error = "Red"
    Info = "Cyan"
    Header = "Magenta"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Colors[$Color]
}

function Add-Issue {
    param(
        [string]$Type,
        [string]$File,
        [string]$Message,
        [string]$Severity = "Warning"
    )
    
    $Global:Issues += [PSCustomObject]@{
        Type = $Type
        File = $File
        Message = $Message
        Severity = $Severity
        Fixed = $false
    }
}

# 1. PROJE YAPISINI KONTROL ET
function Test-ProjectStructure {
    Write-ColorOutput "`n🏗️  PROJE YAPISI KONTROLÜ" "Header"
    
    $expectedFolders = @(
        "src",
        "src/components",
        "src/components/mood",
        "src/components/habits", 
        "src/components/goals",
        "src/components/time",
        "src/components/motivation",
        "src/pages",
        "src/pages/Dashboard",
        "src/services",
        "src/contexts",
        "src/data",
        "src/data/motivation",
        "public",
        "docs"
    )
    
    $expectedFiles = @(
        "package.json",
        "vite.config.js",
        "tailwind.config.js",
        "index.html",
        "src/main.jsx",
        "src/App.jsx",
        ".gitignore",
        "README.md"
    )
    
    # Klasör kontrolü
    foreach ($folder in $expectedFolders) {
        $fullPath = Join-Path $ProjectPath $folder
        if (-not (Test-Path $fullPath)) {
            Add-Issue "Structure" $folder "Eksik klasör" "Error"
            if ($Fix) {
                New-Item -Path $fullPath -ItemType Directory -Force | Out-Null
                Write-ColorOutput "✅ Oluşturuldu: $folder" "Success"
                $Global:FixedIssues += "Klasör oluşturuldu: $folder"
            }
        } else {
            Write-ColorOutput "✅ $folder" "Success"
        }
    }
    
    # Dosya kontrolü
    foreach ($file in $expectedFiles) {
        $fullPath = Join-Path $ProjectPath $file
        if (-not (Test-Path $fullPath)) {
            Add-Issue "Structure" $file "Eksik dosya" "Error"
        } else {
            Write-ColorOutput "✅ $file" "Success"
        }
    }
}

# 2. COMPONENT DOSYALARINI KONTROL ET
function Test-Components {
    Write-ColorOutput "`n🧩 COMPONENT KONTROLLERI" "Header"
    
    $requiredComponents = @{
        "src/components/motivation/MotivationBot.jsx" = "Motivasyon robotu"
        "src/components/mood/MoodTracker.jsx" = "Ruh hali takibi"
        "src/components/mood/MoodHistory.jsx" = "Ruh hali geçmişi"
        "src/components/habits/HabitTracker.jsx" = "Alışkanlık takibi"
        "src/components/goals/GoalSetting.jsx" = "Hedef belirleme"
        "src/components/time/TimeBlocking.jsx" = "Zaman yönetimi"
        "src/pages/Dashboard/Dashboard.jsx" = "Ana sayfa"
        "src/data/motivation/messages.js" = "Motivasyon mesajları"
    }
    
    foreach ($component in $requiredComponents.GetEnumerator()) {
        $fullPath = Join-Path $ProjectPath $component.Key
        if (Test-Path $fullPath) {
            Write-ColorOutput "✅ $($component.Value)" "Success"
            
            # İçerik kontrolü
            $content = Get-Content $fullPath -Raw -Encoding UTF8
            
            # React import kontrolü
            if ($component.Key -like "*.jsx" -and $content -notmatch "import React") {
                Add-Issue "Component" $component.Key "React import eksik" "Error"
            }
            
            # Export kontrolü
            if ($component.Key -like "*.jsx" -and $content -notmatch "export default") {
                Add-Issue "Component" $component.Key "Default export eksik" "Error"
            }
            
            # PropTypes veya TypeScript kontrolü (opsiyonel)
            if ($Verbose -and $component.Key -like "*.jsx" -and $content -notmatch "PropTypes|interface.*Props") {
                Add-Issue "Quality" $component.Key "PropTypes veya TypeScript tanımı yok" "Warning"
            }
            
        } else {
            Add-Issue "Component" $component.Key "Eksik component: $($component.Value)" "Error"
            Write-ColorOutput "❌ $($component.Value)" "Error"
        }
    }
}

# 3. PACKAGE.JSON VE DEPENDENCIES
function Test-Dependencies {
    Write-ColorOutput "`n📦 DEPENDENCY KONTROLLERI" "Header"
    
    $packageJsonPath = Join-Path $ProjectPath "package.json"
    
    if (-not (Test-Path $packageJsonPath)) {
        Add-Issue "Dependencies" "package.json" "package.json bulunamadı" "Error"
        return
    }
    
    try {
        $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
        
        $requiredDeps = @(
            "react",
            "react-dom", 
            "react-router-dom",
            "lucide-react",
            "react-toastify",
            "@vitejs/plugin-react",
            "vite",
            "tailwindcss"
        )
        
        $allDeps = @{}
        if ($packageJson.dependencies) { $packageJson.dependencies.PSObject.Properties | ForEach-Object { $allDeps[$_.Name] = $_.Value } }
        if ($packageJson.devDependencies) { $packageJson.devDependencies.PSObject.Properties | ForEach-Object { $allDeps[$_.Name] = $_.Value } }
        
        foreach ($dep in $requiredDeps) {
            if ($allDeps.ContainsKey($dep)) {
                Write-ColorOutput "✅ $dep" "Success"
            } else {
                Add-Issue "Dependencies" "package.json" "Eksik dependency: $dep" "Error"
                Write-ColorOutput "❌ $dep" "Error"
            }
        }
        
        # Kullanılmayan dependencies (basit kontrol)
        $srcPath = Join-Path $ProjectPath "src"
        if (Test-Path $srcPath) {
            $allFiles = Get-ChildItem -Path $srcPath -Recurse -Filter "*.jsx" -File
            $importedModules = @()
            
            foreach ($file in $allFiles) {
                $content = Get-Content $file.FullName -Raw
                $imports = [regex]::Matches($content, "import.*?from\s+[`"']([^`"']+)[`"']") | ForEach-Object { $_.Groups[1].Value }
                $importedModules += $imports | Where-Object { $_ -notmatch "^\.|^/" }
            }
            
            $usedDeps = $importedModules | Sort-Object -Unique | Where-Object { $allDeps.ContainsKey($_) }
            $unusedDeps = $allDeps.Keys | Where-Object { $_ -notin $usedDeps -and $_ -notin @("vite", "@vitejs/plugin-react", "tailwindcss", "postcss", "autoprefixer") }
            
            foreach ($unused in $unusedDeps) {
                if ($Verbose) {
                    Add-Issue "Quality" "package.json" "Potansiyel kullanılmayan dependency: $unused" "Warning"
                }
            }
        }
        
    } catch {
        Add-Issue "Dependencies" "package.json" "package.json parse edilemedi: $($_.Exception.Message)" "Error"
    }
}

# 4. IMPORT/EXPORT TUTARLILIK KONTROLÜ
function Test-ImportExports {
    Write-ColorOutput "`n🔗 IMPORT/EXPORT KONTROLLERI" "Header"
    
    $srcPath = Join-Path $ProjectPath "src"
    if (-not (Test-Path $srcPath)) {
        Add-Issue "Imports" "src" "src klasörü bulunamadı" "Error"
        return
    }
    
    $jsxFiles = Get-ChildItem -Path $srcPath -Recurse -Filter "*.jsx" -File
    $jsFiles = Get-ChildItem -Path $srcPath -Recurse -Filter "*.js" -File
    $allFiles = $jsxFiles + $jsFiles
    
    foreach ($file in $allFiles) {
        $relativePath = $file.FullName.Replace($ProjectPath, "").TrimStart("\", "/")
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Relatif import kontrolü
        $relativeImports = [regex]::Matches($content, "import.*?from\s+[`"'](\.|\.\.)[^`"']*[`"']") | ForEach-Object { $_.Groups[1].Value }
        
        foreach ($import in $relativeImports) {
            $importPath = $import -replace "[`"']", ""
            $resolvedPath = Resolve-Path -Path (Join-Path (Split-Path $file.FullName) $importPath) -ErrorAction SilentlyContinue
            
            if (-not $resolvedPath -or -not (Test-Path $resolvedPath)) {
                Add-Issue "Imports" $relativePath "Kırık relatif import: $importPath" "Error"
            }
        }
        
        # Context/Hook importları kontrolü
        $contextImports = [regex]::Matches($content, "import.*?{([^}]*)}.*?from\s+[`"'].*?contexts?/([^`"']+)[`"']") 
        $hookImports = [regex]::Matches($content, "import.*?{([^}]*)}.*?from\s+[`"'].*?hooks?/([^`"']+)[`"']")
        
        # useAuth kontrolü
        if ($content -match "useAuth" -and $content -notmatch "import.*?useAuth.*?from") {
            Add-Issue "Imports" $relativePath "useAuth kullanılıyor ama import edilmemiş" "Error"
        }
        
        # toast kontrolü  
        if ($content -match "toast\." -and $content -notmatch "import.*?toast.*?from.*?react-toastify") {
            Add-Issue "Imports" $relativePath "toast kullanılıyor ama react-toastify import edilmemiş" "Error"
        }
    }
}

# 5. ÇIFT DOSYA KONTROLÜ
function Test-DuplicateFiles {
    Write-ColorOutput "`n👥 ÇIFT DOSYA KONTROLÜ" "Header"
    
    $srcPath = Join-Path $ProjectPath "src"
    if (-not (Test-Path $srcPath)) { return }
    
    $allFiles = Get-ChildItem -Path $srcPath -Recurse -File | Where-Object { $_.Extension -in @(".jsx", ".js", ".ts", ".tsx") }
    $fileGroups = $allFiles | Group-Object Name
    
    foreach ($group in $fileGroups) {
        if ($group.Count -gt 1) {
            $files = $group.Group | ForEach-Object { $_.FullName.Replace($ProjectPath, "").TrimStart("\", "/") }
            Add-Issue "Duplicates" ($files -join ", ") "Aynı isimde birden fazla dosya: $($group.Name)" "Warning"
            Write-ColorOutput "⚠️  Çift dosya: $($group.Name)" "Warning"
            Write-ColorOutput "   Konumlar: $($files -join ', ')" "Info"
        }
    }
}

# 6. ESLint/PRETTIER KONFIGÜRASYONU
function Test-CodeQuality {
    Write-ColorOutput "`n🎨 KOD KALİTESİ KONTROLLERI" "Header"
    
    $configs = @{
        ".eslintrc.js" = "ESLint konfigürasyonu"
        ".eslintrc.json" = "ESLint konfigürasyonu" 
        ".prettierrc" = "Prettier konfigürasyonu"
        ".prettierrc.json" = "Prettier konfigürasyonu"
        "tailwind.config.js" = "Tailwind konfigürasyonu"
        "vite.config.js" = "Vite konfigürasyonu"
    }
    
    foreach ($config in $configs.GetEnumerator()) {
        $configPath = Join-Path $ProjectPath $config.Key
        if (Test-Path $configPath) {
            Write-ColorOutput "✅ $($config.Value)" "Success"
        } else {
            Add-Issue "Quality" $config.Key "$($config.Value) bulunamadı" "Warning"
        }
    }
    
    # .gitignore kontrolü
    $gitignorePath = Join-Path $ProjectPath ".gitignore"
    if (Test-Path $gitignorePath) {
        $gitignoreContent = Get-Content $gitignorePath -Raw
        $requiredIgnores = @("node_modules", "dist", "build", ".env")
        
        foreach ($ignore in $requiredIgnores) {
            if ($gitignoreContent -notmatch [regex]::Escape($ignore)) {
                Add-Issue "Quality" ".gitignore" "Eksik ignore pattern: $ignore" "Warning"
            }
        }
    }
}

# 7. ENV DOSYASI KONTROLÜ
function Test-Environment {
    Write-ColorOutput "`n🌍 ENVIRONMENT KONTROLLERI" "Header"
    
    $envExample = Join-Path $ProjectPath ".env.example"
    $envLocal = Join-Path $ProjectPath ".env"
    
    if (Test-Path $envExample) {
        Write-ColorOutput "✅ .env.example mevcut" "Success"
    } else {
        Add-Issue "Environment" ".env.example" ".env.example dosyası bulunamadı" "Warning"
    }
    
    if (Test-Path $envLocal) {
        Write-ColorOutput "✅ .env dosyası mevcut" "Success"
        
        # .env dosyasının .gitignore'da olup olmadığını kontrol et
        $gitignorePath = Join-Path $ProjectPath ".gitignore"
        if (Test-Path $gitignorePath) {
            $gitignoreContent = Get-Content $gitignorePath -Raw
            if ($gitignoreContent -notmatch "\.env") {
                Add-Issue "Security" ".gitignore" ".env dosyası .gitignore'da değil!" "Error"
            }
        }
    } else {
        Add-Issue "Environment" ".env" ".env dosyası bulunamadı (gerekli: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)" "Warning"
    }
}

# 8. PERFORMANCE VE GÜVENLIK KONTROLLERI
function Test-Security {
    Write-ColorOutput "`n🔒 GÜVENLİK KONTROLLERI" "Header"
    
    $srcPath = Join-Path $ProjectPath "src"
    if (-not (Test-Path $srcPath)) { return }
    
    $allFiles = Get-ChildItem -Path $srcPath -Recurse -Filter "*.jsx" -File
    
    foreach ($file in $allFiles) {
        $relativePath = $file.FullName.Replace($ProjectPath, "").TrimStart("\", "/")
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Güvenlik açıkları
        if ($content -match "innerHTML\s*=") {
            Add-Issue "Security" $relativePath "innerHTML kullanımı - XSS riski" "Warning"
        }
        
        if ($content -match "eval\s*\(") {
            Add-Issue "Security" $relativePath "eval() kullanımı - güvenlik riski" "Error"
        }
        
        # API key'lerin hard-coded olması
        if ($content -match "(api[_-]?key|secret|token)\s*[:=]\s*[`"'][^`"']{20,}[`"']") {
            Add-Issue "Security" $relativePath "Hard-coded API key/secret tespit edildi" "Error"
        }
        
        # Console.log'lar (production için)
        $consoleMatches = [regex]::Matches($content, "console\.(log|warn|error|debug)")
        if ($consoleMatches.Count -gt 5) {
            Add-Issue "Quality" $relativePath "Çok fazla console.log ($($consoleMatches.Count) adet)" "Warning"
        }
    }
}

# 9. RAPORLAMA
function Write-Report {
    Write-ColorOutput "`n📋 ANALİZ RAPORU" "Header"
    Write-ColorOutput "=" * 50 "Info"
    
    $errorCount = ($Global:Issues | Where-Object { $_.Severity -eq "Error" }).Count
    $warningCount = ($Global:Issues | Where-Object { $_.Severity -eq "Warning" }).Count
    
    Write-ColorOutput "Toplam Sorun: $($Global:Issues.Count)" "Info"
    Write-ColorOutput "Kritik Hatalar: $errorCount" "Error"
    Write-ColorOutput "Uyarılar: $warningCount" "Warning"
    
    if ($Global:FixedIssues.Count -gt 0) {
        Write-ColorOutput "Düzeltilen Sorunlar: $($Global:FixedIssues.Count)" "Success"
    }
    
    if ($Global:Issues.Count -eq 0) {
        Write-ColorOutput "`n🎉 TEBRIKLER! Hiçbir sorun bulunamadı." "Success"
        return
    }
    
    Write-ColorOutput "`n📝 DETAYLAR:" "Header"
    
    # Hataları gruplaya göre göster
    $groupedIssues = $Global:Issues | Group-Object Type
    
    foreach ($group in $groupedIssues) {
        Write-ColorOutput "`n$($group.Name) Sorunları:" "Info"
        foreach ($issue in $group.Group) {
            $symbol = if ($issue.Severity -eq "Error") { "❌" } else { "⚠️" }
            Write-ColorOutput "  $symbol $($issue.File): $($issue.Message)" $issue.Severity
        }
    }
    
    # Öneriler
    if ($errorCount -gt 0) {
        Write-ColorOutput "`n💡 ÖNERİLER:" "Header"
        Write-ColorOutput "1. Kritik hataları önce düzeltin" "Info"
        Write-ColorOutput "2. Eksik dosyaları oluşturun" "Info"
        Write-ColorOutput "3. -Fix parametresi ile otomatik düzeltme deneyin" "Info"
        Write-ColorOutput "4. Dependencies'leri npm install ile yükleyin" "Info"
    }
}

# 10. OTOMATIK DÜZELTME
function Invoke-AutoFix {
    if (-not $Fix) { return }
    
    Write-ColorOutput "`n🔧 OTOMATİK DÜZELTME MOD AKTİF" "Header"
    
    # .env.example oluştur
    $envExamplePath = Join-Path $ProjectPath ".env.example"
    if (-not (Test-Path $envExamplePath)) {
        $envContent = @"
# EMOTICE Environment Variables
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
"@
        Set-Content -Path $envExamplePath -Value $envContent -Encoding UTF8
        Write-ColorOutput "✅ .env.example oluşturuldu" "Success"
        $Global:FixedIssues += ".env.example oluşturuldu"
    }
    
    # .gitignore düzelt
    $gitignorePath = Join-Path $ProjectPath ".gitignore"
    if (Test-Path $gitignorePath) {
        $gitignoreContent = Get-Content $gitignorePath -Raw
        $requiredIgnores = @("node_modules", "dist", "build", ".env", ".env.local")
        $updated = $false
        
        foreach ($ignore in $requiredIgnores) {
            if ($gitignoreContent -notmatch [regex]::Escape($ignore)) {
                $gitignoreContent += "`n$ignore"
                $updated = $true
            }
        }
        
        if ($updated) {
            Set-Content -Path $gitignorePath -Value $gitignoreContent -Encoding UTF8
            Write-ColorOutput "✅ .gitignore güncellendi" "Success"
            $Global:FixedIssues += ".gitignore güncellendi"
        }
    }
}

# ANA FONKSİYON
function Start-Analysis {
    Write-ColorOutput "🚀 EMOTICE PROJECT ANALYZER" "Header"
    Write-ColorOutput "Proje Yolu: $ProjectPath" "Info"
    Write-ColorOutput "Düzeltme Modu: $(if ($Fix) {'AKTİF'} else {'PASİF'})" "Info"
    Write-ColorOutput "=" * 50 "Info"
    
    Test-ProjectStructure
    Test-Components  
    Test-Dependencies
    Test-ImportExports
    Test-DuplicateFiles
    Test-CodeQuality
    Test-Environment
    Test-Security
    
    Invoke-AutoFix
    Write-Report
    
    # Çıkış kodu
    $exitCode = if (($Global:Issues | Where-Object { $_.Severity -eq "Error" }).Count -gt 0) { 1 } else { 0 }
    exit $exitCode
}

# Script başlat
Start-Analysis