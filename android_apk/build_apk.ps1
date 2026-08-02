$ErrorActionPreference = "Stop"

$sdkPath = "C:\Users\Amaan\AppData\Local\Android\Sdk"
$buildToolsVersion = "33.0.0"
$platformVersion = "android-33"

$aapt = "$sdkPath\build-tools\$buildToolsVersion\aapt.exe"
$d8Jar = "$sdkPath\build-tools\$buildToolsVersion\lib\d8.jar"
$apksigner = "$sdkPath\build-tools\$buildToolsVersion\apksigner.bat"
$zipalign = "$sdkPath\build-tools\$buildToolsVersion\zipalign.exe"
$androidJar = "$sdkPath\platforms\$platformVersion\android.jar"

$projectDir = Get-Location
Write-Host "Project Directory: $projectDir"

# Clean build directory
$buildDir = "$projectDir\build_out"
if (Test-Path $buildDir) {
    Remove-Item -Recurse -Force $buildDir
}

New-Item -ItemType Directory -Path "$buildDir\src" | Out-Null
New-Item -ItemType Directory -Path "$buildDir\obj" | Out-Null
New-Item -ItemType Directory -Path "$buildDir\dex" | Out-Null

Write-Host "[1/6] Running AAPT resource generation..."
& $aapt package -f -m -J "$buildDir\src" -M "$projectDir\app\src\main\AndroidManifest.xml" -S "$projectDir\app\src\main\res" -I $androidJar

Write-Host "[2/6] Compiling Java source files..."
$javaFiles = @(Get-ChildItem -Recurse "$projectDir\app\src\main\java" -Filter "*.java" | Select-Object -ExpandProperty FullName)
$generatedJava = @(Get-ChildItem -Recurse "$buildDir\src" -Filter "*.java" | Select-Object -ExpandProperty FullName)
$allSources = $javaFiles + $generatedJava

& javac -d "$buildDir\obj" -classpath $androidJar -source 1.8 -target 1.8 $allSources

Write-Host "[3/6] Converting bytecode to DEX format..."
$classFiles = @(Get-ChildItem -Recurse "$buildDir\obj" -Filter "*.class" | Select-Object -ExpandProperty FullName)
& java -cp $d8Jar com.android.tools.r8.D8 --min-api 24 --output "$buildDir\dex" $classFiles

Write-Host "[4/6] Packaging APK resources..."
$unalignedApk = "$buildDir\unaligned.apk"
& $aapt package -f -M "$projectDir\app\src\main\AndroidManifest.xml" -S "$projectDir\app\src\main\res" -I $androidJar -F $unalignedApk

Write-Host "[5/6] Adding classes.dex to APK..."
Set-Location "$buildDir\dex"
& $aapt add $unalignedApk "classes.dex"
Set-Location $projectDir

Write-Host "[6/6] Aligning & Signing APK..."
$alignedApk = "$buildDir\aligned.apk"
& $zipalign -f 4 $unalignedApk $alignedApk

$keystore = "$buildDir\debug.keystore"
& keytool -genkeypair -v -keystore $keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=CampusPro,O=CampusPro ERP,C=IN"

$outputApk = "$projectDir\CampusPro_College_ERP.apk"
& $apksigner sign --ks $keystore --ks-pass pass:android --out $outputApk $alignedApk

Write-Host "======================================================="
Write-Host "SUCCESS! Valid Android APK generated at:"
Write-Host "$outputApk"
$apkSize = (Get-Item $outputApk).Length
Write-Host "APK Size: $([math]::Round($apkSize / 1KB, 2)) KB"
Write-Host "======================================================="
