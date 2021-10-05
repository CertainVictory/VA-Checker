import { whisper } from '@oliveai/ldk';

type VetStatus = string;
interface Props {
  vetStatusResult: VetStatus;
}
export default class NetworkWhisper {
  whisper: whisper.Whisper;

  label: string;

  props: Props;

  constructor(vetStatusResult: VetStatus) {
    this.whisper = undefined;
    this.label = 'Veteran Status Result';
    this.props = {
      vetStatusResult,
    };
  }

  createComponents() {

    const components = [];
      components.push({
        type: whisper.WhisperComponentType.ListPair,
        copyable: true,
        label: 'Veteran Status:',
        value: `${this.props.vetStatusResult}`,
        style: whisper.Urgency.None,

      });
    ;

    return components;
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: NetworkWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  close() {
    this.whisper.close(NetworkWhisper.onClose);
  }

  static onClose(err?: Error) {
    if (err) {
      console.error('There was an error closing Network whisper', err);
    }
    console.log('Network whisper closed');
  }
}
