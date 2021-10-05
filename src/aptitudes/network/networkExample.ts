import { network } from '@oliveai/ldk';
import { oneLine } from 'common-tags';
import { VetInfo } from '../../VetInfo';

import { NetworkWhisper } from '../../whispers';

const run = async (query: VetInfo) => {
 
  const request: network.HTTPRequest = {
    method: 'POST',
    url: oneLine`https://sandbox-api.va.gov/services/veteran_confirmation/v0/status`,
    headers:
    {    
      'apiKey' : ['WTL49eehXWUdgqGmDOgs2kErBNcm8c3f'],
      'Content-Type' : ['application/json']
    },
    body: JSON.stringify(query)
  }

  const response = await network.httpRequest(request);
  const decodedBody = await network.decode(response.body);

  const secret = await secretBuilder(query.ssn);

  const whisper = new NetworkWhisper(await statusBuilder(decodedBody.toString(), query, secret)); //this is cheating LOL
    
    whisper.show();         
};

const secretBuilder = async (secretPhrase: string) => {
  var showOnlyDigits = 4;
  return secretPhrase = new Array(secretPhrase.length - showOnlyDigits + 1).join('x') + secretPhrase.slice(-showOnlyDigits);
}

const statusBuilder = async (rawStatus: string, query: VetInfo, secret: string) => {
  let decider: string;
  if(rawStatus === '{"veteran_status":"confirmed"}'){
    decider = `${query.first_name} ${query.last_name} (${secret}) is Confirmed`;
  } else if(rawStatus === '{"veteran_status":"not confirmed"}'){
    decider = `${query.first_name} ${query.last_name} (${secret}) is Not Confirmed`;
  }else{
    decider = "Please try again.";                
  }

  return decider;
}

export default { run };
