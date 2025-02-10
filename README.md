# Vidapuntacana Project

## Project Setup

Follow these steps to set up the project on your local machine.

### Prerequisites

- Node.js (version 20.x or later)

### Environment Variables

Set up the following environment variables in your `.env` file:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bW92aW5nLXJlZGZpc2gtNTEuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_f1vhINJ2Hu3UWsTQT9VNoQt6fHBGy5zJF8bucGWqLa

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/en/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/en/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/en/complete-profile
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/en/complete-profile

# Database Configuration
DB_HOST=localhost
DB_USER=vivo_user
DB_PASSWORD=vivo_password
DB_NAME=vivopuntacana
DB_PORT=3306

DB_AIVEN_HOST=mysql-2909344d-anasdev-8ca5.h.aivencloud.com
DB_AIVEN_USER=vivo_user
DB_AIVEN_PASSWORD=AVNS_6w0JdPw0TwAmo5KAf8z
DB_AIVEN_DB=vivopuntacana
DB_AIVEN_PORT=26072

WEBHOOK_SECRET=whsec_t05OAjqNZq8GUicoN+KWz6hlLu3JVZgE

CLERK_PEM_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq/frnIN2gEHbgxhcma5f\n4ptxody8cO2FVn8vTD47+H0Hn3WvRQfGNIn/iI1b4vIxHeDUZ+UhJVYYfHz35p09\nYsTYXPr7DiMybtghN45E07HkR6kE9kEGmbBdzT01XREhr4/Sk3l6QNgC2ywm14ON\n3DgUKrBcV63ayzrZ+Jrutaue8Bl8EBLBx4Me9IiSf2V6nPuA92evFlXSHFDscX+5\nqJAkBaLuNfcRtt2t1FsM4RG+gYnAY47nMX38z2sw+ToGShaPyGDo7xRhaPcMZWdO\n4Y43vNTwAEA63gx0+/lbye0Ey4Om+IsPw0dfDRhdy9+j08vRAhSkZmBC6ZWOOEMx\n0QIDAQAB\n-----END PUBLIC KEY-----"
```

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/vidapuntacana.git
   cd vidapuntacana
   ```

2. **Install dependencies:**
   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

### Running the Project

To start the development server, run:

```bash
npm start
```

Or using yarn:

```bash
yarn start
```

The project should now be running at `http://localhost:3000`.

### Building the Project

To create a production build, run:

```bash
npm run build
```

Or using yarn:

```bash
yarn build
```

### Testing

To run tests, use:

```bash
npm test
```

Or using yarn:

```bash
yarn test
```

### Running Migrations

To run migrations, ensure the variables in the `database.json` file are correctly set up for the respective environments (dev, test, prod).

### Receiving Clerk Webhooks

To receive Clerk webhooks, refer to the [Clerk Webhooks Documentation](https://docs.clerk.dev/reference/webhooks).

### Contributing

If you would like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

### License

This project is licensed under the MIT License.
