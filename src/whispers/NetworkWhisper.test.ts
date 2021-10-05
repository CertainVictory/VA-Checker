import { whisper } from '@oliveai/ldk';
import { NetworkWhisper } from '.';

jest.mock('@oliveai/ldk');

const mockWhisperClose = jest.fn();

const TEST_PARAM = "Tamara Ellis (xxxxx0115) is Confirmed";

describe('Network Whisper', () => {
  beforeEach(() => {
    whisper.create = jest.fn().mockResolvedValueOnce({ close: mockWhisperClose });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates components as expected with proper onClick logic', () => {
    const newWhisper = new NetworkWhisper(TEST_PARAM);
    const actualComponents = newWhisper.createComponents();

    const expectedComponents = [
      expect.objectContaining({
        type: whisper.WhisperComponentType.ListPair,
        copyable: true,
        label: 'Veteran Status:',
        value: `Tamara Ellis (xxxxx0115) is Confirmed`,
        style: whisper.Urgency.None,
      }),
    ];

    expect(actualComponents).toEqual(expectedComponents);

    expect(whisper.create).toBeCalledWith(expect.objectContaining({
      value: `Joe is Confirmed`,
    }));
  });

  it('creates a whisper and closes it gracefully', async () => {
    const newWhisper = new NetworkWhisper(TEST_PARAM);
    newWhisper.show();
    await Promise.resolve();
    newWhisper.close();

    expect(whisper.create).toBeCalledWith(
      expect.objectContaining({
        label: 'Veteran Status Result',
        onClose: NetworkWhisper.onClose,
      })
    );
    expect(mockWhisperClose).toBeCalled();
  });

  it.each`
    scenario              | error
    ${'without an error'} | ${undefined}
    ${'with an error'}    | ${new Error('error')}
  `('should close properly $scenario', ({ error }) => {
    NetworkWhisper.onClose(error);

    if (error) {
      expect(console.error).toBeCalledWith('There was an error closing Network whisper', error);
    }
    expect(console.log).toBeCalledWith('Network whisper closed');
  });
});
