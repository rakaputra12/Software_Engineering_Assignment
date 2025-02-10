# Eventure - Software Engineering Assignment
Raka Pradnya Putra Adita 8778662

WWI2022F


## Anleitung zum Starten der Anwendung


### Voraussetzungen

1.	Installierte Software:
*	Node.js (empfohlen: Version 16 oder höher) für das Frontend.
*	Python (empfohlen: Version 3.10 oder höher) für das Backend.
2.	Paketmanager:
*	**npm** (kommt mit Node.js) für die Abhängigkeiten des Frontends.
*	**pip** für die Abhängigkeiten des Backends.
3.	Abhängigkeiten installieren:
*	Stellen Sie sicher, dass **npm** und **pip** verfügbar sind und korrekt installiert wurden.
4.	Zusätzliche Tools:
*	Vite (enthalten in den Projektabhängigkeiten).
*	Ein Browser wie **Google Chrome**.

<br />


### Schirrt 1: Backend Starten (FastAPI)

1.	Navigieren Sie in das server-Verzeichnis:
```bash
cd server
```
2.	Erstellen Sie eine virtuelle Umgebung und aktivieren Sie sie:
```bash
python -m venv .venv

source .venv/bin/activate   # Für macOS/Linux
.venv\Scripts\activate      # Für Windows
```
3.	Installieren Sie die Python-Abhängigkeiten:
```bash
pip install -r requirements.txt
```
4.	Starten Sie den FastAPI-Server:
```bash
uvicorn app:app --reload
```
*   Der Server sollte standardmäßig auf http://127.0.0.1:8000 verfügbar sein.


<br />

### Schritt 2: Frontend starten (Vite + React.Js)

1.	Öffnen Sie ein neues Terminal und navigieren Sie in das client-Verzeichnis:
```bash
cd client
```
2.	Installieren Sie die JavaScript-Abhängigkeiten:
```bash
npm install
```
3.	Starten Sie die Entwicklungsumgebung:
```bash
npm run dev
```
*	Das Frontend sollte standardmäßig auf http://localhost:5173 verfügbar sein.

### Schritt 3: Anwendung verwenden

1.	Öffnen Sie Ihren Browser und navigieren Sie zu http://localhost:5173.
2.	Geben Sie die gewünschte Stadt, Kategorie und den Radius in das Suchformular ein.
3.	Überprüfen Sie die angezeigten Veranstaltungen, verwenden Sie die Karte und fügen Sie Ereignisse zu den Favoriten hinzu.


----

### Hinweis
*	Stellen Sie sicher, dass sowohl das Backend (FastAPI) als auch das Frontend (Vite) parallel ausgeführt werden (Auf zwei verschiedenen Terminals).
*	Falls Fehler auftreten:
    *	Überprüfen Sie die installierten Abhängigkeiten ( ``` npm install``` für das Frontend, ``` pip install -r requirements.txt```  für das Backend).
    *	Prüfen Sie die Konsolenausgabe von  ```uvicorn ``` und  ```npm run dev ``` auf Fehlermeldungen


## Anleitung zum Ausführen der Tests

### Voraussetzungen
1.	**Backend**:
*	Stellen Sie sicher, dass das Backend gestartet ist.
*	Wechseln Sie in das Verzeichnis server und starten Sie den Server:
```bash
cd server
uvicorn app:app --reload
```
Der Server sollte auf http://127.0.0.1:8000 laufen.

2.	**Frontend**:
*	Stellen Sie sicher, dass das Frontend gestartet ist.
*	Wechseln Sie in das Verzeichnis client und starten Sie das Frontend:
```bash
cd client
npm run dev
```
Das Frontend sollte auf http://localhost:5173 verfügbar sein.

3.	Zusätzliche Anforderungen:
*	**Selenium**:
    *	Installieren Sie selenium für Python: ```pip install selenium```
    *	Stellen Sie sicher, dass ChromeDriver installiert und in Ihrem PATH ist.
    *	Laden Sie die richtige Version von ChromeDriver herunter, die zu Ihrer Google Chrome-Version passt.
*	**Unittest**:
    *	Python enthält unittest standardmäßig. Keine zusätzliche Installation ist erforderlich.

<br />

### Schritt 1: Unit-Tests ausführen
1.	Navigieren Sie in das Hauptverzeichnis des Projekts:
```bash
cd /Software_Engineering_Assignment
```
2.	Aktivieren Sie die virtuelle Umgebung:
```bash
source server/.venv/bin/activate
```
3.	Führen Sie die Test im Verzeichnis tests mit folgendem Befehl aus:
```bash
python3 -m unittest discover -s tests
```
4.	Erwartetes Ergebnis:

*	Die Konsole zeigt Testergebnisse (z. B. Passed/Failed) mit Details zu allen Tests.
 
 <br />

### Schritt 2: Selenium-Tests ausführen
1.	Navigieren Sie in das Verzeichnis tests:
```bash
cd /Software_Engineering_Assignment/tests
```
2.	Stellen Sie sicher, dass die virtuelle Umgebung auf verwendetem Terminal aktiviert.
3.	Starten Sie den Selenium-Test:
```bash
python3 selenium_test.py
```
4.	Erwartetes Ergebnis:
*	Der Selenium-Test öffnet einen Chrome-Browser.
*	Die Anwendung wird im Browser geladen, und der Test interagiert automatisch mit der Benutzeroberfläche (z. B. Eingabe der Stadt, Kategorieauswahl, Bookmarking von Events).
*	Nach Abschluss des Tests wird ein Ergebnis in der Konsole ausgegeben:
    *	"Test Passed: Event was successfully bookmarked!" bei Erfolg.
    *	"Test Failed: [Fehlerdetails]" bei einem Fehler.
5.	Fehlerbehebung:
*	Überprüfen Sie, ob der ChromeDriver korrekt installiert ist und mit Ihrer Chrome-Version übereinstimmt.
*	Stellen Sie sicher, dass das Backend und das Frontend laufen, bevor Sie den Test starten.
 
 ----

### Test-Details
1. ***Unit-Tests (test_unit.py)***:
*	Testet die API des Backends.
*	Überprüft die korrekte Verarbeitung von Event-Daten und die Rückgabe der Ergebnisse.
2. ***Selenium-Tests (selenium_test.py)***:
*	Automatisiert die Benutzeroberfläche.
*	Überprüft die Funktionalität der Anwendung, einschließlich Eingabe, Suche und Bookmarking von Events.
