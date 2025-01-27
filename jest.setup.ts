import 'whatwg-fetch';
import '@testing-library/jest-dom';
import { server } from './src/shared/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
