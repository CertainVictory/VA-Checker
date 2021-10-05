import { whisper } from '@oliveai/ldk';
import { IntroWhisper } from '.';

jest.mock('@oliveai/ldk');

const mockWhisperClose = jest.fn();
const mockWhisperUpdate = jest.fn();

describe('Intro Whisper', () => {
  beforeEach(() => {
    whisper.create = jest
      .fn()
      .mockResolvedValueOnce({ close: mockWhisperClose, update: mockWhisperUpdate });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates components as expected', () => {
    const newWhisper = new IntroWhisper();
    const actual = newWhisper.createComponents();

    // Check that we're getting expected component types in the expected order
    const expected = [
      expect.objectContaining({
        type: whisper.WhisperComponentType.Message,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Divider,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.CollapseBox,
        children: [expect.objectContaining({ type: whisper.WhisperComponentType.Markdown })],
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Divider,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Markdown,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.TextInput,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.TextInput,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.TextInput,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.TextInput,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.TextInput,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Select,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Divider,
      }),
      expect.objectContaining({
        type: whisper.WhisperComponentType.Markdown,
      }),
    ];

    expect(actual).toEqual(expected);
  });

  it('creates components with functional handlers', async () => {
    const newWhisper = new IntroWhisper();
    newWhisper.show();
    await Promise.resolve();
    const components = newWhisper.createComponents();

    // Check box's first and second button onClicks
    const box = components[5] as whisper.Box;
    // Check firstNameInput's onChange
    const firstNameInput = components[8] as whisper.TextInput;
    firstNameInput.onChange(null, 'Tamara', null);
    expect(console.log).toBeCalledWith('Text changed: ', 'Tamara');
    
    // Check middleNameInput's onChange
    const middleNameInput = components[8] as whisper.TextInput;
    middleNameInput.onChange(null, 'E', null);
    expect(console.log).toBeCalledWith('Text changed: ', 'E');
        
    // Check lastNameInput's onChange
    const lastNameInput = components[8] as whisper.TextInput;
    lastNameInput.onChange(null, 'E', null);
    expect(console.log).toBeCalledWith('Text changed: ', 'E');
        
    // Check ssnInput's onChange
    const ssnInput = components[8] as whisper.TextInput;
    ssnInput.onChange(null, 'E', null);
    expect(console.log).toBeCalledWith('Text changed: ', 'E');
        
    // Check birthdateInput's onChange
    const birthdateInput = components[8] as whisper.TextInput;
    birthdateInput.onChange(null, 'E', null);
    expect(console.log).toBeCalledWith('Text changed: ', 'E');

    // Check select's onSelect
    const select = components[17] as whisper.Select;
    select.onSelect(null, 0, null);
    expect(console.log).toBeCalledWith('Selected: ', 0);

    // Check button's onClick
    const button = components[12] as whisper.Button;
    button.onClick(null, null);
    expect(console.log).toBeCalledWith('Button clicked.');


  });

  it('uses default values for updatable components', async () => {
    const newWhisper = new IntroWhisper();
    newWhisper.show();
    await Promise.resolve();
    newWhisper.update({});

    expect(mockWhisperUpdate).toBeCalledWith({
      label: 'Veteran Status Checker',
      components: expect.arrayContaining([
        expect.objectContaining({
          type: whisper.WhisperComponentType.Message,
          body: 'You can search for a Patient\'s status below.',
        }),
      ]),
    });
  });  

  it('creates a whisper and closes it gracefully', async () => {
    const newWhisper = new IntroWhisper();
    newWhisper.show();
    await Promise.resolve();
    newWhisper.close();

    expect(whisper.create).toBeCalledWith(
      expect.objectContaining({
        label: 'Veteran Status Checker',
        onClose: IntroWhisper.onClose,
      })
    );
    expect(mockWhisperClose).toBeCalled();
  });

  it.each`
    scenario              | error
    ${'without an error'} | ${undefined}
    ${'with an error'}    | ${new Error('error')}
  `('should close properly $scenario', ({ error }) => {
    IntroWhisper.onClose(error);

    if (error) {
      expect(console.error).toBeCalledWith('There was an error closing Intro whisper', error);
    }
    expect(console.log).toBeCalledWith('Intro whisper closed');
  });
});
