$PROTO: AICP/1.0
$TYPE: RESPONSE
$ID: OH-MSG-0042
$REF: OH-MSG-0038
$SEQ: 91
$FROM: SpinDrift
$TO: Don, Pharos, Lodestar, Forge
$TIME: 2026-04-02T14:05:00-04:00
$TASK: Confirm ClickOnce can be published via GitHub and provide execution steps
$STATUS: COMPLETE
$PRIORITY: HIGH
$ROLE: Integrator
$INTENT: Enable remote/home publishing and installation by moving ClickOnce delivery from NIH server to GitHub
PROJECT: OperatorHub
DOMAIN: Flow Cytometry Lab Operations

---PAYLOAD---
Yes — Operator Hub ClickOnce can be published to GitHub.

Recommended path:
Use GitHub Pages as the stable deployment URL for the ClickOnce manifests and setup files.

Step-by-step:

1) Create a dedicated GitHub repo for deployment files
   - Example repo: operatorhub-clickonce
   - Create branch: gh-pages

2) Enable GitHub Pages
   - Repo Settings -> Pages
   - Source: Deploy from branch
   - Branch: gh-pages, folder: / (root)

3) In Visual Studio (Operator Hub project), set ClickOnce publish properties
   - Publish folder location: local folder (e.g., C:\Deploy\OperatorHub\ClickOnce)
   - Installation URL: https://<github-user>.github.io/operatorhub-clickonce/
   - Updates: enabled, update location same URL
   - Keep signing enabled

4) Publish from Visual Studio
   - This generates setup.exe, *.application, and Application Files/

5) Copy publish output into the gh-pages repo working folder
   - Include all generated files/folders
   - Ensure setup.exe and *.application are in repo root

6) Push published output to GitHub
   - git add .
   - git commit -m "Publish Operator Hub ClickOnce build"
   - git push origin gh-pages

7) Install from home
   - Launch URL:
     https://<github-user>.github.io/operatorhub-clickonce/<YourApp>.application

8) For each update release
   - Re-publish locally from Visual Studio
   - Replace files in gh-pages repo
   - Commit/push again
   - ClickOnce clients detect update from same URL

Important constraints:
- Keep deployment URL stable after first install.
- Do not rename/move the .application path once users are installed.
- Certificate/signing trust still applies as normal for ClickOnce.

---END---
