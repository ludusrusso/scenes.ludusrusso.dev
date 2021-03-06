import { ApolloProvider, useSubscription } from "@apollo/client";
import styled from "@emotion/styled";
import gql from "graphql-tag";
import { useState } from "react";
import { newApolloClientWithWs } from "../apollo";

const COMMAND = gql`
  subscription Commands {
    commands {
      __typename
      ... on PinMessage {
        msg
        author
      }
    }
  }
`;

interface Message {
  msg: string;
  author: string;
}

const PinnedMessage = () => {
  const [message, setMessage] = useState<Message | undefined>();
  useSubscription(COMMAND, {
    onSubscriptionData: (data) => {
      const cmd = data.subscriptionData.data.commands;
      if (cmd.__typename === "PinMessage") {
        setMessage({
          author: cmd.author,
          msg: cmd.msg,
        });
      } else {
        setMessage(undefined);
      }
    },
  });

  if (!message) {
    return null;
  }
  return (
    <PinnedMessageStyled className="">
      <div className="w-full flex justify-center">
        <div className="rounded-lg bg-stone-200 p-10 min-w-[700px] max-w-7xl gradient-border shadow-2xl ease-in duration-300">
          <img
            src="/gopher-dance.gif"
            alt="dancing-gopher"
            className="block mb-6"
          />
          <h2 className="font-bold text-stone-800 text-4xl">{message.msg}</h2>
          <p>by {message.author}</p>
        </div>
      </div>
    </PinnedMessageStyled>
  );
};

const PinnedMessageStyled = styled.footer`
  position: fixed;
  bottom: 250px;
  width: 100%;
`;

const client = newApolloClientWithWs("https://olg.dev.ludusrusso.space/query");
export default function PinMessage() {
  return (
    <ApolloProvider client={client}>
      <PinnedMessage />
    </ApolloProvider>
  );
}
