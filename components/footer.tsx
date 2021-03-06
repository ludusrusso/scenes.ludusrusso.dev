import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Episode } from "../utils/getNextEpisode";
import { getEpisodeTitle } from "../utils/title";
import type { ChatMessage } from "./chat";

const Chat = dynamic(() => import("./chat"), {
  ssr: false,
});

const PinnedMessage = dynamic(() => import("./pin"), {
  ssr: false,
});

interface FooterProps {
  episode: Episode | null;
}

export const Footer = ({ episode }: FooterProps) => {
  const [msg, setMsg] = useState<string | undefined>();
  const onClicked = (msg: ChatMessage) => {
    setMsg(msg.msg);
  };

  if (!episode) {
    return (
      <FooterStyled className="bg-gray-900">
        <div>
          <h2 className="text-gray-200 text-4xl">No category</h2>
          <p className="text-gray-500 mt-4"> No episode </p>
        </div>
      </FooterStyled>
    );
  }
  return (
    <FooterStyled className="bg-gray-900">
      <PinnedMessage />
      <div>
        <h2 className="text-gray-200 text-4xl">{episode.category}</h2>
        <p
          className="text-gray-500 mt-4"
          dangerouslySetInnerHTML={{ __html: getEpisodeTitle(episode.title) }}
        ></p>
        {episode.guests[0] && (
          <p className="text-gray-400 mt-4 text-xl">
            con <strong>{episode.guests[0].guest.name}</strong>{" "}
            {episode.guests[1] && (
              <span>e {<strong>{episode.guests[1].guest.name}</strong>}</span>
            )}
          </p>
        )}
      </div>
      <Chat twitchChannel={episode.twitch} onClicked={onClicked} />
    </FooterStyled>
  );
};

const FooterStyled = styled.footer`
  position: relative;
  border-top: 10px solid #ccc;
  height: 200px;
  padding: 20px;
  font-size: 20pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
