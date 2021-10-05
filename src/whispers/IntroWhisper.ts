import { whisper } from '@oliveai/ldk';
import {VetInfo} from '../VetInfo'
import { networkExample } from '../aptitudes';

interface Props {
  newMessage: string;
  numClones: number;
  label: string;
  searchResults: string;
}

export default class IntroWhisper {
  whisper: whisper.Whisper;

  label: string;

  props: Props;

  vetInfoRequest: VetInfo;

  constructor() {
    this.whisper = undefined;
    this.label = 'Veteran Status Checker';
    this.vetInfoRequest = {
      ssn: "",
      birth_date: "",
      last_name: "",
      first_name:"",
      middle_name:"",
      gender:""
    };
    this.props = {
      newMessage: '',
      numClones: 1,
      label: '',
      searchResults: '',      
    };    
  }

  createComponents() {
    const divider: whisper.Divider = {
      type: whisper.WhisperComponentType.Divider,
    };

    // Intro message.
    const introMessage: whisper.Message = {
      type: whisper.WhisperComponentType.Message,
      body: 'You can search for a Patient\'s status below.',
      style: whisper.Urgency.Success,
    };
    const heading: whisper.Markdown = {
      type: whisper.WhisperComponentType.Markdown,
      body: '# Patient Info',
    };

    const firstNameInput: whisper.TextInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'First Name',
      onChange: (_error: Error | undefined, val) => {
        this.vetInfoRequest.first_name = val;
        console.log('Text changed: ', val);
      },
    };

    const middleNameInput: whisper.TextInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Middle Name',
      onChange: (_error: Error | undefined, val) => {
        this.vetInfoRequest.middle_name = val;
        console.log('Text changed: ', val);
      },
    };

    const lastNameInput: whisper.TextInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Last Name',
      onChange: (_error: Error | undefined, val) => {
        this.vetInfoRequest.last_name = val;
        console.log('Text changed: ', val);
      },
    };

    const ssnInput: whisper.TextInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'SSN',
      onChange: (_error: Error | undefined, val) => {
        this.vetInfoRequest.ssn = val;
        console.log('Text changed: ', val);
      },
    };

    const birthdateInput: whisper.TextInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Birth Date',
      onChange: (_error: Error | undefined, val) => {
        this.vetInfoRequest.birth_date = val;
        console.log('Text changed: ', val);
      },
    };
    const select: whisper.Select = {
      type: whisper.WhisperComponentType.Select,
      label: 'Gender',
      options: ['M', 'F'],
      selected: -1,      
      onSelect: (_error: Error | undefined, val: number) => {
        
        this.vetInfoRequest.gender = select.options[val].toString();
        console.log('Selected: ', val);
      },
    };

    const button: whisper.Button = {
      type: whisper.WhisperComponentType.Button,
      label: 'Button',
      onClick: (_error: Error | undefined) => {
        

    this.getVetStatus(this.vetInfoRequest);

        

        console.log('Button clicked.');        
      },
    };


    // const button: whisper.Button = {
    //   type: whisper.WhisperComponentType.Button,
    //   label: 'Button',
    //   onClick: (_error: Error | undefined) => {
    //     networkExample.run(this.vetInfoRequest);
    //   },
    // };
    // const updatableComponentsHeading: whisper.Markdown = {
    //   type: whisper.WhisperComponentType.Markdown,
    //   body: '# Updatable Whisper Components',
    // };
    // const updatableMessage: whisper.Message = {
    //   type: whisper.WhisperComponentType.Message,
    //   header: 'This is a component hooked up to Updatable Whisper logic',
    //   body: this.props.searchResults || 'Please input VA info above.',
    //   style: whisper.Urgency.Success,
    // };

    const clonedComponents: whisper.ChildComponents[] = [];


    return [
      introMessage,
      divider,
      heading,
      firstNameInput,
      middleNameInput,
      lastNameInput,
      ssnInput,
      birthdateInput,
      select,
      button,
      divider,
      ...clonedComponents,
    ];
  }


  getVetStatus = async (query: VetInfo) => {         
    networkExample.run(query);
  }



  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: IntroWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  update(props: Partial<Props>) {
    this.props = { ...this.props, ...props };
    this.whisper.update({
      label: this.props.label || this.label,
      components: this.createComponents(),
    });
  }

  close() {
    this.whisper.close(IntroWhisper.onClose);
  }

  static onClose(err?: Error) {
    if (err) {
      console.error('There was an error closing Intro whisper', err);
    }
    console.log('Intro whisper closed');
  }
}
