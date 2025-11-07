import { SignedMessageItem } from "@/components/signed-message-item";
import type { SignedMessage } from "@/types/signature";

interface SignedMessageListProps {
  messages: SignedMessage[];
}

const SignedMessageList = ({ messages }: SignedMessageListProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {messages.map((message, index) => (
        <SignedMessageItem key={index} {...message} />
      ))}
    </div>
  );
};

export {SignedMessageList}
