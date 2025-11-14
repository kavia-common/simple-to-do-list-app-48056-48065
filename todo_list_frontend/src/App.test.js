import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders header title and input placeholder', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /to-do/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/add a new task/i)).toBeInTheDocument();
  // Welcome banner region should be present
  expect(screen.getByRole('region', { name: /welcome message/i })).toBeInTheDocument();
});

test('renders progress sections Today and This Week', () => {
  render(<App />);
  expect(screen.getByRole('region', { name: /progress summary/i })).toBeInTheDocument();
  expect(screen.getByText(/today/i)).toBeInTheDocument();
  expect(screen.getByText(/this week/i)).toBeInTheDocument();
});

test('adds a task via Add button', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/add a new task/i);
  fireEvent.change(input, { target: { value: 'Buy milk' } });
  fireEvent.click(screen.getByRole('button', { name: /add task/i }));
  expect(screen.getByText(/buy milk/i)).toBeInTheDocument();
});

test('adds a task via Enter key', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/add a new task/i);
  fireEvent.change(input, { target: { value: 'Walk dog' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  expect(screen.getByText(/walk dog/i)).toBeInTheDocument();
});
