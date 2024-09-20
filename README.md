# Crypto Balance Checker

[English](#english) | [Русский](#русский)

---

## English

### Overview
Crypto Balance Checker is a web application that allows users to generate cryptocurrency addresses using a seed phrase and view balances for multiple currencies, such as `Bitcoin`, `Ethereum`, `Litecoin`, `Dogecoin`, and `Dash`.

### Features
- Generate cryptocurrency addresses from a seed phrase.
- View balances in USD for multiple currencies.
- Switch between supported cryptocurrencies.

### Installation
1. Install dependencies:
    ```bash
    # client
    npm install
    # server
    cd crypto-backend && npm install
    ```

2. Setup variables in `crypto-backend/.env` file (a sample is provided)

3. Start the server:
    ```bash
    # cd crypto-backend
    npm run start
    ```
4. Start the client:
    ```bash
    npm run start
    ```

Note: Both sides can be run with nodemon (`npm run dev`)

5. Visit `http://localhost:3000` in your browser to access the app.

### Usage
- Enter a valid seed phrase (You can use this one for testing: `female absent wagon shell shrimp flip orbit alcohol banana hotel scan chef`).
- Click `Generate Addresses` to generate addresses for supported cryptocurrencies.
- View the generated addresses and click `View Balances` to see the balances in USD.
- Select currency to re-fetch balances in the desired currency

---

## Русский

### Обзор
Crypto Balance Checker — это веб-приложение, которое позволяет генерировать криптовалютные адреса с использованием сид-фразы и просматривать балансы для нескольких валют, таких как `Bitcoin`, `Ethereum`, `Litecoin`, `Dogecoin` и `Dash`.

### Возможности
- Генерация криптовалютных адресов с использованием сид-фразы.
- Просмотр балансов в USD для нескольких валют.
- Переключение между поддерживаемыми криптовалютами.

### Установка
1. Установить зависимости:
    ```bash
    # клиент
    npm install
    # сервер
    cd crypto-backend && npm install
    ```

2. Настройте переменные в файле `crypto-backend/.env` (пример предоставлен).

3. Запустить сервер:
    ```bash
    # перейдите в папку crypto-backend
    npm run start
    ```

4. Запустить клиент:
    ```bash
    npm run start
    ```

Примечание: Обе стороны могут запускаться с помощью nodemon (`npm run dev`).

5. Открыть http://localhost:3000 в браузере для доступа к приложению.

### Использование
- Введите действительную сид-фразу (Можно использовать это для тестирования: `female absent wagon shell shrimp flip orbit alcohol banana hotel scan chef`).
- Нажмите `Generate Addresses`, чтобы сгенерировать адреса для поддерживаемых криптовалют.
- Просмотрите сгенерированные адреса и нажмите `View Balances`, чтобы увидеть балансы в USD.
- Выберите валюту для обновления балансов в нужной валюте.
