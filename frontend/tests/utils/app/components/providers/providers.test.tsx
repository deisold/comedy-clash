import { render, screen, waitFor } from '@testing-library/react';
import { AppProvider, useAppContext } from '../../../../../app/components/providers/providers';
import { useBlockchainState } from '../../../../../app/components/providers/BlockchainStateProvider';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../../../../../app/components/providers/BlockchainStateProvider', () => ({
  useBlockchainState: jest.fn(),
}));

jest.mock('../../../../../app/source/adapters/ComedyTheaterAdapter');
jest.mock('../../../../../app/source/adapters/MockComedyTheaterAdapter');
jest.mock('../../../../../app/source/adapters/ComedyClashAdapter');
jest.mock('../../../../../app/source/adapters/MockComedyClashAdapter');

jest.mock('../../../../../app/source/repositories/ComedyTheaterRepo', () => ({
  ComedyTheaterRepo: jest.fn(() => ({
    isManager: jest.fn(() => Promise.resolve(true)),
  })),
}));

jest.mock('../../../../../app/source/repositories/ComedyClashRepo');

describe('AppProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (useBlockchainState as jest.Mock).mockReturnValue({
      isLoading: true,
      provider: null,
      error: null,
    });

    render(
      <AppProvider>
        <div>Child Component</div>
      </AppProvider>
    );

    expect(screen.getByText('Initializing application...')).toBeInTheDocument();
  });

  it('renders error state if initialization fails', async () => {
    (useBlockchainState as jest.Mock).mockReturnValue({
      isLoading: false,
      provider: null,
      error: new Error('Blockchain Error'),
    });

    render(
      <AppProvider>
        <div>Child Component</div>
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Blockchain Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('provides context to children after successful initialization', async () => {
    (useBlockchainState as jest.Mock).mockReturnValue({
      isLoading: false,
      provider: {},
      error: null,
    });

    render(
      <AppProvider>
        <ChildComponent />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Is Manager: true')).toBeInTheDocument();
    });
  });
});

// Helper Child Component for Testing Context
const ChildComponent = () => {
  const { isManager } = useAppContext();
  return <div>Is Manager: {isManager ? 'true' : 'false'}</div>;
};