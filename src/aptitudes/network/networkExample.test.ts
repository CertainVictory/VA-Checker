import { network } from '@oliveai/ldk';
import { oneLine } from 'common-tags';
import { NetworkWhisper } from '../../whispers';
import networkExample from './networkExample';
import {VetInfo} from '../../VetInfo'

jest.mock('@oliveai/ldk');

const mockNetworkShow = jest.fn();
jest.mock('../../whispers', () => {
  return {
    NetworkWhisper: jest.fn().mockImplementation(() => {
      return { show: mockNetworkShow };
    }),
  };
});

describe('Network Example', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, 0));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.useRealTimers();
  });




  it('should make a network request and display the result with a whisper', async () => {

    const query: VetInfo = {
      first_name: "Tamara",   
      last_name:"Ellis",
      middle_name: "E",
      ssn: "796130115",
      birth_date: "1967-06-19",
      gender: "F",
    }
    const responseStub: network.HTTPResponse = {
      statusCode: 200,
      body: new Uint8Array(),
      headers: {},
    };
    const responseBodyStub = { results: [] };
    network.httpRequest = jest.fn().mockResolvedValueOnce(responseStub);
    network.decode = jest.fn().mockResolvedValueOnce(JSON.stringify(responseBodyStub));

     

    await networkExample.run(query)

    expect(network.httpRequest).toBeCalledWith( {
      method: 'POST',
      url: oneLine`https://sandbox-api.va.gov/services/veteran_confirmation/v0/status`,
      headers:
      {    
        'apiKey' : ['WTL49eehXWUdgqGmDOgs2kErBNcm8c3f'],
        'Content-Type' : ['application/json']
      },
      body: JSON.stringify(query)
    });
    expect(network.decode).toBeCalledWith(responseStub.body);
    expect(NetworkWhisper).toBeCalledWith(responseBodyStub.results);
    expect(mockNetworkShow).toBeCalled();
  });
});
