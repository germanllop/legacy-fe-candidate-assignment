import type { SignedMessageItemProps } from "@/components/signed-message-item";
import { SignedMessageItem } from "@/components/signed-message-item";
interface SignedMessageListProps {
    messages: SignedMessageItemProps[]
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
