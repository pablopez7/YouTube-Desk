; Custom NSIS installer script for YouTube Desktop
; This script ensures shortcuts are properly updated with the correct icon

!macro customInstall
  ; Delete old desktop shortcut to force recreation with new icon
  Delete "$DESKTOP\YouTube Desktop.lnk"
  
  ; Refresh shell icon cache by touching the icon cache
  ; This forces Windows to reload icons
  System::Call 'Shell32::SHChangeNotify(i 0x08000000, i 0x0000, p 0, p 0)'
!macroend

!macro customUnInstall
  ; Clean up shortcuts on uninstall
  Delete "$DESKTOP\YouTube Desktop.lnk"
  Delete "$SMPROGRAMS\YouTube Desktop\YouTube Desktop.lnk"
  RMDir "$SMPROGRAMS\YouTube Desktop"
!macroend
