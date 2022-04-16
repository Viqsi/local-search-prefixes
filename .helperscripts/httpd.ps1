# Simple Powershell script for local-search-prefixes via Python
# Adapted from https://superuser.com/a/1120113/861318

# Create the .NET objects
$psi = New-Object System.Diagnostics.ProcessStartInfo
$newproc = New-Object System.Diagnostics.Process
# Basic stuff, process name and arguments
$psi.FileName = 'C:\Windows\py.exe'
$psi.Arguments = '-m http.server 1123'
# Hide any window it might try to create
$psi.CreateNoWindow = $true
$psi.WindowStyle = 'Hidden'
# Set up and start the process
$newproc.StartInfo = $psi
$newproc.Start()
# Return the process object to the caller
$newproc
