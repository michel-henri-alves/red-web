import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChangeInitialPassword from './ChangeInitialPassword';

const mocks = vi.hoisted(() => ({
  changePassword: vi.fn(),
  updateUserSession: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock('../../shared/hooks/useUsers', () => ({
  changeInitialPasswordUser: () => ({ mutateAsync: mocks.changePassword }),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ updateUserSession: mocks.updateUserSession }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mocks.navigate };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText('password.current'), { target: { value: 'Temporary1!' } });
  fireEvent.change(screen.getByLabelText('password.new'), { target: { value: 'NewPermanent1!' } });
  fireEvent.change(screen.getByLabelText('password.confirm'), { target: { value: 'NewPermanent1!' } });
};

describe('ChangeInitialPassword', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);

  it('unlocks the local session only after a successful password change', async () => {
    mocks.changePassword.mockResolvedValue({ message: 'password.changed.successfully' });
    render(<ChangeInitialPassword />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: 'password.change' }));

    await waitFor(() => expect(mocks.changePassword).toHaveBeenCalledWith({
      currentPassword: 'Temporary1!',
      newPassword: 'NewPermanent1!',
      confirmPassword: 'NewPermanent1!',
    }));
    expect(mocks.updateUserSession).toHaveBeenCalledWith({ requiresInitialPasswordChange: false });
    expect(await screen.findByText('password.changed.successfully')).toBeInTheDocument();
  });

  it('keeps the session restricted when the API rejects the change', async () => {
    mocks.changePassword.mockRejectedValue(new Error('expired'));
    render(<ChangeInitialPassword />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: 'password.change' }));

    await waitFor(() => expect(mocks.changePassword).toHaveBeenCalled());
    expect(mocks.updateUserSession).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('does not submit when password confirmation differs', async () => {
    render(<ChangeInitialPassword />);
    fillValidForm();
    fireEvent.change(screen.getByLabelText('password.confirm'), { target: { value: 'Different123!' } });

    fireEvent.click(screen.getByRole('button', { name: 'password.change' }));

    expect(await screen.findByText('password.confirmation.mismatch')).toBeInTheDocument();
    expect(mocks.changePassword).not.toHaveBeenCalled();
  });
});
