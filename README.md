# UG Kalendarz - Instrukcja instalacji

## Wymagania

Przed przystąpieniem do instalacji upewnij się, że spełnione są następujące wymagania:

- PHP 7.3 lub nowsze
- MySQL 10.4.22-MariaDB
- Serwer Apache lub Nginx

## Przygotowanie aplikacji

1. **Pobranie repozytorium**: Sklonuj to repozytorium na swoje urządzenie.

2. **Przeniesienie folderów**: Przenieś foldery `UG-back` oraz `UG-front` do ścieżki `\path\xampp\htdocs\` lub innej zależnie czego używasz do postawienia serwera

3. **Konfiguracja serwera**:

   Skonfiguruj "document roots" (`\path\xampp\apache\conf\extra\httpd-vhosts.conf`) dla Twojego serwera:

   - Dla frontendu: `\path\UG-back\` z użyciem adresu URL `ug-zadanie.local`
   - Dla backendu: `\path\UG-front\` z użyciem adresu URL `api.ug-zadanie.local`

   Przykład konfiguracji dla serwera Apache:

   ```apache
   # Backend
   # Trzeba pamiętać o podaniu dobrego portu, domyślny to :80, a ja używam :8080
   # Trzeba pamiętać o podaniu dobrej ścieżki
   <VirtualHost api.ug-zadanie.local:8080>
       DocumentRoot "F:/XAMPP/htdocs/SmartbeesCheckout-back/"
       ServerName api.ug-zadanie.local
   </VirtualHost>

   # Frontend
   <VirtualHost ug-zadanie.local:8080>
       DocumentRoot "F:/XAMPP/htdocs/SmartbeesCheckout-front/"
       ServerName ug-zadanie.local
   </VirtualHost>
   ```
4. **Aktualizacja pliku hosta**:

   Zaktualizuj plik hosta, aby kierował na nowe domeny:

   - Windows: `c:\Windows\System32\Drivers\etc\hosts`
   - Linux: `/etc/hosts`
     
     Dodaj następujące wpisy:
    ```
    127.0.0.1   ug-zadanie.local
    127.0.0.1   api.ug-zadanie.local
    ```
5. **Zaimportuj bazę danych**:

   Plik do wykonania importu to `kalendarz.sql` w repozytorium.
   
6. **Skonfiguruj połączenie z bazą danych w backendzie, oraz domenę backendu we frontendzie**

   Plik do edycji to `\UG-back\classes\dbh.class.php`
    ```
    private $host = "localhost";     //Adres bazy danych
    private $port = "3306";          //Port bazy danych
    private $user = "root";      //Nazwa użytnownika który zarządza połączeniamy z bazą danych (Można dać "root")
    private $pwd = "root";          //Hasło do użytkownika powyżej (Można dać pustego stringa "") 
    private $dbname="kalendarz";      //Nazwa bazy danych (zostawić tak jak jest)
    ```

   Plik do edycji to `\UG-front\index.js`
   ```
   const apiUrl = "http://api.ug-zadanie.local:8080/includes/event.inc.php"; //Zmienić port na domyślny :80, ja używam :8080, lub zmienić url całowicie zależnie od domeny na której stawiamy API
   ```

7. **Otwórz przeglądarkę i przejdź do adresu api.ug-zadanie.local**



