import { RunnableSequence, RunnableMap } from '@langchain/core/runnables';
import ListLineOutputParser from '../outputParsers/listLineOutputParser';
import { PromptTemplate } from '@langchain/core/prompts';
import { formatChatHistoryAsString } from '@/lib/utils';
import { BaseMessage } from '@langchain/core/messages';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';

const suggestionGeneratorPrompt = `
You are an AI suggestion generator for an Ethereum wallet assistant. You will be given a conversation below. You need to generate 4-5 suggestions based on the conversation. The suggestion should be relevant to the conversation that can be used by the user to ask the chat model for more information or perform wallet actions.
You need to make sure the suggestions are relevant to the conversation and are helpful to the user. Keep a note that the user might use these suggestions to ask a chat model for more information or perform wallet operations.
Make sure the suggestions are medium in length and are informative and relevant to the conversation.

If the conversation is about wallet balances or crypto holdings, suggest follow-up actions like:
- Checking transaction history
- Sending crypto to another address
- Checking gas prices
- Viewing wallet summary
- Checking balances on other networks

If the conversation is about transactions, suggest:
- Checking transaction status
- Estimating gas costs
- Viewing transaction details
- Checking wallet balance after transaction

If the conversation is about general crypto/Ethereum topics, suggest relevant informational queries.

Provide these suggestions separated by newlines between the XML tags <suggestions> and </suggestions>. For example:

<suggestions>
Show me my recent transactions
What are the current gas prices?
How do I send ETH to another wallet?
Show me my wallet summary
</suggestions>

Conversation:
{chat_history}
`;

type SuggestionGeneratorInput = {
  chat_history: BaseMessage[];
};

const outputParser = new ListLineOutputParser({
  key: 'suggestions',
});

const createSuggestionGeneratorChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    RunnableMap.from({
      chat_history: (input: SuggestionGeneratorInput) =>
        formatChatHistoryAsString(input.chat_history),
    }),
    PromptTemplate.fromTemplate(suggestionGeneratorPrompt),
    llm,
    outputParser,
  ]);
};

const generateSuggestions = (
  input: SuggestionGeneratorInput,
  llm: BaseChatModel,
) => {
  (llm as unknown as ChatOpenAI).temperature = 0;
  const suggestionGeneratorChain = createSuggestionGeneratorChain(llm);
  return suggestionGeneratorChain.invoke(input);
};

export default generateSuggestions;
