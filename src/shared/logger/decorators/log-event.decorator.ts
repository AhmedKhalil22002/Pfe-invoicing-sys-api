import { SetMetadata } from '@nestjs/common';
import { EventType } from 'puppeteer';

// Define a custom decorator
export const LogEvent = (event: EventType) => SetMetadata('event', event);
