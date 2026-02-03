
# Invoicing System API

This is the backend API for the Invoicing System, built with [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), and [Swagger](https://swagger.io/). It provides a robust, modular, and scalable foundation for managing invoicing, user management, payments, and more.

---

## Technologies & Libraries

- **NestJS**: Progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeORM**: ORM for TypeScript and JavaScript (ES7, ES6, ES5).
- **Swagger**: API documentation and testing.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **i18n**: Internationalization support.
- **Mailer**: Email sending capabilities.
- **Socket.IO**: Real-time communication.

---

## Deep Description

### Core Features

- **User Management**: Registration, authentication (JWT), roles, and permissions.
- **Firm & Contacts**: Manage firms, addresses, interlocutors, and related entities.
- **Invoicing**: Create, update, and manage invoices, quotations, and payment conditions.
- **Payments**: Record and track payments, bank accounts, and tax withholdings.
- **Internationalization (i18n)**: Multi-language support for all user-facing content.
- **Notifications & Emails**: Email sending via mailer, templated notifications.
- **Logging & Auditing**: Centralized logging with Winston, activity tracking.
- **API Documentation**: Swagger UI for interactive API docs.
- **Real-time Updates**: WebSocket support for live updates.

### Modular Architecture

Each business domain (e.g., invoice, user, payment) is encapsulated in its own module under `src/modules/`. Shared logic (e.g., authentication, database, mail, logging) is in `src/shared/`.

### Configuration

- All environment-specific settings are managed in `src/configs/`.
- Database migrations and seeders are in `src/migrations/` and `src/seeders/`.
- Localization files are in `src/i18n/`.

### Development

- **Run in dev mode:** `yarn start:dev`
- **Run tests:** `yarn test`
- **Build for production:** `yarn build`
- **Seed database:** `yarn seed:all`

---

## Resources

- [NestJS Boilerplate](https://github.com/brocoders/nestjs-boilerplate)
- [NestJS Project Structure Example](https://gist.github.com/prateekkathal/afc22d9cfbf64751d66222a23157684f)

---

## License

This project is UNLICENSED and for internal use only.
